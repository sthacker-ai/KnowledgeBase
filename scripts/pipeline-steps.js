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
 * @param {string|number|null} limit  Tweet limit passed to import/extract/classify/course.
 *                                    Pass null / undefined for no limit.
 * @returns {Array<{id:string, label:string, cmd:string}>}
 */
function getSteps(limit) {
  const lim = limit ? ` --limit ${limit}` : "";
  return [
    {
      id:    "import",
      label: "Import X Likes",
      cmd:   `node scripts/import-x-likes.js${lim}`,
    },
    {
      id:    "extract",
      label: "Source extraction",
      cmd:   `node scripts/import-x-source.js${lim}`,
    },
    {
      id:    "transcripts",
      label: "Video transcripts",
      cmd:   `node scripts/extract-transcripts.js${lim}`,
    },
    {
      id:    "classify",
      label: "AI classification",
      cmd:   `node scripts/classify-source.js${lim}`,
    },
    {
      id:    "course",
      label: "Course generation",
      cmd:   `node scripts/compile-course.js${lim}`,
    },
    {
      id:    "summary",
      label: "Topic summaries",
      cmd:   "node scripts/update-topic-summary.js",
    },
    {
      id:    "graph",
      label: "Graph build",
      cmd:   "node scripts/build-graph.js",
    },
    {
      id:    "assets",
      label: "Hero images",
      cmd:   "node scripts/generate-course-assets.js --no-diagrams",
    },
    {
      id:    "podcasts",
      label: "Podcasts",
      cmd:   "node scripts/generate-podcast.js",
    },
    {
      id:    "obsidian",
      label: "Obsidian vault export",
      cmd:   "node scripts/export-obsidian.js",
    },
  ];
}

module.exports = { getSteps };
