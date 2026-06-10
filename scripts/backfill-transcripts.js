#!/usr/bin/env node
/**
 * scripts/backfill-transcripts.js
 *
 * Backfills all pending video transcripts, then regenerates courses, summaries
 * and the knowledge graph. Runs in batches so the machine stays responsive.
 *
 * Each cycle:
 *   1. extract-transcripts  --limit <batch>   (download + Groq transcribe)
 *   2. classify-source                         (classify any new sources)
 *   3. compile-course                          (regenerate courses with new transcripts)
 *   4. update-topic-summary                    (refresh topic summaries)
 *   5. build-graph                             (rebuild knowledge graph)
 *
 * Stops automatically when a transcript batch produces 0 new transcripts.
 *
 * Usage:
 *   node scripts/backfill-transcripts.js [--batch 10] [--pause 60]
 *   npm run transcripts:backfill
 *
 * Logs to: logs/backfill-transcripts-YYYY-MM-DD.log  (IST timestamps)
 */

"use strict";

const fs            = require("fs");
const path          = require("path");
const { spawnSync } = require("child_process");
require("dotenv").config();

const ROOT     = path.resolve(__dirname, "..");
const LOGS_DIR = path.join(ROOT, "logs");
if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });

// ── Args ──────────────────────────────────────────────────────────────────────
function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i !== -1 ? process.argv[i + 1] : null;
}
const BATCH_SIZE = parseInt(argValue("--batch") || "10", 10);
const PAUSE_SECS = parseInt(argValue("--pause") || "60", 10);

// ── Logging ───────────────────────────────────────────────────────────────────
function istNow() {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
}

const TODAY    = new Date().toISOString().slice(0, 10);
const LOG_PATH = path.join(LOGS_DIR, `backfill-transcripts-${TODAY}.log`);

