# KnowledgeBase Implementation Plan

> **Status (2026-07-06):** This is the original founding plan from May 2026.
> All 8 phases below are now implemented — the checklists are marked complete
> for the historical record. For the current state of the product, phase
> status, and known gaps, see `PRD.md`. For the current design system, see
> `docs/brandguide.md`. For the most recent session-by-session summary, see
> the latest `handover-*.md` in the repo root.

## Current Project Intent

Build a local-first personal knowledge system that imports liked X/Twitter posts,
extracts their linked/embedded learning material, and turns each source into
courseware. Related sources should accumulate under shared topic folders, and
each topic should maintain a living summary course that improves as new sources
arrive.

The same Markdown content should work in:

- the Next.js web app
- Obsidian as a local vault
- GitHub as versioned source control

## User Decisions Captured

- X/Twitter handle: `@Pond_er_er`
- First import limit: `10` liked tweets per run
- Import should support both on-demand and scheduled runs
- Existing `MyTweets` scraper may be reused, but code should be copied/refactored
  into this repo so there is only one project to maintain
- Local AI provider: Ollama
- Ollama endpoint: `http://localhost:11434`
- Ollama model: `gemma4:e2b`
- Start free/local-first; avoid hosted databases for now
- Use the repo-local `content/` folder as the Obsidian vault

## Sample Sources To Test

1. X-hosted video:
   `https://x.com/sairahul1/status/2056411519337042350`
2. X article / long-form post:
   `https://x.com/sairahul1/status/2056292143472202110`

For the X article, the scraper should attempt to preserve article text and any
embedded rich/code/canvas-like blocks. If the block cannot be faithfully
converted to Markdown, store a screenshot or structured raw HTML/DOM extract as
supporting evidence.

## Storage Model

The canonical source of truth should be local files.

```text
content/
  sources/
    x/
      <tweet-id>.md
    youtube/
      <video-id>.md
    articles/
      <slug>.md
  courses/
    <topic-slug>/
      course-001.md
      course-002.md
      summary.md
  wiki/
    <Topic Name>.md
  assets/
    x/
    articles/
    videos/

data/
  raw/
    tweets/
      <tweet-id>.json
  transcripts/
  indexes/
    seen-tweets.json
    topics.json
    graph.json
  runs/
    <timestamp>.json
```

## Tweet Record Fields

Each imported tweet should preserve:

- `tweet_id`
- `tweet_url`
- `author_handle`
- `author_name`
- `tweet_text`
- `tweet_published_at`
- `scraped_at`
- `liked_by`
- `media`
- `image_urls`
- `video_urls`
- `outbound_urls`
- `source_type`
- `topic_slug`
- `topic_label`
- `processing_status`
- `error`

## Courseware Behavior

For every imported source:

1. Save raw source data.
2. Save a human-readable source Markdown note.
3. Classify topic/category.
4. Extract article/video/transcript/text/media.
5. Generate one source-specific course:
   `content/courses/<topic-slug>/course-XXX.md`
6. Update or create:
   `content/courses/<topic-slug>/summary.md`
7. Update or create:
   `content/wiki/<Topic Name>.md`
8. Rebuild graph index:
   `data/indexes/graph.json`

Example:

```text
content/courses/claude-code/course-001.md
content/courses/claude-code/course-002.md
content/courses/claude-code/summary.md
content/wiki/Claude Code.md
```

The summary page should synthesize all courses under that topic, not just append
the newest one.

## Planned Scripts

Add these scripts to the main `Knowledge base` repo:

```text
scripts/import-x-likes.js
scripts/import-x-source.js
scripts/extract-source.js
scripts/compile-course.js
scripts/update-topic-summary.js
scripts/build-graph.js
scripts/run-pipeline.js
```

Suggested package scripts:

```json
{
  "import:x-likes": "node scripts/import-x-likes.js --limit 10",
  "import:x-source": "node scripts/import-x-source.js",
  "process:sources": "node scripts/run-pipeline.js",
  "graph:build": "node scripts/build-graph.js"
}
```

## Import Strategy

Use Playwright first, based on the existing `MyTweets` project.

Changes from `MyTweets`:

- remove Google Sheets dependency
- write raw JSON and Markdown locally
- keep dedupe in `data/indexes/seen-tweets.json`
- keep run logs in `data/runs/`
- support `--limit 10`
- support `--mode latest`, `--mode backfill`, and later `--mode retry`
- use a saved X session state file

Potential storage state path:

```text
data/private/x-storage-state.json
```

Add `data/private/` to `.gitignore`.

## Dedupe Strategy

Maintain `data/indexes/seen-tweets.json`.

Shape:

```json
{
  "tweet_ids": {
    "2056411519337042350": {
      "first_seen_at": "2026-05-20T00:00:00.000Z",
      "tweet_url": "https://x.com/sairahul1/status/2056411519337042350",
      "status": "imported"
    }
  }
}
```

Before saving a new tweet, check this index. If present, skip it. This makes
on-demand and scheduled runs idempotent.

## AI Strategy

Use Ollama first.

Environment variables:

```bash
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma4:e2b
```

The scripts should do the tool work:

- fetch tweet data
- fetch linked pages
- fetch transcripts
- save files

The model should only receive extracted text/metadata and return structured
JSON or Markdown.

If `gemma4:e2b` is too weak for polished courseware, keep the provider interface
pluggable so a hosted API model can be added later without rewriting the
pipeline.

## Video Strategy

For YouTube:

- fetch transcript first
- embed original video iframe in generated courseware
- store transcript under `data/transcripts/`

