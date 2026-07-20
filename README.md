# KnowledgeBase

A **local-first personal knowledge base** that automatically ingests X/Twitter liked posts, transcribes videos, and uses AI to generate structured courseware and wiki pages — all browsable via a Next.js web app.

---

## Architecture

```mermaid
flowchart LR
    X["X/Twitter Likes"] -->|import-x-likes.js| RAW["data/raw/*.json"]
    YT["YouTube / X Video"] -->|yt-dlp + Groq/Whisper| TRANS["data/transcripts/"]
    RAW -->|import-x-source.js| EXTRACT["Extracted content"]
    EXTRACT -->|extract-transcripts.js for videos| TRANS
    EXTRACT -->|classify-source.js + OpenRouter| CLASSIFY["topic_slug assigned"]
    CLASSIFY -->|compile-course.js| COURSES["content/courses/topic/course-NNN.md"]
    COURSES -->|update-topic-summary.js| WIKI["content/wiki/topic.md"]
    COURSES & WIKI -->|build-graph.js| GRAPH["data/indexes/graph.json"]
    COURSES & WIKI & GRAPH -->|Next.js 15| APP["http://localhost:3005"]
    APP --> ADMIN["Admin Console /admin"]
    APP --> LEARN["Learning Tracker (PostgreSQL)"]
    COURSES -->|export-obsidian.js| VAULT["data/obsidian-vault/"]
```

---

## Features

