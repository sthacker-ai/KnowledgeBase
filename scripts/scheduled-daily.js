#!/usr/bin/env node
"use strict";

/**
 * scripts/scheduled-daily.js
 *
 * Run by Windows Task Scheduler daily at 6:00 AM.
 * Runs the full pipeline: import → extract → classify → courses → summary → graph → assets → podcasts.
 *
 * Steps are defined in pipeline-steps.js — the single source of truth shared
 * with run-pipeline.js.  To add or remove a step, edit pipeline-steps.js only.
 *
 * Log output is written to: data/runs/scheduled-YYYY-MM-DD.log
 */

require("dotenv").config({ quiet: true });

const fs   = require("fs");
const path = require("path");
const { spawnSync, spawn } = require("child_process");
const { getSteps } = require("./pipeline-steps");
const { getXSessionStatus } = require("./lib/x-session");

const ROOT     = process.cwd();
const RUNS_DIR = path.join(ROOT, "data", "runs");
const LOGS_DIR = path.join(ROOT, "logs", "runs");

// ── Lazy DB pool (optional — skipped if DATABASE_URL not set) ─────────────────
let _dbPool = null;
function getDbPool() {
  if (_dbPool) return _dbPool;
  const url = (process.env.DATABASE_URL || "").trim();
  if (!url) return null;
  try {
    const { Pool } = require("pg");
    _dbPool = new Pool({ connectionString: url, max: 2, idleTimeoutMillis: 20_000 });
    _dbPool.on("error", () => { _dbPool = null; });
    return _dbPool;
  } catch { return null; }
}

// Ensure output dirs exist
fs.mkdirSync(RUNS_DIR, { recursive: true });
fs.mkdirSync(LOGS_DIR, { recursive: true });

// IST timestamp helper (UTC+5:30)
function istNow() {
  return new Date().toLocaleString("en-IN", {
    timeZone:  "Asia/Kolkata",
    hour12:    false,
    year:      "numeric", month:  "2-digit", day:    "2-digit",
    hour:      "2-digit", minute: "2-digit", second: "2-digit",
  }) + " IST";
}

const TODAY    = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // YYYY-MM-DD in IST
const LOG_PATH = path.join(LOGS_DIR, `scheduled-${TODAY}.log`);