For X-hosted video:

- capture tweet metadata and media URLs if available
- embed tweet/video where possible
- if transcript is unavailable, mark as `needs_transcription`
- later add local audio extraction/transcription if needed

## X Article Strategy

For X long-form articles:

- open the tweet/article in Playwright
- extract visible article text
- extract links and images
- attempt to extract code blocks or rich embedded blocks
- if a canvas/code window cannot be converted cleanly, save a screenshot in
  `content/assets/x/<tweet-id>/`
- reference the screenshot from the source note/course

## Scheduling Options

Start with manual/on-demand:

```bash
npm run import:x-likes
npm run process:sources
```

Then add one of:

1. Windows Task Scheduler
2. Codex automation heartbeat/cron if appropriate
3. A local `node-cron` scheduler process

Preferred first durable option: Windows Task Scheduler, because it works without
keeping this chat session alive.

## Implementation Phases

### Phase 1: Local Importer ✅ Complete

- [x] Copy/refactor useful Playwright scraping logic from `MyTweets`
- [x] Add local env variables to `.env.example`
- [x] Add `data/private/` and generated data patterns to `.gitignore`
- [x] Implement `scripts/import-x-likes.js`
- [x] Save raw tweet JSON to `data/raw/tweets/`
- [x] Save source notes to `content/sources/x/`
- [x] Maintain `data/indexes/seen-tweets.json`
- [x] Test with `--limit 10`

### Phase 2: Single Source Extraction ✅ Complete

- [x] Implement `scripts/import-x-source.js`
- [x] Test direct source import for sample tweet 1
- [x] Test direct source import for sample tweet 2
- [x] Extract article text / rich blocks / screenshots where possible
- [x] Detect X-hosted video vs YouTube vs article vs plain tweet

### Phase 3: AI Classification ✅ Complete

- [x] Add Ollama client wrapper (superseded by the fuller `ai-client.js`
      chain: OpenRouter → NVIDIA NIM → Ollama, see `PRD.md` §3.2)
- [x] Classify topic/category from tweet/source text
- [x] Generate topic slug and label
- [x] Save topic index to `data/indexes/topics.json`
- [x] Add retry/fallback if model output is malformed

### Phase 4: Course Generation ✅ Complete

- [x] Generate source-specific course Markdown
- [x] Include original tweet metadata
- [x] Include embedded video/tweet/article reference
- [x] Include chapters, exercises, key takeaways, and review questions
- [x] Save as `content/courses/<topic-slug>/course-XXX.md`

### Phase 5: Living Topic Summary ✅ Complete

- [x] Read all courses for a topic
- [x] Generate/update `summary.md`
- [x] Preserve source references
- [x] Add "what changed since last update" section
- [x] Add `[[wikilinks]]` to related topics

### Phase 6: Graph ✅ Complete

- [x] Parse Markdown wikilinks
- [x] Parse frontmatter tags/topics
- [x] Build `data/indexes/graph.json`
- [x] Show real graph data in the Next.js app (now theme-aware D3 — see
      `docs/brandguide.md`)
- [x] Ensure Obsidian can see equivalent links via Markdown

### Phase 7: Web App Views ✅ Complete

- [x] Source inbox page (`/sources`, plus `/filtered` for excluded tweets)
- [x] Topic page (`/courseware/[topic]`, `/wiki/[topic]`)
- [x] Course reader page (`/courseware/[topic]/[course]`)
- [x] Summary course page (topic wiki page)
- [x] Graph page (`/graph`)
- [x] Processing status page (`/runs`, `/admin` right sidebar)

### Phase 8: Scheduling ✅ Complete

- [x] Add on-demand import command
- [x] Add Windows Task Scheduler instructions
- [x] Add run logs
- [x] Add failure report page or file (`/runs`, plus continue-on-error status
      `completed_with_errors` — see `docs/architecture.md`)

## Next Session Resume Point (historical — all 8 phases now complete)

This section described the Phase 1 bootstrap in May 2026 and is kept for
history. It no longer reflects the current resume point. As of 2026-07-06,
the project is past all 8 phases above and into ongoing maintenance +
hosting work — see `PRD.md` §11 "Phases & Status" and "Known Gaps" for what's
actually next, and the latest `handover-*.md` for exactly where a prior
session left off.

For X session renewal specifically (the one recurring manual step), see
`docs/x-importer.md` — the manual cookie-copy path replaced
`npm run import:x-login` as the primary method, since automated login is
blocked by X bot-detection for this account.

## Open Questions For Later (resolved)

- **Should X raw media be downloaded locally or referenced by URL first?** →
  Referenced by URL for images/tweets; video is downloaded temporarily for
  transcription (`data/transcripts/tmp/`, git-ignored, not retained) then
  discarded — the transcript text is what's kept.
- **Should generated courseware include screenshots by default or only when
  rich content cannot be represented in Markdown?** → Screenshots were not
  needed in practice; X article/video content converts to Markdown/transcript
  text directly. Not implemented, not currently blocking anything.
- **Should topic matching be conservative, asking for user confirmation when
  uncertain?** → No — `classify-source.js` assigns a topic automatically
  (falling back to `uncategorized`); the admin console's relevance filters
  (`/admin` → Topic Relevance Filters, reviewable at `/filtered`) are the
  actual quality-control mechanism, applied before classification rather than
  as a per-tweet confirmation step.
- **Should low-confidence topics go into `content/courses/uncategorized/`?** →
  Yes, this is exactly what happens today.
