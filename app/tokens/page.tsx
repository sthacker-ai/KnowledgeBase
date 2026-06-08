import Link from "next/link";
import TokensClient from "./TokensClient";

export const dynamic = "force-dynamic";

interface TokenRow {
  model:             string;
  provider:          string;
  calls:             number;
  prompt_tokens:     number;
  completion_tokens: number;
  total_tokens:      number;
}

interface RecentEntry {
  ts:                string;
  label:             string;
  model:             string;
  provider:          string;
  prompt_tokens:     number;
  completion_tokens: number;
  total_tokens:      number;
}

interface TokenData {
  byModel:       TokenRow[];
  totals:        { calls: number; prompt_tokens: number; completion_tokens: number; total_tokens: number };
  recentEntries: RecentEntry[];
}

async function getTokenData(): Promise<TokenData> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3005";
    const res = await fetch(`${baseUrl}/api/tokens`, { cache: "no-store" });
    if (!res.ok) return { byModel: [], totals: { calls: 0, prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }, recentEntries: [] };
    return res.json();
  } catch {
    return { byModel: [], totals: { calls: 0, prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }, recentEntries: [] };
  }
}

function fmtNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export default async function TokensPage() {
  const { byModel, totals, recentEntries } = await getTokenData();

  return (
    <main className="kb-shell">
      {/* ── Left Nav ──────────────────────────────────────────────────────── */}
      <aside className="kb-sidebar" aria-label="KnowledgeBase navigation">
        <div className="kb-brand">
          <div className="kb-brand-mark" aria-hidden="true" />
          <div>
            <p className="kb-brand-name">KnowledgeBase</p>
            <p className="kb-brand-sub">Token Usage</p>
          </div>
        </div>
        <p className="nav-section-label">Menu</p>
        <Link href="/"           className="kb-nav-link"><span className="kb-nav-icon" />Overview</Link>
        <Link href="/sources"    className="kb-nav-link"><span className="kb-nav-icon" />Source Inbox</Link>
        <Link href="/courseware" className="kb-nav-link"><span className="kb-nav-icon" />Courseware</Link>
        <Link href="/wiki"       className="kb-nav-link"><span className="kb-nav-icon" />Wiki Notes</Link>
        <Link href="/graph"      className="kb-nav-link"><span className="kb-nav-icon" />Knowledge Graph</Link>
        <Link href="/runs"       className="kb-nav-link"><span className="kb-nav-icon" />Run History</Link>
        <Link href="/tokens"     className="kb-nav-link active" aria-current="page"><span className="kb-nav-icon" />Token Usage</Link>
        <div className="sidebar-bottom">
          <Link href="/admin" className="kb-nav-link"><span className="kb-nav-icon" />Admin</Link>
        </div>
      </aside>

      {/* ── Main Workspace ────────────────────────────────────────────────── */}
      <section className="kb-workspace" style={{ gap: "16px" }}>
        <div style={{ padding: "16px 0 4px" }}>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>Token Usage</h1>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: "2px" }}>
            All OpenRouter API calls tracked since token logging was enabled.
          </p>
        </div>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px" }}>
          {[
            { label: "Total Calls",   value: String(totals.calls) },
            { label: "Input Tokens",  value: fmtNum(totals.prompt_tokens) },
            { label: "Output Tokens", value: fmtNum(totals.completion_tokens) },
            { label: "Total Tokens",  value: fmtNum(totals.total_tokens) },
          ].map((s) => (
            <div key={s.label} className="kb-stat-card blue" style={{ padding: "14px 16px" }}>
              <div className="kb-stat-value" style={{ fontSize: "1.4rem" }}>{s.value}</div>
              <div className="kb-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <TokensClient byModel={byModel} recentEntries={recentEntries} />
      </section>

      {/* ── Right Sidebar ─────────────────────────────────────────────────── */}
      <aside className="kb-right" aria-label="Token info">
        <div>
          <h2 className="kb-right-title">About Token Tracking</h2>
          <p className="kb-right-sub" style={{ lineHeight: 1.5 }}>
            Token counts are captured from OpenRouter API responses. Ollama (local) usage shows 0 tokens — Ollama does not report token counts.
          </p>
        </div>
        <div style={{ marginTop: "20px" }}>
          <h2 className="kb-right-title">Free Tier Note</h2>
          <p className="kb-right-sub" style={{ lineHeight: 1.5 }}>
            All models used are on the OpenRouter free tier ($0 cost). Token counts are tracked for rate limit awareness and future planning.
          </p>
        </div>
      </aside>
    </main>
  );
}
