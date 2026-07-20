#!/usr/bin/env node
"use strict";

/**
 * scripts/git-publish.js
 *
 * Stages and commits everything the daily pipeline is expected to produce
 * (generated content + the R2 media manifest), then pushes to origin/main so
 * Vercel's GitHub integration picks up the new content on its next deploy.
 *
 * Deliberately scoped to content/ and data/ only — never app/, scripts/, or
 * docs/, so an unattended daily run can never sweep up in-progress code
 * changes into a commit. If there's nothing new to commit, this is a no-op
 * (not an error) — every step here is idempotent, matching the rest of the
 * pipeline's continue-on-error design.
 *
 * Usage:
 *   node scripts/git-publish.js
 */

const { execSync } = require("child_process");

const ROOT = process.cwd();
const PATHS = ["content", "data"];

function run(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: "utf8" });
}

function main() {
  run(`git add ${PATHS.join(" ")}`);

  const staged = run("git diff --cached --name-only").trim();
  if (!staged) {
    console.log("[publish] Nothing new to commit. Done.");
    return;
  }

  const fileCount = staged.split("\n").length;
  const today = new Date().toISOString().slice(0, 10);

  run(
    `git commit -m "content: daily pipeline update — ${today}" ` +
    `-m "Automated commit from scheduled-daily.js. ${fileCount} file(s) changed."`
  );
  console.log(`[publish] Committed ${fileCount} file(s).`);

  run("git push origin main");
  console.log("[publish] Pushed to origin/main. Vercel will redeploy automatically.");
  console.log(`[publish] Done. ${fileCount} file(s) published.`);
}

try {
  main();
} catch (e) {
  console.error("[publish] Fatal:", e.message);
  process.exit(1);
}
