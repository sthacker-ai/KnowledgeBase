# KnowledgeBase — Handover: 6 July 2026

> Picking back up after the 26 May 2026 handover. That document is now stale
> in several places (provider names, schedule times, session workflow) —
> this one supersedes it. Everything below reflects the exact state of the
> project as of this commit.

---

## ✅ What Changed Since 26 May

### 1. X session bug — root cause found and fixed
The daily pipeline had been failing on import with "X session is not logged
in" for days. The saved cookies (`auth_token`/`ct0`) hadn't actually changed
at X's end — `saveCookieSession` in `scripts/import-x-likes.js` was
hard-expiring them after 30 days regardless of real validity, so Playwright
silently dropped a still-good cookie. Fixed: TTL is now `X_SESSION_TTL_DAYS`
(default 365). Re-stamped the live session (now valid until 2027-07-06) and
confirmed with a real import (`imported=3`, exit 0).

Also confirmed: automated headed login (`npm run import:x-login`) is blocked
by X's bot detection for this account. The manual cookie-copy path
(`npm run import:x-cookies`) is the supported method — see
`docs/x-importer.md`.

### 2. Pipeline resilience
`scheduled-daily.js` / `run-pipeline.js` are now continue-on-error. A failed
step (like the import above) no longer aborts the whole run — the rest of
the pipeline still processes whatever's available. Steps carry
`critical`/`retries` metadata in `pipeline-steps.js`. New run status:
`completed_with_errors`. A pre-flight check logs an X-session health warning
at the top of every run. Session health is also surfaced on `/admin`
(banner when expiring/dead, "days left" always visible) via
`scripts/lib/x-session.js` / `app/api/admin/session`.

### 3. Dev/prod build corruption — found and fixed
Running `npm run build` (prod) while `npm run dev` was live corrupted the
shared `.next` webpack cache, producing `Cannot find module './331.js'`
runtime errors in dev. Fixed at the root: `next.config.mjs` now routes
`next dev` → `.next-dev` and `next build`/`next start` → `.next` via
`distDir`, keyed off `NODE_ENV`. This was a latent landmine given the 1 PM
daily prod-deploy task could hit it any time dev was open — now defused.

### 4. Full UI redesign — "Nocturne"
Replaced the light indigo/amber theme entirely. Dark-first (default),
gold+rose accent, glass surfaces, Space Grotesk + JetBrains Mono
(self-hosted via `next/font/google`), gradient hero/numerals, app-wide page
transitions, staggered entrance animation, animated count-up stats, a
theme-aware D3 knowledge graph, and a light-mode toggle (persisted,
no-flash). Full token reference: `docs/brandguide.md`. A cohesion pass
covered every page (`/`, `/courseware`, `/wiki`, `/graph`, `/runs`,
`/tokens`, `/filtered`, `/admin`) to remove leftover light-theme hex colors
and gold-on-white contrast issues.

### 5. Committed and pushed
Two commits landed on `main` and pushed to
`github.com/sthacker-ai/KnowledgeBase`:
- `ea72e47` — code: Nocturne, pipeline resilience, X-session fix, dev/prod split
- `e7e7e6c` — content: regenerated courses/sources/transcripts/run data

Also fixed the global git credential helper (`credential.helper` was set to
the deprecated `manager-core`; corrected to `manager`) — this was silently
blocking **every** git push/pull needing auth, not just this one.

