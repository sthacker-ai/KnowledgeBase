# Deployment — Hosting KnowledgeBase on Vercel

**Status:** Evaluated 2026-07-06. R2 media pipeline + Neon migration script
built 2026-07-20 — code is ready, activation needs your Cloudflare/Neon
account creation (steps below). Not yet deployed to Vercel. This is a "go do
it" guide — the steps below are meant to be followed by hand in the Vercel,
Cloudflare, Neon, and Hostinger dashboards.

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

## Audio + hero images — via Cloudflare R2 (decided 2026-07-20)

`public/course-audio` (**~628 MB**, podcast MP3s) and `public/course-assets`
(**~53 MB**, hero images) are `.gitignore`d — never committed, by design
(binaries don't belong in git history). Total: **~681 MB and growing** —
roughly 130–140 MB every two weeks at the current pipeline pace.

Vercel Blob's free allowance (the account's real number, not the generic
docs figure) is around 1 GB — comfortable today but tight within weeks of
this growth rate. **Decision: use Cloudflare R2 instead** — 10 GB free, zero
egress fees ever (Blob-style services meter data transfer; R2 doesn't), and
it's the purpose-built tool for public media at this size. (Google Drive was
considered and ruled out: technically possible via a service account + a
proxy API route, but that adds real latency per request and more moving
parts for *less* free storage than R2 — not the right trade.)

### Implemented (2026-07-20) — needs your R2 account + bucket to activate

- `scripts/upload-media-to-r2.js` (`npm run upload:media`) — walks
  `public/course-audio/` and `public/course-assets/`, uploads anything not
  already recorded, and writes `data/media-manifest.json` (committed to git)
  listing which `topic/course` pairs have media in R2.
- `app/lib/media.ts` — course pages resolve hero image / podcast URLs from
  this manifest + `R2_PUBLIC_URL_BASE` when the local file isn't present
  (i.e. on the hosted deployment). Falls back to local `/public` files when
  they exist (dev machine), so nothing changes locally.
- Required env vars (`.env.example` has the full list): `R2_ACCOUNT_ID`,
  `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`,
  `R2_PUBLIC_URL_BASE`. Without them set, everything behaves exactly as
  before (local-only media, hosted deployment shows text/no media) — this
  is purely additive.

### To activate it
1. Cloudflare Dashboard (free account) → **R2 Object Storage** → **Create bucket**.
2. Bucket **Settings** → enable **Public Access** (via the R2.dev subdomain,
   or attach a custom domain) — this becomes `R2_PUBLIC_URL_BASE`.
3. **Manage API Tokens** → create a token scoped to that bucket (Object
   Read & Write) → gives you the Account ID, Access Key ID, and Secret
   Access Key.
4. Add all five vars to `.env` (local) and to Vercel's Environment Variables
   (so the hosted deployment can construct the same URLs — Vercel doesn't
   need write access, only `R2_PUBLIC_URL_BASE` is actually read by the app
   at request time; the other four are only used by the local upload script).
5. Run `npm run upload:media` — uploads everything new, commit + push the
   updated `data/media-manifest.json`.
6. Re-run `npm run upload:media` after future pipeline runs to pick up new
   courses' media (not yet wired into the daily automation — manual for now).

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
| `DATABASE_URL` | the Neon connection string (see below) | So `/runs`, `/tokens`, and the learning tracker show live data, not the last-committed JSON snapshot |
| `R2_PUBLIC_URL_BASE` | your R2 bucket's public URL | Only var the app needs at request time for hero images/podcasts — see the R2 section above |

Everything else — `OPENROUTER_API_KEY`, `NVIDIA_API_KEY`, `GROQ_API_KEY`,
`Replicate_API-Key`, `X_AUTH_TOKEN`/`X_CT0`, `R2_ACCESS_KEY_ID`/`R2_SECRET_ACCESS_KEY`/`R2_ACCOUNT_ID`/`R2_BUCKET_NAME` —
is **not needed on Vercel**. The AI keys aren't called by any hosted page;
the R2 write credentials are only used by the local upload script, never by
the deployed app (which only ever reads the public URL).

### Neon Postgres — one database for local + hosted (decided 2026-07-20)

Rather than Vercel showing a stale snapshot while local Postgres stays the
real source of truth, point **both** the local pipeline and the Vercel
deployment at the **same Neon instance** — no sync step, Vercel always
current.

1. [neon.tech](https://neon.tech) → free account → **New Project** → copy
   the connection string it gives you.
2. Add it to local `.env` as `NEON_DATABASE_URL` (temporarily, alongside the
   existing `DATABASE_URL`), then run:
   ```bash
   node scripts/migrate-to-neon.js
   ```
   This creates the schema on Neon (reuses `db-setup.js`) and copies every
   row from your local Postgres over — read-only against local, so nothing
   there is touched. Safe to re-run (`ON CONFLICT DO NOTHING`).
3. Once copied, update local `.env`'s `DATABASE_URL` to the Neon connection
   string (replacing the local one) — the daily pipeline now writes
   directly to Neon.
4. Set the same `DATABASE_URL` in Vercel's environment variables (step 3
   above) — both surfaces now read/write the identical database.

Your current local data (36 pipeline runs, ~1,900 token-usage rows) is
kilobyte-scale — nowhere near Neon's free-tier storage limit.

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
