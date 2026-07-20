"use strict";

/**
 * scripts/pipeline-steps.js
 *
 * Single source of truth for every pipeline step.
 *
 * Both run-pipeline.js (ad-hoc / loop) and scheduled-daily.js (Task Scheduler)
 * import getSteps() from here.  Any time a step is added, removed, or renamed,
 * this is the ONLY file that needs to change.
 *
 * Step order:
 *   import → extract → classify → course → summary → graph → assets → podcasts
 *
 * Each step carries resilience metadata consumed by the runners:
 *   critical  If true, a failure aborts the whole pipeline. Default false —
 *             a failed step is logged and the pipeline continues. Every step
 *             is idempotent and processes whatever work is available, so a
 *             failed import (e.g. expired X session) must NOT stop downstream
 *             steps from processing already-imported sources.
 *   retries   Extra attempts for transient failures, with backoff between them.
 *             Set only on steps that hit flaky external services (scraping,
 *             downloads). Auth failures are deterministic, so import stays 0.
 *
 * @param {string|number|null} limit  Tweet limit passed to import/extract/classify/course.
 *                                    Pass null / undefined for no limit.
 * @returns {Array<{id:string, label:string, cmd:string, critical:boolean, retries:number}>}
 */
function getSteps(limit) {
  const lim = limit ? ` --limit ${limit}` : "";
  return [
    {
      id:    "import",
      label: "Import X Likes",
      cmd:   `node scripts/import-x-likes.js${lim}`,
      critical: false,
      // 1 retry: an expired/dead session fails deterministically (retrying
      // wastes ~6s), but a transient network drop (net::ERR_CONNECTION_RESET
      // from a flaky connection) can genuinely succeed on retry — worth the
      // small cost either way.
      retries:  1,
    },
    {
      id:    "extract",
      label: "Source extraction",
      cmd:   `node scripts/import-x-source.js${lim}`,
      critical: false,
      retries:  1, // scrapes external pages — one retry for network blips
    },
    {
      id:    "transcripts",
      label: "Video transcripts",
      cmd:   `node scripts/extract-transcripts.js${lim}`,
      critical: false,
      retries:  1, // downloads media — one retry for network blips
    },
    {
      id:    "classify",
      label: "AI classification",
      cmd:   `node scripts/classify-source.js${lim}`,
      critical: false,
      retries:  0,
    },
    {
      id:    "course",
      label: "Course generation",
      cmd:   `node scripts/compile-course.js${lim}`,
      critical: false,
      retries:  0,
    },
    {
      id:    "summary",
      label: "Topic summaries",
      cmd:   "node scripts/update-topic-summary.js",
      critical: false,
      retries:  0,
    },
    {
      id:    "graph",
      label: "Graph build",
      cmd:   "node scripts/build-graph.js",
      critical: false,
      retries:  0,
    },
    {
      id:    "assets",
      label: "Hero images",
      cmd:   "node scripts/generate-course-assets.js --no-diagrams",
      critical: false,
      retries:  0,
    },
    {
      id:    "podcasts",
      label: "Podcasts",
      cmd:   "node scripts/generate-podcast.js",
      critical: false,
      retries:  0,
    },
    {
      id:    "obsidian",
      label: "Obsidian vault export",
      cmd:   "node scripts/export-obsidian.js",
      critical: false,
      retries:  0,
    },
  ];
}

module.exports = { getSteps };