function log(msg) {
  const line = `[${istNow()} IST] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_PATH, line + "\n", "utf8");
}

function logLine(line) {
  console.log(line);
  fs.appendFileSync(LOG_PATH, line + "\n", "utf8");
}

function logSep() {
  logLine("------------------------------------------------------------");
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

// ── Run a single node script step ─────────────────────────────────────────────
function runStep(label, scriptArgs) {
  logSep();
  log(`  Step: ${label}`);
  logSep();

  const startMs = Date.now();
  const result  = spawnSync("node", scriptArgs, {
    cwd:       ROOT,
    encoding:  "utf8",
    maxBuffer: 50 * 1024 * 1024,
    timeout:   6 * 60 * 60 * 1000, // 6 hr hard cap (10 videos × 30min local whisper each)
    env:       process.env,
  });

  const elapsed  = ((Date.now() - startMs) / 1000).toFixed(1);
  const combined = ((result.stdout || "") + (result.stderr || "")).trim();
  if (combined) combined.split("\n").forEach((l) => log(l));
  logLine("");

  if (result.error) {
    log(`ERROR: "${label}" failed — ${result.error.message}`);
    return { ok: false, output: combined };
  }
  if (result.status !== 0) {
    log(`ERROR: "${label}" exited with code ${result.status} after ${elapsed}s`);
    return { ok: false, output: combined };
  }

  log(`"${label}" completed in ${elapsed}s`);
  logLine("");
  return { ok: true, output: combined };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  log("============================================================");
  log(`KnowledgeBase Transcript Backfill — ${TODAY}`);
  log(`  Batch size : ${BATCH_SIZE}`);
  log(`  Pause      : ${PAUSE_SECS}s between cycles`);
  log(`  Log file   : ${LOG_PATH}`);
  log("============================================================");
  logLine("");

  let cycleNum   = 1;
  let totalSaved = 0;
  const failedDownloads = []; // { tweet_id, url }

  while (true) {
    log("============================================================");
    log(`Cycle ${cycleNum} starting`);
    log("============================================================");
    logLine("");

    // 1. Transcripts ──────────────────────────────────────────────────────────
    const txResult = runStep(
      `Transcripts (cycle ${cycleNum}, limit ${BATCH_SIZE})`,
      ["scripts/extract-transcripts.js", "--limit", String(BATCH_SIZE)]
    );

    if (!txResult.ok) {
      log(`WARNING: transcript step had errors. Checking how many were saved...`);
    }

    const saved = (txResult.output.match(/transcript saved/g) || []).length;
    totalSaved += saved;

    // Collect failed downloads from this batch
    const failLines = txResult.output.match(/tweet_id=(\S+) download failed.*/g) || [];
    const urlLines  = txResult.output.match(/\[transcripts\] URL: (https:\/\/\S+)/g) || [];
    for (const line of failLines) {
      const idMatch = line.match(/tweet_id=(\S+)/);
      if (!idMatch) continue;
      const tweetId = idMatch[1];
      // Find matching URL line
      const urlLine = urlLines.find(u => txResult.output.includes(`tweet_id=${tweetId}\n[transcripts] URL:`));
      const urlMatch = txResult.output.match(new RegExp(`tweet_id=${tweetId}[\\s\\S]*?\\[transcripts\\] URL: (https://\\S+)`));
      failedDownloads.push({ tweet_id: tweetId, url: urlMatch ? urlMatch[1] : "unknown" });
    }

    if (saved === 0) {
      log(`Cycle ${cycleNum}: 0 new transcripts — backfill complete.`);
      logLine("");
      break;
    }

    log(`Cycle ${cycleNum}: ${saved} new transcript(s). Running downstream steps...`);
    logLine("");

    // 2. Classify ─────────────────────────────────────────────────────────────
    const clsResult = runStep("AI classification", ["scripts/classify-source.js"]);
    if (!clsResult.ok) log("WARNING: classify failed — continuing anyway");

    // 3. Compile courses ───────────────────────────────────────────────────────
    const courseResult = runStep("Course generation", ["scripts/compile-course.js"]);
    if (!courseResult.ok) log("WARNING: course generation failed — continuing anyway");

    // 4. Topic summaries ───────────────────────────────────────────────────────
    const summaryResult = runStep("Topic summaries", ["scripts/update-topic-summary.js"]);
    if (!summaryResult.ok) log("WARNING: topic summaries failed — continuing anyway");

    // 5. Knowledge graph ───────────────────────────────────────────────────────
    const graphResult = runStep("Graph build", ["scripts/build-graph.js"]);
    if (!graphResult.ok) log("WARNING: graph build failed");

    log(`Cycle ${cycleNum} complete. Total transcripts so far: ${totalSaved}`);
    logLine("");

    cycleNum++;
    log(`Waiting ${PAUSE_SECS}s before next cycle...`);
    logLine("");
    await sleep(PAUSE_SECS * 1000);
  }

  // Final downstream pass after all transcripts are done ─────────────────────
  if (totalSaved > 0) {
    log("Running final downstream pass (classify → courses → summaries → graph)...");
    logLine("");
    runStep("AI classification (final)",  ["scripts/classify-source.js"]);
    runStep("Course generation (final)",  ["scripts/compile-course.js"]);
    runStep("Topic summaries (final)",    ["scripts/update-topic-summary.js"]);
    runStep("Graph build (final)",        ["scripts/build-graph.js"]);
  }

  logLine("");
  logSep();
  log(`Backfill complete. Total transcripts saved: ${totalSaved}`);
  logSep();

  // Print failed downloads summary
  if (failedDownloads.length > 0) {
    logLine("");
    log(`============================================================`);
    log(`yt-dlp FAILED DOWNLOADS (${failedDownloads.length} total):`);
    log(`============================================================`);
    failedDownloads.forEach((f, i) => {
      log(`  ${String(i + 1).padStart(3)}. tweet_id=${f.tweet_id}`);
      log(`       URL: ${f.url}`);
    });
    logLine("");
    log("These are likely geo-restricted, deleted, or require X auth.");
    log("To retry later: node scripts/extract-transcripts.js --tweet-id <id>");
  } else {
    log("All downloads succeeded — no failures.");
  }
}

main().catch((err) => {
  log(`FATAL: ${err.message}`);
  process.exit(1);
});
