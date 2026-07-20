import fs from "fs";
import path from "path";
import { tryQuery } from "./db";

const ROOT       = process.cwd();
const RUNS_DIR   = path.join(ROOT, "data", "runs");
const TASKS_DIR  = path.join(ROOT, "data", "tasks");
const TOKEN_FILE = path.join(ROOT, "data", "token-usage.json");
const FILTERED_INDEX_PATH = path.join(ROOT, "data", "indexes", "filtered-tweets.json");

/**
 * Shared read-models for /runs, /tokens, and /filtered.
 *
 * Called DIRECTLY by both the page (Server Component) and the API route —
 * never via a server-side self-fetch. A self-fetch needs to guess its own
 * origin (host + port), which breaks the moment the app runs somewhere other
 * than the assumed default (e.g. prod on :3006 instead of dev's :3005, or a
 * serverless host without NEXT_PUBLIC_BASE_URL set) — the fetch fails,
 * gets swallowed by a try/catch, and the page silently renders empty.
 */

// ---------------------------------------------------------------------------
// Runs
// ---------------------------------------------------------------------------

export interface RunStep {
  name:          string;
  status:        "ok" | "failed" | "aborted";
  duration_secs: number | null;
  error?:        string;
}

export interface RunEntry {
  id:           string;
  trigger:      "scheduled" | "admin-adhoc";
  date:         string;
  startedAt:    string;
  finishedAt:   string | null;
  durationSecs: number | null;
  status:       "ok" | "failed" | "aborted" | "running" | "completed_with_errors" | "unknown";
  steps:        RunStep[];
}

export async function getRunsData(): Promise<RunEntry[]> {
  const runs: RunEntry[] = [];

  // ── 1. Scheduled runs — try PostgreSQL first ──────────────────────────────
  const dbRuns = await tryQuery<{
    run_id: string; trigger: string; run_date: string;
    started_at: string | null; finished_at: string | null;
    duration_secs: string | null; status: string; steps: RunStep[];
  }>(
    `SELECT run_id, trigger, run_date::text, started_at::text, finished_at::text,
            duration_secs, status, steps
     FROM pipeline_runs
     ORDER BY run_date DESC, created_at DESC
     LIMIT 100`
  );

  if (dbRuns !== null) {
    for (const r of dbRuns) {
      runs.push({
        id:           r.run_id,
        trigger:      r.trigger as "scheduled" | "admin-adhoc",
        date:         r.run_date?.slice(0, 10) || "",
        startedAt:    r.started_at || r.run_date || "",
        finishedAt:   r.finished_at ?? null,
        durationSecs: r.duration_secs ? Number(r.duration_secs) : null,
        status:       r.status as RunEntry["status"],
        steps:        Array.isArray(r.steps) ? r.steps : [],
      });
    }
  } else {
    // ── Fall back: read manifest JSON files ────────────────────────────────
    if (fs.existsSync(RUNS_DIR)) {
      const manifests = fs.readdirSync(RUNS_DIR)
        .filter((f) => /^scheduled-\d{4}-\d{2}-\d{2}-manifest\.json$/.test(f))
        .sort().reverse().slice(0, 60);

      for (const file of manifests) {
        try {
          const m = JSON.parse(fs.readFileSync(path.join(RUNS_DIR, file), "utf8"));
          runs.push({
            id:           file.replace("-manifest.json", ""),
            trigger:      "scheduled",
            date:         m.date || "",
            startedAt:    m.started_at_ist || "",
            finishedAt:   m.finished_at_ist ?? null,
            durationSecs: m.duration_secs ?? null,
            status:       m.status || "unknown",
            steps:        m.steps || [],
          });
        } catch { /* skip malformed */ }
      }
    }
  }

  // ── 2. Admin adhoc runs — always read task log files ─────────────────────
  if (fs.existsSync(TASKS_DIR)) {
    const taskLogs = fs.readdirSync(TASKS_DIR)
      .filter((f) => f.endsWith(".log"))
      .sort().reverse().slice(0, 50);

    for (const file of taskLogs) {
      try {
        const content = fs.readFileSync(path.join(TASKS_DIR, file), "utf8");
        const stepMatch    = content.match(/step=(\S+)/);
        const startedMatch = content.match(/started=(\S+)/);
        const step      = stepMatch?.[1]    || "unknown";
        const startedAt = startedMatch?.[1] || "";
        const failed    = /exit code 1|ERROR:/.test(content);
        runs.push({
          id:           file.replace(".log", ""),
          trigger:      "admin-adhoc",
          date:         startedAt.slice(0, 10),
          startedAt,
          finishedAt:   null,
          durationSecs: null,
          status:       failed ? "failed" : "ok",
          steps:        [{ name: step, status: failed ? "failed" : "ok", duration_secs: null }],
        });
      } catch { /* skip */ }
    }
  }

  runs.sort((a, b) => (b.startedAt || b.date || "").localeCompare(a.startedAt || a.date || ""));
  return runs;
}

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------

interface TokenEntry {
  ts:                string;
  label:             string;
  model:             string;
  provider:          string;
  prompt_tokens:     number;
  completion_tokens: number;
  total_tokens:      number;
  audio_seconds?:    number;
  word_count?:       number;
}

export interface TokenData {
  byModel: {
    model: string; provider: string; calls: number;
    prompt_tokens: number; completion_tokens: number; total_tokens: number;
    audio_seconds: number;
  }[];
  totals: {
    calls: number; prompt_tokens: number; completion_tokens: number;
    total_tokens: number; audio_seconds: number;
  };
  recentEntries: TokenEntry[];
  source: "db" | "file";
}