### 6. Provider drift discovered while writing docs
Docs (including the 26 May handover) claimed Pollinations.AI for images and
Magpie TTS for podcasts. Actual code as of today:
- **Images:** Replicate `black-forest-labs/flux-schnell` (paid, ~$0.003/image)
  — env var `Replicate_API-Key` (unusual casing, that's the literal name).
- **Podcast TTS:** Kokoro 82M via OpenRouter's `/audio/speech` endpoint, with
  an optional Orpheus-FastAPI GPU upgrade path.

Both PRD.md and README.md are now corrected and explicitly note that these
providers have already changed more than once — treat the source files
(`generate-course-assets.js`, `scripts/transcribe/generate_audio.py`) as
ground truth if this drifts again.

### 7. Documentation pass
`PRD.md`, `README.md`, `docs/architecture.md`, `docs/x-importer.md`,
`docs/brandguide.md`, and `docs/implementation-plan.md` were all brought up
to date in this session — see each file's own changes. Notably:
`docs/implementation-plan.md`'s original 8-phase checklist is now fully
checked off (it was still showing unchecked boxes for things shipped months
ago).

---

## 🔍 Findings From This Session's Audit (not yet acted on)

- **`KnowledgeBase Prod Deploy` scheduled task is disabled** (confirmed via
  `Get-ScheduledTask`). The 1 PM daily prod rebuild/restart is not running.
  `KnowledgeBase Daily Import` (noon) is active. Decide whether to
  re-enable it (`register-prod-task.ps1`) or deploy to Vercel instead and
  retire the local prod server.
- **`data/transcripts/tmp/`** has ~175 MB of leftover downloaded video files
  from transcription runs. Correctly `.gitignore`d, never committed, but
  never cleaned up either — safe to delete by hand.
- **`public/course-audio` (~495 MB) and `public/course-assets` (~44 MB) are
  git-ignored** — no podcast audio or hero images exist in the git history.
  A Vercel deployment of this repo will not have audio players or hero
  images unless that media is pushed to separate object storage.
- **Admin API routes have no auth gate if `KB_ADMIN_TOKEN` is unset** —
  `requireAdmin()` returns "allowed" when the env var is empty. Not an issue
  on localhost; must be set before the app is reachable from the internet.

---

## 🔜 What Comes Next

### 1. Vercel hosting
Evaluated in this same session — see `docs/deployment.md` for the full
write-up: what works (all read-only content pages, using the ~8 MB of
git-tracked content/data), what doesn't (admin/pipeline write routes — local
only), and the step-by-step Vercel + `project.thinkbits.in` DNS setup. This
is a "go do it" guide for the user, not yet executed.

### 2. Decide on the disabled prod-deploy task
Either re-enable `register-prod-task.ps1`, or treat the Vercel deployment as
the "production" surface going forward and stop maintaining a local prod
server on port 3006.

### 3. Optional next-phase items (not started, not urgent)
- Pipeline failure notifications (email/push on `completed_with_errors`)
- A cloud-reachable Postgres if the hosted deployment should show live
  Runs/Tokens/Learning-tracker data instead of the last-committed snapshot
- Clean up `data/transcripts/tmp/`

---

## ⚙️ Environment Checklist (as of this commit)

| Var | Status | Used for |
|---|---|---|
| `OPENROUTER_API_KEY` | Set | LLM primary/fallback + Kokoro TTS |
| `NVIDIA_API_KEY` | Set | LLM fallback 2 |
| `GROQ_API_KEY` | Set | Video transcription (STT) |
| `Replicate_API-Key` | Set | Hero images (FLUX Schnell, paid) |
| `DATABASE_URL` | Set (local Postgres) | Learning tracker, run history, token usage |
| `X_AUTH_TOKEN` / `X_CT0` | Set, renewed 2026-07-06 | X/Twitter scraping — valid until 2027-07-06 |
| `X_SESSION_TTL_DAYS` | New, defaults to 365 | X session cookie stamped expiry |
| `KB_ADMIN_TOKEN` | **Verify this is set** before any public hosting | Gates `/api/admin/*` |

---

## Addendum — 17 July 2026

Resumed the hosting conversation. Two concrete findings:

### 1. Found and fixed a real bug (not just a hosting gap)
`/runs`, `/tokens`, and `/filtered` were showing **empty even on the local
prod server** (port 3006). Root cause: their `page.tsx` did a server-side
self-fetch to their own API route with a hardcoded
`http://localhost:3005` fallback (the **dev** port) — on prod (3006) that
fetch fails, gets swallowed by a `try/catch`, and the page silently renders
empty. Verified via direct API calls (`/api/runs` and `/api/tokens` return
real, rich data — 41 runs, 860+ calls on the top model) and via the raw
page HTML (`"byModel":[],"recentEntries":[]"`).