| Feature | Description |
|---|---|
| **X/Twitter ingestion** | Pulls liked tweets via Playwright scraper; excluded tweets reviewable at `/filtered` |
| **Video transcription** | yt-dlp + Groq API (fast, free) with faster-whisper fallback |
| **AI courseware** | OpenRouter → NVIDIA NIM → Ollama fallback chain generates rich course docs per source |
| **Hero images** | Replicate FLUX Schnell generates a 16:9 header image per course |
| **Podcasts** | Kokoro 82M (via OpenRouter) turns each course into a 2-host audio dialogue |
| **Topic category nav** | Browse topics as cards; each topic has its own page with course list + search |
| **Wiki pages** | Per-topic reference pages with [[wikilinks]] |
| **Knowledge graph** | Interactive, theme-aware D3 force-directed graph at `/graph` |
| **Admin console** | Run pipeline steps, edit AI prompts, import URLs — **localhost-only**, see [Deployment](#deployment) |
| **Run history** | Per-run manifest with step-level status at `/runs`, including partial (`completed_with_errors`) runs |
| **Token tracking** | Per-call token usage log at `/tokens` |
| **Learning tracker** | PostgreSQL — track progress, reading sessions, daily streaks |
| **Obsidian export** | Full vault export with [[wikilinks]], ready to open in Obsidian |
| **Pipeline resilience** | A failed step (e.g. an expired X session) no longer aborts the whole daily run — see [Pipeline Resilience](#pipeline-resilience) |
| **Daily automation** | Windows Task Scheduler — import runs daily at noon IST, prod rebuild at 1 PM (currently disabled, see below) |
| **Dark theme ("Nocturne")** | Dark-first UI with a gold/rose accent, glass surfaces, and a light-mode toggle — see `docs/brandguide.md` |

---

## Tech Stack

- **Frontend:** Next.js 15 (App Router) + React 19 + TypeScript
- **Styling:** CSS custom properties (no Tailwind) — "Nocturne" dark-first theme, see `docs/brandguide.md`
- **Fonts:** Space Grotesk (display/body) + JetBrains Mono (numerals/IDs), self-hosted via `next/font/google`
- **Scraping:** Playwright (headless Chromium)
- **Transcription:** yt-dlp + Groq API (`whisper-large-v3-turbo`, free tier) → faster-whisper fallback
- **AI text:** OpenRouter (primary/fallback models set via env) → NVIDIA NIM → Ollama local fallback, with a per-run circuit breaker — see `scripts/lib/ai-client.js`
- **AI images:** Replicate (`black-forest-labs/flux-schnell`, ~$0.003/image — the one paid step)
- **AI voice:** Kokoro 82M via OpenRouter, optional Orpheus-FastAPI GPU upgrade
- **Database:** PostgreSQL (learning tracker, run history, token usage — content stays file-based)
- **Graph:** D3.js v7 (theme-aware — reads live CSS variables)
- **Dev/prod isolation:** separate build directories (`.next-dev` / `.next`) via `distDir` in `next.config.mjs`, so a production build can't corrupt a running dev server

---

## Setup

### 1. Prerequisites

- Node.js 22+
- Python 3.10+ (for transcription)
- PostgreSQL (for learning tracker, optional)

### 2. Install dependencies

```bash
npm install
pip install yt-dlp faster-whisper groq
```

### 3. Configure `.env`

```env
# AI text — OpenRouter primary/fallback → NVIDIA NIM → Ollama (see ai-client.js)
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL_PRIMARY=meta-llama/llama-3.3-70b-instruct:free
OPENROUTER_MODEL_FALLBACK=qwen/qwen3-235b-a22b:free
NVIDIA_API_KEY=nvapi-...
NVIDIA_MODELS=mistralai/mistral-nemotron,meta/llama-3.1-8b-instruct
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma4:e2b

# Groq (fast transcription — free at console.groq.com)
GROQ_API_KEY=gsk_...

# Hero images — Replicate FLUX Schnell (paid, ~$0.003/image). Note the exact,
# unconventional casing — this is the literal env var name the code reads.
Replicate_API-Key=r8_...

# Podcast TTS — Kokoro 82M via OpenRouter (uses OPENROUTER_API_KEY above).
# Optional GPU upgrade path:
ORPHEUS_API_URL=

# X/Twitter — see docs/x-importer.md for the full renewal workflow.
# Automated headed login is blocked by X bot-detection for some accounts;
# the manual cookie-copy path (X_AUTH_TOKEN/X_CT0 → npm run import:x-cookies)
# is the primary, supported method.
X_AUTH_TOKEN=...
X_CT0=...
X_STORAGE_STATE_PATH=./data/private/x-storage-state.json
X_SESSION_TTL_DAYS=365
SCRAPE_TARGET_HANDLE=your_x_handle

# PostgreSQL (optional — learning tracker, run history, token usage.
# /runs and /tokens fall back to local JSON files if unset/unreachable.)
DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/knowledgebase

# Obsidian export
OBSIDIAN_VAULT_DIR=./data/obsidian-vault

# Required to protect admin mutation APIs — if unset, those routes are
# open to anyone who can reach the app. Always set this.
KB_ADMIN_TOKEN=
```

### 4. Create PostgreSQL database (optional)

```bash
psql -U postgres -c 'CREATE DATABASE "KnowledgeBase";'
npm run db:setup
```

### 5. Run the app

```bash
npm run dev
# → http://localhost:3005
```

---

## Pipeline

Run the full pipeline from the **Admin Console** at `/admin`, or via npm scripts:

```bash
npm run import:x-login          # Renew X session (headed browser — may be blocked by bot detection)
npm run import:x-cookies        # Renew X session from X_AUTH_TOKEN/X_CT0 in .env (primary method)
npm run import:x-likes          # Pull liked tweets
npm run extract:sources         # Scrape content from tweet URLs
npm run transcripts:extract     # Download/transcribe X/YouTube video sources
npm run classify:sources        # AI-classify each source into a topic
npm run compile:courses         # Generate courseware from classified sources
npm run summarize:topics        # Build wiki summary pages
npm run graph:build             # Regenerate knowledge graph JSON
npm run generate:assets         # Generate hero images (Replicate, paid per call)
npm run generate:podcasts       # Generate podcast scripts + audio (Kokoro/OpenRouter)
npm run export:obsidian         # Export Obsidian vault
```

Or run everything at once:

```bash
npm run pipeline:run
```

The full pipeline runs transcription before course generation. If a transcript
is added for a source that already has a course, the existing course file is
regenerated in place instead of creating a duplicate course.

### Pipeline Resilience

`scheduled-daily.js` and `run-pipeline.js` are **continue-on-error**: a failed
step is logged and the run continues with the remaining steps, so (for
example) an expired X session breaking the import step doesn't stop
transcript extraction, classification, course generation, or the graph
rebuild from processing whatever's already in the pipeline. Steps carry
`critical`/`retries` metadata in `scripts/pipeline-steps.js` — only a step
marked `critical: true` aborts the whole run. A run's final status is one of
`ok` / `completed_with_errors` / `aborted`, visible at `/runs`.

### Daily Automation (Windows Task Scheduler)

| Task | Schedule | State (as of 2026-07-2x) |
|---|---|---|
| `KnowledgeBase Daily Import` (`start-scheduled.bat` → `scheduled-daily.js`) | Daily at 12:00 PM IST | ✅ Enabled — now includes the R2 upload + git push steps, so the hosted site updates itself with no manual step |
| `KnowledgeBase Prod Deploy` (`start-prod.bat` → build + restart `:3006`) | Daily at 1:00 PM IST | ⚠️ Currently **disabled**. With Vercel live and auto-redeploying, this local prod server may not be needed anymore — worth deciding whether to re-enable (`register-prod-task.ps1`) or retire it. |

---

## App Pages

| Route | Description |
|---|---|
| `/` | Overview dashboard |
| `/sources` | Full source inbox |
| `/filtered` | Tweets excluded by the relevance filter; review and unfilter |
| `/courseware` | Topic cards — click to browse courses |
| `/courseware/[topic]` | Topic overview with course list + search |
| `/courseware/[topic]/[course]` | Individual course reader |
| `/wiki` | Wiki topic index |
| `/wiki/[topic]` | Wiki page for a topic |
| `/graph` | Interactive D3 knowledge graph |
| `/runs` | Pipeline run history with per-step detail |
| `/tokens` | AI token usage tracker |
| `/admin` | Admin console (pipeline, prompts, import) |

---

## AI Prompt Customization

Edit prompts at `/admin` → **AI Prompts** section, or directly in `data/prompts.json`. Changes take effect on the next pipeline run (no restart needed).

Three prompt sets:
- `compile_course_*` — controls courseware generation
- `summarize_topic_*` — controls wiki page generation
- `classify_source_*` — controls topic classification

---

## Generated Local Artifacts

Generated audio, hero images, token usage, exported Obsidian vault files, and
runtime logs are kept local and ignored by Git. The canonical knowledge content
is the source/course/wiki Markdown plus pipeline code; generated media can be
rebuilt from the course files when needed.

---

## Deployment

**Live at [kb.thinkbits.in](https://kb.thinkbits.in)**, mirroring this repo's
`main` branch via Vercel.

The pipeline (imports, AI generation, Playwright scraping) is **local-only** —
it needs a real Chromium browser, Python, `yt-dlp`, and a local Postgres, none
of which exist on a serverless host. `/admin` and every `/api/admin/*` route
are locked out on the hosted deployment (`middleware.ts` 404s them whenever
`process.env.VERCEL` is set) — that surface is for `localhost` only.

Everything else is live and current automatically: Neon Postgres is the
single database for both the local pipeline and Vercel (no stale snapshot),
podcasts/hero images are served from Cloudflare R2, and the daily pipeline's
last two steps (`upload-media-to-r2.js`, `git-publish.js`) push new content
and media straight to `main`, which triggers Vercel's auto-redeploy — no
manual step required after a scheduled run.

See `docs/deployment.md` for the full setup reference (repo size, what
runs where, Cloudflare/Neon/Hostinger configuration) and what to check if
something stops updating.

---

## Obsidian Integration

```bash
npm run export:obsidian
# → data/obsidian-vault/
```

Open `data/obsidian-vault/` as a vault in Obsidian. Includes:
- `Topics/` — wiki pages with [[wikilinks]]
- `Courses/[Topic]/` — course files with backlinks
- `Sources/` — raw source notes
- `Index.md` — master index
