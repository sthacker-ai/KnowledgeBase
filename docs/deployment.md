# Deployment — Hosting KnowledgeBase on Vercel

**Status:** Evaluated 2026-07-06, Blob storage numbers + self-fetch bug fix
added 2026-07-17. Not yet deployed. This is a "go do it" guide — the steps
below are meant to be followed by hand in the Vercel and Hostinger
dashboards.

## What actually gets hosted

KnowledgeBase has two planes:

- **Write plane** (import, scraping, AI generation, transcription) — runs
  `child_process.spawn()` on Node scripts that need Playwright/Chromium,
  Python, `yt-dlp`, ffmpeg, and a local Postgres. None of that exists on a
  serverless host. This plane **stays local**, triggered by Windows Task
  Scheduler exactly as it is today.
- **Read plane** (every public page except `/admin`) — reads Markdown/JSON
  files via `fs.readFileSync`/`readdirSync`, with the DB-backed routes
  (`/runs`, `/tokens`) falling back to committed JSON if Postgres isn't
  reachable. Because the content is committed to git, a serverless
  deployment's working directory contains it automatically — **no CMS, no
  database migration, no separate content sync step needed.**

So the hosting model is: **run the pipeline locally → `git push` → Vercel
redeploys and serves the new content.** This is the same shape as a static
blog, just with a heavier local build step.

## Repo size — is Vercel's free tier enough?

Measured directly (2026-07-06):

| What | Size | Notes |
|---|---|---|
| **Total git-tracked repo** | **8.08 MB** | This is what Vercel actually clones and deploys |
| — `content/` (courses, sources, wiki) | 5.69 MB | |
| — `data/` (indexes, run manifests, transcripts, token usage) | 1.82 MB | |
| — `app/` + `scripts/` + `docs/` (code) | ~0.47 MB | |
| — `public/` | ~0 MB | See below — this is the catch |
| `node_modules` (local only, not deployed as-is) | 378 MB | Vercel does its own `npm install` from `package.json` at build time |
| `.git` history | 8.7 MB | |

**8 MB is nothing.** Vercel's free (Hobby) tier is built for sites far
bigger than this. I still can't see your account's actual current usage —
that needs the Vercel connector authorized (see below) — but check
**Vercel Dashboard → your account/team → Usage** in the meantime, since
Hobby limits are account-wide and shared with your existing `nexuslog`
project.

## Audio + hero images — yes, there's room (via Vercel Blob)

`public/course-audio` (**~495 MB**, podcast MP3s) and `public/course-assets`
(**~44 MB**, hero images) are `.gitignore`d — never committed, by design
(binaries don't belong in git history). Total: **~539 MB.**

Confirmed against Vercel's current Blob pricing docs (fetched 2026-07-17):

| Vercel Blob — Hobby free allowance | Included | Your usage |
|---|---|---|
| Storage | **5 GB** (monthly average) | ~539 MB (~10.5% of the free tier) |
| Data Transfer | **100 GB/month** | Trivial for a personal-scale site |
| Simple Operations (reads) | 100,000/month | Trivial |
| Advanced Operations (`put`/`copy`/`list`) | 10,000/month | One-time upload of ~500-1000 files, well under |

**Yes — 539 MB fits comfortably, with roughly 9x headroom to grow before
hitting the free ceiling.** One thing to know: Hobby's Blob limits are a
hard wall, not pay-as-you-go — if you ever did exceed them, Vercel blocks
further Blob access (no surprise bill) until the next 30-day window. At
your current size that's not a realistic risk.

### How this would work
1. Create a Blob store in the Vercel dashboard (Storage tab) — this gives
   you a `BLOB_READ_WRITE_TOKEN`.
2. A local one-time (then incremental) upload script pushes
   `public/course-audio/**` and `public/course-assets/**` to the store using
   `put(pathname, file, { access: "public", addRandomSuffix: false })` —
   `addRandomSuffix: false` keeps the URL deterministic from the file path,
   so the app can construct Blob URLs without a separate mapping file.
3. Course pages read the hero image / podcast `src` from the Blob base URL
   instead of `/course-assets/...` / `/course-audio/...`.

This is real code work (a new upload script + a small change to how course
pages resolve media URLs) — not done yet. **Blocked on:** either authorizing
the Vercel connector so I can create/inspect the Blob store directly, or you
creating it by hand in the dashboard and pasting `BLOB_READ_WRITE_TOKEN`
into `.env`. Say the word once you've done either and I'll build the upload
script + wire the app to it.

## What won't work on the hosted deployment (by design, not a bug)

- **`/admin`** and every `/api/admin/*` route — these spawn local pipeline
  scripts. On Vercel they'll either fail immediately (script/dependency not
  found) or hang until the function timeout. Not dangerous, just useless
  there. Treat `/admin` as localhost-only.
