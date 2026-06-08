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
const { spawnSync } = require("child_process");
const { getSteps } = require("./pipeline-steps");

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

function run(label, cmd) {
  logSep();
  log(`  Step: ${label}`);
  logSep();
  log(`CMD: ${cmd}`);
  logLine("");
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
    log(`ERROR: Step "${label}" failed after ${elapsed}s — ${errMsg}`);
    runManifest.steps.push({ name: label, status: "failed", duration_secs: parseFloat(elapsed), error: errMsg.slice(0, 200) });
    return false;
  }

  log(`Step "${label}" completed in ${elapsed}s`);
  logLine("");
  runManifest.steps.push({ name: label, status: "ok", duration_secs: parseFloat(elapsed) });
  return true;
}

async function main() {
  runStartMs              = Date.now();
  runManifest.started_at_ist = istNow();

  log("============================================================");
  log(`KnowledgeBase Daily Scheduled Import — ${TODAY}`);
  log("============================================================");
  logLine("");

  // Steps come from pipeline-steps.js — the single source of truth.
  // To add/remove/rename a step, edit pipeline-steps.js only.
  const likeLimit = process.env.SCHEDULE_LIKES_LIMIT || "25";
  const steps = getSteps(likeLimit);

  for (const step of steps) {
    if (!run(step.label, step.cmd)) {
      log(`ABORT: Step "${step.label}" failed. Stopping pipeline.`);
      log("      Next scheduled run will retry automatically.");
      saveManifest("aborted"); return;
    }
  }

  logLine("");
  log("============================================================");
  log("Daily scheduled run complete. All steps succeeded.");
  log("============================================================");
  saveManifest("ok");
}

main().catch((err) => {
  log(`FATAL: ${err.message}`);
  process.exit(1);
});