function buildTokenResponse(entries: TokenEntry[], source: "db" | "file"): TokenData {
  const byModel: Record<string, TokenData["byModel"][number]> = {};

  for (const e of entries) {
    if (!byModel[e.model]) {
      byModel[e.model] = { model: e.model, provider: e.provider, calls: 0, prompt_tokens: 0, completion_tokens: 0, total_tokens: 0, audio_seconds: 0 };
    }
    byModel[e.model].calls++;
    byModel[e.model].prompt_tokens     += e.prompt_tokens     || 0;
    byModel[e.model].completion_tokens += e.completion_tokens || 0;
    byModel[e.model].total_tokens      += e.total_tokens      || 0;
    byModel[e.model].audio_seconds     += e.audio_seconds     || 0;
  }

  const totals = {
    calls:             entries.length,
    prompt_tokens:     entries.reduce((s, e) => s + (e.prompt_tokens || 0), 0),
    completion_tokens: entries.reduce((s, e) => s + (e.completion_tokens || 0), 0),
    total_tokens:      entries.reduce((s, e) => s + (e.total_tokens || 0), 0),
    audio_seconds:     entries.reduce((s, e) => s + (e.audio_seconds  || 0), 0),
  };

  return {
    byModel:       Object.values(byModel).sort((a, b) => (b.total_tokens + b.audio_seconds) - (a.total_tokens + a.audio_seconds)),
    totals,
    recentEntries: entries.slice(0, 30),
    source,
  };
}

export async function getTokensData(): Promise<TokenData> {
  // ts::text — node-pg returns a timestamp column as a JS Date object, not a
  // string. The file-based fallback below always has ts as an ISO string, so
  // without the cast the two sources return different shapes for the same
  // field, and client-side code that treats ts as a string (e.g. .localeCompare
  // for sorting) breaks specifically on the DB path.
  const rows = await tryQuery<TokenEntry>(
    `SELECT ts::text, label, model, provider, prompt_tokens, completion_tokens, total_tokens
     FROM token_usage
     ORDER BY ts DESC
     LIMIT 5000`
  );

  if (rows !== null) {
    return buildTokenResponse(rows, "db");
  }

  let entries: TokenEntry[] = [];
  try {
    entries = JSON.parse(fs.readFileSync(TOKEN_FILE, "utf8"));
    entries = entries.slice().reverse(); // newest first
  } catch { /* no data yet */ }

  return buildTokenResponse(entries, "file");
}

// ---------------------------------------------------------------------------
// Filtered tweets
// ---------------------------------------------------------------------------

interface FilteredEntry {
  filtered_at:    string;
  tweet_url:      string;
  author_handle:  string;
  tweet_text:     string;
  reason:         string;
}

interface FilteredIndex {
  schema_version: number;
  tweet_ids:      Record<string, FilteredEntry>;
}

export function getFilteredTweetsData(): { tweets: (FilteredEntry & { tweet_id: string })[]; total: number } {
  if (!fs.existsSync(FILTERED_INDEX_PATH)) {
    return { tweets: [], total: 0 };
  }
  try {
    const raw: FilteredIndex = JSON.parse(fs.readFileSync(FILTERED_INDEX_PATH, "utf8"));
    const tweets = Object.entries(raw.tweet_ids || {})
      .map(([tweet_id, entry]) => ({ tweet_id, ...entry }))
      .sort((a, b) => (b.filtered_at > a.filtered_at ? 1 : -1));
    return { tweets, total: tweets.length };
  } catch {
    return { tweets: [], total: 0 };
  }
}

// ---------------------------------------------------------------------------
// Daily run summary — the latest scheduled-pipeline manifest, distilled for
// the /summary digest page and the (future) daily email. Written by
// scheduled-daily.js to data/runs/scheduled-YYYY-MM-DD-manifest.json.
// ---------------------------------------------------------------------------

export interface DailySummaryStep {
  name:          string;
  status:        "ok" | "failed";
  duration_secs: number | null;
  detail?:       string | null;
  error?:        string;
}

export interface DailySummary {
  date:            string;
  startedAt:       string | null;
  finishedAt:      string | null;
  durationSecs:    number | null;
  status:          "ok" | "aborted" | "completed_with_errors" | "running" | "unknown";
  xSession:        { status: string; expiresAt: string | null; daysUntilExpiry: number | null } | null;
  steps:           DailySummaryStep[];
}

export function getLatestRunSummary(): DailySummary | null {
  if (!fs.existsSync(RUNS_DIR)) return null;

  // Dated manifests (scheduled-YYYY-MM-DD-manifest.json) are .gitignore'd —
  // they never reach a hosted deployment. git-publish.js additionally copies
  // the latest one to this fixed, committed filename every day, so the
  // hosted site always has *something* to show even though it can't keep
  // every historical file in git.
  const LATEST_FALLBACK = "latest-manifest.json";

  let manifests = fs.readdirSync(RUNS_DIR)
    .filter((f) => /^scheduled-\d{4}-\d{2}-\d{2}-manifest\.json$/.test(f))
    .sort()
    .reverse();

  if (manifests.length === 0 && fs.existsSync(path.join(RUNS_DIR, LATEST_FALLBACK))) {
    manifests = [LATEST_FALLBACK];
  }

  if (manifests.length === 0) return null;

  try {
    const m = JSON.parse(fs.readFileSync(path.join(RUNS_DIR, manifests[0]), "utf8"));
    return {
      date:         m.date || manifests[0].replace(/^scheduled-|-manifest\.json$/g, ""),
      startedAt:    m.started_at_ist ?? null,
      finishedAt:   m.finished_at_ist ?? null,
      durationSecs: m.duration_secs ?? null,
      status:       m.status || "unknown",
      xSession:     m.x_session ?? null,
      steps:        Array.isArray(m.steps) ? m.steps : [],
    };
  } catch {
    return null;
  }
}