- **Marking a course "completed" / learning streaks** — these write to
  Postgres via `/api/learn/*`. Without a reachable database, `POST`s will
  fail gracefully (caught, returns an error toast) but won't persist. Fine
  for a read-only mirror; not fine if you want the hosted site to track
  your own reading progress separately.
- **Unfiltering a tweet** (`/filtered` → Unfilter button) — writes to a
  local JSON index file. On Vercel, the filesystem is read-only outside
  `/tmp`, so this edit is silently lost on the next deploy (or may error).

None of this breaks page rendering — it just means the hosted site is a
**mirror for reading**, not a second place to run the pipeline from.

## `NEXT_PUBLIC_BASE_URL` — no longer needed (fixed 2026-07-17)

Earlier versions of `/filtered`, `/runs`, and `/tokens` did a server-side
self-fetch to their own API route with a hardcoded `http://localhost:3005`
fallback. This was buggy **even locally** — it's exactly why Run History and
Token Usage showed empty on the local prod server (port 3006 ≠ the
hardcoded 3005 fallback), independent of any hosting question. Fixed by
removing the self-fetch entirely: the pages now call the shared data
functions in `app/lib/runs-tokens-data.ts` directly, the same way every
other page reads its data. No env var, no origin-guessing, works identically
in dev, local prod, and on Vercel. **You do not need to set
`NEXT_PUBLIC_BASE_URL` at all** — ignore any earlier version of this doc
that said otherwise.

## Step-by-step

### 1. Confirm the code is pushed
`main` is pushed to `github.com/sthacker-ai/KnowledgeBase` as of this
session. Vercel deploys from GitHub, so nothing else is needed here; just
keep pushing after future pipeline runs (and after committing the fix
above).

### 2. Create the Vercel project
1. Vercel Dashboard → **Add New… → Project**.
2. **Import** the `sthacker-ai/KnowledgeBase` GitHub repo (same flow you
   used for `nexuslog`).
3. Framework Preset: Vercel auto-detects **Next.js** — leave defaults
   (Build Command `next build`, Output auto-detected, Root Directory `.`).

### 3. Set environment variables
Project → **Settings → Environment Variables**:

| Variable | Value | Why |
|---|---|---|
| `KB_ADMIN_TOKEN` | a long random string | Gates `/api/admin/*` — set it even though those routes won't functionally work here; `requireAdmin()` allows everything through if this is empty |

That's it — **one variable.** Everything else — `OPENROUTER_API_KEY`,
`NVIDIA_API_KEY`, `GROQ_API_KEY`, `Replicate_API-Key`, `X_AUTH_TOKEN`/`X_CT0`,
`DATABASE_URL` — is **not needed** for the read-only mirror, since none of
the hosted pages call an AI provider or the scraper, and the DB-backed
routes fall back to committed JSON automatically.

*(Optional, later: if you want `/runs`/`/tokens`/learning-progress to show
live data instead of the last-committed snapshot, point `DATABASE_URL` at a
cloud Postgres reachable from the internet — e.g. Neon or Supabase's free
tier, not your local Postgres. This is a "Phase 2" item, not required for
launch. If you add Vercel Blob for media per the section above, that adds
`BLOB_READ_WRITE_TOKEN`, auto-injected if provisioned through the dashboard.)*

### 4. Deploy
Click **Deploy**. First build takes a few minutes (fetches the self-hosted
fonts, runs `next build`). You'll get a working `https://<project>.vercel.app`
URL immediately — check it loads before touching DNS.

### 5. Point `project.thinkbits.in` at it (same pattern as `nexuslog`)
1. Vercel project → **Settings → Domains** → add `project.thinkbits.in`
   (swap in whatever subdomain you want, e.g. `kb.thinkbits.in`).
2. Vercel shows you a CNAME target (typically `cname.vercel-dns.com`, but
   use exactly what Vercel displays for your project).
3. Hostinger → `thinkbits.in` → **DNS / Nameservers** → add a **CNAME**
   record:
   - **Host/Name:** the subdomain part only (e.g. `kb`)
   - **Points to:** the value Vercel gave you
   - **TTL:** default is fine
4. Wait for DNS propagation (usually minutes, occasionally up to an hour)
   and Vercel's automatic TLS certificate issuance. Vercel's Domains tab
   shows a ✅ once it's verified.

### 6. Ongoing workflow
Every time you want the hosted site to reflect new pipeline output:
```bash
git add content data
git commit -m "content: refresh ..."
git push
```
Vercel's GitHub integration auto-deploys on push to `main` — no manual
redeploy step needed after the first time.

## Optional hardening (not required to launch, worth doing eventually)

- Hide the "Admin" nav link and short-circuit `/admin` + `/api/admin/*` on
  the hosted deployment (e.g. gate on a `VERCEL` env var Vercel sets
  automatically) so a visitor can't see a console full of buttons that
  don't do anything there.
- If you don't want `/admin` reachable at all publicly, add it to
  `middleware.ts` with a redirect/404 when `process.env.VERCEL` is set.

Neither is implemented yet — flagging as a follow-up, not a blocker.
