"use strict";

/**
 * scripts/lib/run-summary.js
 *
 * Turns a pipeline step's raw console output into a short, human-readable
 * one-liner (e.g. "4 hero image(s) generated") for the daily run digest
 * (HTML page + email). Each step already prints its own "Done." / summary
 * line at the end of its run — this just extracts the numbers from that
 * existing text rather than requiring every script to emit a separate
 * machine-readable format.
 *
 * If a step's output doesn't match its expected pattern (e.g. the script's
 * log wording changes later), summarizeStepOutput returns null and the
 * caller should fall back to a generic status-only line — this must never
 * throw or block the pipeline.
 */

const STEP_SUMMARY_PATTERNS = {
  import: {
    re: /\[import\] imported=(\d+)/,
    fmt: (m) => `${m[1]} new tweet(s) imported`,
  },
  extract: {
    re: /\[extract\] done ok=(\d+) errors=(\d+)|\[extract\] Nothing to process\./,
    fmt: (m) => m[1] === undefined ? "nothing new to extract" : `${m[1]} source(s) extracted${+m[2] ? `, ${m[2]} error(s)` : ""}`,
  },
  transcripts: {
    re: /\[transcripts\] Done\. (\d+)\/(\d+) transcribed, (\d+) skipped \(no audio\), (\d+) error/,
    fmt: (m) => `${m[1]}/${m[2]} transcribed, ${m[3]} skipped (no audio)${+m[4] ? `, ${m[4]} error(s)` : ""}`,
  },
  classify: {
    re: /\[classify\] Done\. (\d+) classified, (\d+) fallback/,
    fmt: (m) => `${m[1]} classified${+m[2] ? `, ${m[2]} fallback(s)` : ""}`,
  },
  course: {
    re: /\[course\] Done\. (\d+)\/(\d+) courses generated, (\d+) error/,
    fmt: (m) => `${m[1]}/${m[2]} course(s) generated${+m[3] ? `, ${m[3]} error(s)` : ""}`,
  },
  summary: {
    re: /\[summary\] Done\. (\d+)\/(\d+) summaries generated/,
    fmt: (m) => `${m[1]}/${m[2]} topic summaries updated`,
  },
  graph: {
    re: /\[graph\] Built graph: (\d+) nodes, (\d+) edges/,
    fmt: (m) => `${m[1]} nodes, ${m[2]} edges`,
  },
  assets: {
    re: /Images:\s+(\d+) generated, (\d+) already existed, (\d+) errors/,
    fmt: (m) => `${m[1]} hero image(s) generated${+m[3] ? `, ${m[3]} error(s)` : ""}`,
  },
  podcasts: {
    re: /Audios:\s+(\d+) generated, (\d+) already existed, (\d+) errors/,
    fmt: (m) => `${m[1]} podcast(s) generated${+m[3] ? `, ${m[3]} error(s)` : ""}`,
  },
  obsidian: {
    re: /Topics:\s+(\d+)[\s\S]*?Courses:\s+(\d+)[\s\S]*?Sources:\s+(\d+)/,
    fmt: (m) => `${m[2]} course(s), ${m[1]} topic(s), ${m[3]} source(s) synced`,
  },
  upload_media: {
    re: /\[r2\] Done\. (\d+) uploaded, (\d+) error\(s\)/,
    fmt: (m) => `${m[1]} new file(s) uploaded to R2${+m[2] ? `, ${m[2]} error(s)` : ""}`,
  },
  git_push: {
    re: /\[publish\] Done\. (\d+) file\(s\) published\.|\[publish\] Nothing new to commit\./,
    fmt: (m) => m[1] === undefined ? "nothing new to publish" : `${m[1]} file(s) committed and pushed to GitHub`,
  },
};

function summarizeStepOutput(stepId, output) {
  const pattern = STEP_SUMMARY_PATTERNS[stepId];
  if (!pattern || !output) return null;
  const m = output.match(pattern.re);
  if (!m) return null;
  try {
    return pattern.fmt(m);
  } catch {
    return null;
  }
}

module.exports = { summarizeStepOutput };