// Append to today's log (safe for multiple runs per day)
function log(msg) {
  const line = `[${istNow()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_PATH, line + "\n", "utf8");
}

// Run manifest — written to JSON at end of run for the /runs page
const runManifest = {
  trigger:         "scheduled",
  date:            TODAY,
  started_at_ist:  null,
  finished_at_ist: null,
  duration_secs:   null,
  status:          "running",
  steps:           [],
};
let runStartMs = 0;

function saveManifest(status) {
  runManifest.status          = status;
  runManifest.finished_at_ist = istNow();
  runManifest.duration_secs   = parseFloat(((Date.now() - runStartMs) / 1000).toFixed(1));
  const manifestPath = path.join(RUNS_DIR, `scheduled-${TODAY}-manifest.json`);
  try { fs.writeFileSync(manifestPath, JSON.stringify(runManifest, null, 2), "utf8"); } catch { /* ignore */ }

  // Also persist to PostgreSQL (fire-and-forget — never blocks the run)
  const pool = getDbPool();
  if (pool) {
    pool.query(
      `INSERT INTO pipeline_runs (run_id, trigger, run_date, duration_secs, status, steps)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (run_id) DO UPDATE SET
         finished_at   = NOW(),
         duration_secs = EXCLUDED.duration_secs,
         status        = EXCLUDED.status,
         steps         = EXCLUDED.steps`,
      [
        `scheduled-${TODAY}`,
        "scheduled",
        TODAY,
        runManifest.duration_secs,
        status,
        JSON.stringify(runManifest.steps),
      ]
    ).catch(() => {}); // fire and forget
  }
}

// Write a raw line (no timestamp) — used for child process output
function logLine(line) {
  console.log(line);
  fs.appendFileSync(LOG_PATH, line + "\n", "utf8");
}

function logSep() {
  logLine("------------------------------------------------------------");
}

// Run a single command once. Returns { ok, elapsed, errMsg }.
function runOnce(cmd) {
  const startMs = Date.now();

  // Split cmd into program + args for spawnSync
  const parts = cmd.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
  const prog  = parts[0];
  const args  = parts.slice(1);

  const result = spawnSync(prog, args, {
    cwd:      ROOT,
    encoding: "utf8",
    maxBuffer: 50 * 1024 * 1024, // 50 MB
    env:      process.env,
  });

  const elapsed = ((Date.now() - startMs) / 1000).toFixed(1);

  // Write captured child output line-by-line with timestamps
  const childOutput = ((result.stdout || "") + (result.stderr || "")).trim();
  if (childOutput) {
    childOutput.split("\n").forEach((line) => log(line));
  }
  logLine("");

  if (result.status !== 0 || result.error) {
    const errMsg = result.error ? result.error.message : `exit code ${result.status}`;
    return { ok: false, elapsed, errMsg };
  }
  return { ok: true, elapsed };
}

// Run a step, with optional retries + backoff for transient failures.
// Returns true on success, false on failure (after exhausting retries).
function run(label, cmd, retries = 0) {
  logSep();
  log(`  Step: ${label}`);
  logSep();
  log(`CMD: ${cmd}`);
  logLine("");

  const attempts = retries + 1;
  let last;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    if (attempt > 1) {
      const backoff = 5 * (attempt - 1); // 5s, 10s, ...
      log(`Retry ${attempt - 1}/${retries} for "${label}" in ${backoff}s...`);
      spawnSync("timeout", ["/t", String(backoff), "/nobreak"], { cwd: ROOT, encoding: "utf8", shell: true });
    }
    last = runOnce(cmd);
    if (last.ok) {
      const note = attempt > 1 ? ` (attempt ${attempt})` : "";
      log(`Step "${label}" completed in ${last.elapsed}s${note}`);
      logLine("");
      runManifest.steps.push({ name: label, status: "ok", duration_secs: parseFloat(last.elapsed) });
      return true;
    }
  }

  log(`ERROR: Step "${label}" failed after ${last.elapsed}s — ${last.errMsg}`);
  runManifest.steps.push({ name: label, status: "failed", duration_secs: parseFloat(last.elapsed), error: last.errMsg.slice(0, 200) });
  return false;
}

// Pre-flight: warn (but never block) when the saved X session is expiring/dead.
// A dead session only degrades the import step now — the rest of the pipeline
// still runs — but surfacing it here makes the cause obvious in the log.
function preflightXSession() {
  try {
    const s = getXSessionStatus({ root: ROOT });
    runManifest.x_session = { status: s.status, expiresAt: s.expiresAt, daysUntilExpiry: s.daysUntilExpiry };
    const prefix = s.status === "ok" ? "OK" : "WARNING";
    log(`[preflight] X session: ${prefix} — ${s.message}`);
    logLine("");
  } catch (err) {
    log(`[preflight] X session check skipped: ${err.message}`);
    logLine("");
  }
}

// ── Prod Build + Restart ──────────────────────────────────────────────────────
// Called automatically at the end of a successful pipeline run.
function runProdBuild() {
  logLine("");
  log("============================================================");
  log("Prod Build & Deploy");
  log("============================================================");
  logLine("");

  // Kill any existing Next.js server on port 3006
  log("Checking for existing server on port 3006...");
  try {
    const netstat = spawnSync("netstat", ["-ano"], { encoding: "utf8", cwd: ROOT });
    const lines   = (netstat.stdout || "").split("\n");
    const pids    = [...new Set(
      lines
        .filter((l) => l.includes(":3006") && l.includes("LISTENING"))
        .map((l) => l.trim().split(/\s+/).pop())
        .filter(Boolean),
    )];
    if (pids.length) {
      pids.forEach((pid) => {
        spawnSync("taskkill", ["/PID", pid, "/F"], { encoding: "utf8" });
        log(`  Killed PID ${pid} (was on port 3006)`);
      });
      // Brief pause for port release
      spawnSync("timeout", ["/t", "3", "/nobreak"], { cwd: ROOT, encoding: "utf8", shell: true });
    } else {
      log("  No existing process on port 3006.");
    }
  } catch (e) {
    log(`  Warning: could not check port 3006: ${e.message}`);
  }

  // npm run build
  log("Running npm run build...");
  logLine("");
  const buildStart  = Date.now();
  const buildResult = spawnSync("cmd", ["/c", "npm run build"], {
    cwd:       ROOT,
    encoding:  "utf8",
    maxBuffer: 100 * 1024 * 1024,
    env:       process.env,
  });
  const buildElapsed = ((Date.now() - buildStart) / 1000).toFixed(1);
  const buildOutput  = ((buildResult.stdout || "") + (buildResult.stderr || "")).trim();
  if (buildOutput) buildOutput.split("\n").forEach((l) => log(l));
  logLine("");

  if (buildResult.status !== 0 || buildResult.error) {
    const errMsg = buildResult.error ? buildResult.error.message : `exit code ${buildResult.status}`;
    log(`ERROR: npm run build failed after ${buildElapsed}s — ${errMsg}`);
    runManifest.steps.push({ name: "Prod build", status: "failed", duration_secs: parseFloat(buildElapsed), error: errMsg.slice(0, 200) });
    return;
  }

  log(`npm run build completed in ${buildElapsed}s`);
  runManifest.steps.push({ name: "Prod build", status: "ok", duration_secs: parseFloat(buildElapsed) });

  // Start prod server in a detached window (keeps running after this script exits)
  try {
    const child = spawn("cmd", ["/k", `cd /d "${ROOT}" && npm start`], {
      cwd:         ROOT,
      detached:    true,
      stdio:       "ignore",
      windowsHide: false,
    });
    child.unref();
    runManifest.steps.push({ name: "Prod server restart", status: "ok", duration_secs: 0 });
    log("Prod server started on port 3006 → http://localhost:3006");
  } catch (e) {
    log(`WARNING: Could not start prod server: ${e.message}`);
    runManifest.steps.push({ name: "Prod server restart", status: "failed", duration_secs: 0, error: e.message });
  }
}

async function main() {
  runStartMs              = Date.now();
  runManifest.started_at_ist = istNow();

  log("============================================================");
  log(`KnowledgeBase Daily Scheduled Import — ${TODAY}`);
  log("============================================================");
  logLine("");

  // Warn early if the X login session is expiring/dead (informational).
  preflightXSession();

  // Steps come from pipeline-steps.js — the single source of truth.
  // To add/remove/rename a step, edit pipeline-steps.js only.
  const likeLimit = process.env.SCHEDULE_LIKES_LIMIT || "25";
  const steps = getSteps(likeLimit);

  // Continue-on-error: every step is idempotent and processes whatever work is
  // available, so a failed step (e.g. import with an expired X session) must
  // not stop the rest of the pipeline. Only a step flagged `critical` aborts.
  const failed = [];
  let aborted  = false;
  for (const step of steps) {
    if (!run(step.label, step.cmd, step.retries || 0)) {
      failed.push(step.label);
      if (step.critical) {
        log(`ABORT: Critical step "${step.label}" failed. Stopping pipeline.`);
        log("      Next scheduled run will retry automatically.");
        aborted = true;
        break;
      }
      log(`Step "${step.label}" failed — continuing with remaining steps.`);
      logLine("");
    }
  }

  logLine("");
  log("============================================================");
  if (aborted) {
    log(`Daily scheduled run ABORTED. Failed: ${failed.join(", ")}`);
  } else if (failed.length) {
    log(`Daily scheduled run completed with ${failed.length} failed step(s): ${failed.join(", ")}`);
  } else {
    log("Daily scheduled run complete. All steps succeeded.");
  }
  log("============================================================");

  // Rebuild the site unless the run aborted on a critical step — we still want
  // whatever new content the surviving steps produced to go live.
  if (!aborted) runProdBuild();

  saveManifest(aborted ? "aborted" : failed.length ? "completed_with_errors" : "ok");
}

main().catch((err) => {
  log(`FATAL: ${err.message}`);
  process.exit(1);
});
