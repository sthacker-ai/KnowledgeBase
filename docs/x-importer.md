# X Likes Importer

This importer brings liked X/Twitter posts into the local KnowledgeBase vault.
It does not use Google Sheets and does not require the X API.

## Session Setup — Manual Cookie Copy (primary method)

Automated headed login (`npm run import:x-login`) is **blocked by X's bot
detection** for this account — X catches the automation and won't let the
login complete. The supported, working method is copying the session cookies
directly from a real logged-in Chrome tab:

1. Open `x.com` in Chrome, logged in normally.
2. Open DevTools (F12) → **Application** tab → **Cookies** → `https://x.com`.
3. Copy the **Value** of the `auth_token` cookie → paste into `.env` as `X_AUTH_TOKEN`.
4. Copy the **Value** of the `ct0` cookie → paste into `.env` as `X_CT0`.
5. Run:
   ```bash
   npm run import:x-cookies
   ```
   This writes `data/private/x-storage-state.json` (git-ignored) with those
   two cookies, stamped with an expiry of `X_SESSION_TTL_DAYS` (default
   **365** days) from now.

If headed login ever starts working for your account, `npm run import:x-login`
is still available as an alternative — it opens a real Chromium window, you
log in, return to the terminal and press Enter, and it captures the full
session state (not just two cookies).

### Why the TTL matters (fixed 2026-07-06)

Earlier, `saveCookieSession` hard-expired the saved cookies after 30 days
**regardless of whether the actual `auth_token`/`ct0` values were still
valid at X's end**. Once the 30 days passed, Playwright silently dropped the
still-good cookie before making the request, so the importer failed with
`X session is not logged in` — even though the cookie values themselves
hadn't changed and would have worked fine if resubmitted. This looked like
"X logged me out" but was actually the importer expiring a good session on
its own schedule. The fix: TTL is now `X_SESSION_TTL_DAYS` (default 365),
overridable in `.env`.

### Checking session health

```bash
node -e "require('dotenv').config(); console.log(require('./scripts/lib/x-session').getXSessionStatus())"
```

Or just look at the **admin dashboard** (`/admin`) — it shows a red banner
if the session is expired/dead, an amber banner if it's expiring within 5
days, and a "days left" readout in the right sidebar at all times. The daily
pipeline also logs a pre-flight warning at the top of the run log if the
session needs attention (see `scripts/lib/x-session.js`).

## Import Latest Likes

```bash
npm run import:x-likes
```

Default behavior:

- imports up to 10 new liked tweets (the daily scheduled run uses `--limit 25`
  via `SCHEDULE_LIKES_LIMIT`)
- skips tweet IDs already seen
- writes raw JSON to `data/raw/tweets/`
- writes Markdown source notes to `content/sources/x/`
- writes run logs to `data/runs/`
- maintains dedupe state in `data/indexes/seen-tweets.json`
- checks each tweet against the relevance filter patterns (`data/filters.json`,
  editable at `/admin`); tweets that don't match any pattern are still saved
  but marked filtered, and reviewable/unfilterable at `/filtered`

If the saved session has expired, this step fails but — since the pipeline is
continue-on-error (see `docs/architecture.md`) — the rest of the daily
pipeline still runs on whatever content was already imported.

## Backfill

```bash
npm run import:x-likes:backfill
```

Backfill currently uses the same scrolling/dedupe strategy with a different
mode label in the run log. Later we can make it maintain a separate historical
cursor if needed.

## Important Notes

- If X changes its UI, the Playwright selectors may need adjustment.
- If the importer reports "not logged in," check session health first (see
  above) before assuming X changed something — a self-expired-but-still-valid
  cookie is the most common cause.
- Topic classification, X-hosted video, and long-form article extraction —
  originally called out here as "Phase 2/3, not built yet" — are all
  implemented (`classify-source.js`, `import-x-source.js`,
  `extract-transcripts.js`). This doc predates them; see `PRD.md` §4 for the
  current pipeline step list.