**Fix:** extracted the shared logic into `app/lib/runs-tokens-data.ts` and
made the three pages call it directly instead of self-fetching over HTTP.
No more hardcoded port, no more `NEXT_PUBLIC_BASE_URL` dependency — verified
locally on rebuilt prod (3006): all three pages now render real data. Also
fixed stale UI copy on `/runs` that still described the old stop-on-failure
behavior. This also simplifies the Vercel deployment (`docs/deployment.md`)
— one less env var to get right.

### 2. Vercel Blob evaluated for hosting audio/hero images
Fetched Vercel's current Blob pricing docs live: Hobby free tier includes
**5 GB storage, 100 GB/month transfer, 100K simple + 10K advanced
operations**. The local media (`public/course-audio` ~495 MB +
`public/course-assets` ~44 MB ≈ 539 MB) fits comfortably — about 10% of the
free storage allowance, ~9x headroom to grow. Recommended approach: upload
via `put(pathname, file, { access: "public", addRandomSuffix: false })` so
Blob URLs are deterministic from the file path (no separate mapping file
needed). **Not implemented yet** — needs either the Vercel MCP connector
authorized or a manually-created Blob store + `BLOB_READ_WRITE_TOKEN`
before the upload script + course-page wiring can be built.

### 3. Vercel connector not yet authorized
The user added the Vercel connector to this session but hasn't completed
OAuth. Every "check my Vercel usage / connect and show me options" request
is blocked until they authorize it via claude.ai connector settings (can't
be done from within a non-interactive session). Vercel CLI (`npm i -g
vercel` + `vercel login`) is a parallel, connector-independent path if
preferred.

---

## Addendum — 20 July 2026

User reported the actual daily-run error output. Found and fixed several
real issues while explaining the pipeline behavior:

- **`/tokens` crash (dev + prod)**: Postgres returns `timestamp` columns as
  JS `Date` objects; the default sort key called `.localeCompare()` on one.
  Fixed the query (`ts::text`) + added a defensive guard.
- **"Steps ran despite import failing"** — confirmed via the actual log this
  is resilience working as intended: transcription/course/assets/podcasts
  all process a backlog of previously-imported content, independent of
  today's import result.
- **24/25 "ffprobe" transcription failures** — not a broken environment.
  Verified via direct ffprobe that those liked videos have no audio stream
  at all (silent clips/memes). Added detection + permanent `has_audio: false`
  marking so these are never retried. Also hardened `download_video.py` with
  an explicit `--ffmpeg-location`, upgraded yt-dlp 2026.03.17 → 2026.07.04,
  and gave the import step 1 retry (a connection reset is transient, unlike
  an expired session).
- **Built `/summary`** — a plain-language daily digest, added to every
  page's nav, backed by a new step-output parser
  (`scripts/lib/run-summary.js`) that turns each step's existing "Done."
  line into a real sentence.
- **Added a generated favicon** matching the brand mark.
- Committed all of the above in two commits (code, then content/data churn)
  and pushed to `main`.

### Storage architecture decided
- **Cloudflare R2**, not Vercel Blob, for hosted podcast audio/hero images —
  the account's real free tier (~1GB) was already 68% full and growing
  ~130MB/2 weeks; R2 gives 10GB free with zero egress fees. Google Drive was
  evaluated and ruled out (would need a proxying API route + service
  account, more complexity for less free space than R2). Built:
  `scripts/upload-media-to-r2.js` + `app/lib/media.ts` (falls back to local
  `/public` files when R2 env vars are unset — purely additive, nothing
  breaks locally). **Needs the user to create the R2 bucket + token** before
  this activates — see `docs/deployment.md`.
- **Neon Postgres** as a single source of truth for local pipeline + Vercel
  (rather than Vercel showing a stale snapshot). Built
  `scripts/migrate-to-neon.js` — creates the schema on Neon and copies every
  local row over (read-only against local, safe to re-run). **Needs the
  user to create the Neon project** and give the connection string before
  running — not yet executed.
- Email daily-digest delivery explicitly deferred by the user; `/summary`
  covers the "what did it do" need for now.

---

*Last updated: 20 July 2026*
