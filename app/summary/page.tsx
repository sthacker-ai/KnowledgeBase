import Link from "next/link";
import { getLatestRunSummary } from "../lib/runs-tokens-data";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  ok:                     "All steps completed",
  completed_with_errors:  "Completed with some errors",
  aborted:                "Aborted",
  running:                "Running",
  unknown:                "Unknown",
};

function statusColor(status: string) {
  if (status === "ok") return "var(--green)";
  if (status === "completed_with_errors") return "var(--amber)";
  if (status === "aborted") return "var(--red)";
  return "var(--muted)";
}

function fmtDuration(secs: number | null) {
  if (secs == null) return "—";
  const m = Math.floor(secs / 60);
  const s = Math.round(secs % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function fmtTime(s: string | null) {
  if (!s) return "—";
  // started_at_ist / finished_at_ist are already formatted like "17/07/2026, 12:00:02 IST"
  return s;
}

export default function SummaryPage() {
  const summary = getLatestRunSummary();

  return (
    <main className="kb-shell">
      {/* ── Left Nav ──────────────────────────────────────────────────────── */}
      <aside className="kb-sidebar" aria-label="KnowledgeBase navigation">
        <div className="kb-brand">
          <div className="kb-brand-mark" aria-hidden="true" />
          <div>
            <p className="kb-brand-name">KnowledgeBase</p>
            <p className="kb-brand-sub">Daily Summary</p>
          </div>
        </div>
        <p className="nav-section-label">Menu</p>
        <Link href="/"           className="kb-nav-link"><span className="kb-nav-icon" />Overview</Link>
        <Link href="/summary"    className="kb-nav-link active" aria-current="page"><span className="kb-nav-icon" />Daily Summary</Link>
        <Link href="/sources"    className="kb-nav-link"><span className="kb-nav-icon" />Source Inbox</Link>
        <Link href="/filtered"   className="kb-nav-link"><span className="kb-nav-icon" />Filtered Tweets</Link>
        <Link href="/courseware" className="kb-nav-link"><span className="kb-nav-icon" />Courseware</Link>
        <Link href="/wiki"       className="kb-nav-link"><span className="kb-nav-icon" />Wiki Notes</Link>
        <Link href="/graph"      className="kb-nav-link"><span className="kb-nav-icon" />Knowledge Graph</Link>
        <Link href="/runs"       className="kb-nav-link"><span className="kb-nav-icon" />Run History</Link>
        <Link href="/tokens"     className="kb-nav-link"><span className="kb-nav-icon" />Token Usage</Link>
        <div className="sidebar-bottom">
          <Link href="/admin" className="kb-nav-link"><span className="kb-nav-icon" />Admin</Link>
        </div>
      </aside>

      {/* ── Main Workspace ────────────────────────────────────────────────── */}
      <section className="kb-workspace" style={{ gap: "16px" }}>
        <div style={{ padding: "16px 0 4px" }}>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>Daily Summary</h1>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: "2px" }}>
            What today&apos;s scheduled pipeline run actually did, in plain language.
          </p>
        </div>

        {!summary ? (
          <div className="kb-source-panel">
            <p style={{ color: "var(--muted)", fontSize: "0.88rem" }}>
              No scheduled run recorded yet. This fills in after the daily pipeline runs.
            </p>
          </div>
        ) : (
          <>
            {/* Overview card */}
            <div className="kb-hero" style={{ padding: "22px 26px" }}>
              <p className="kb-hero-label">{summary.date}</p>
              <h2 style={{ fontSize: "1.4rem" }}>
                <span style={{ color: statusColor(summary.status) }}>●</span>{" "}
                {STATUS_LABEL[summary.status] ?? summary.status}
              </h2>
              <p className="kb-hero-sub">
                Started {fmtTime(summary.startedAt)} &middot; finished {fmtTime(summary.finishedAt)} &middot; took {fmtDuration(summary.durationSecs)}
              </p>
            </div>

            {/* X session health, if known */}
            {summary.xSession && (
              <div
                className="kb-source-panel"
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  borderLeft: `3px solid ${summary.xSession.status === "ok" ? "var(--green)" : summary.xSession.status === "warning" ? "var(--amber)" : "var(--red)"}`,
                }}
              >
                <span style={{
                  width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
                  background: summary.xSession.status === "ok" ? "var(--green)" : summary.xSession.status === "warning" ? "var(--amber)" : "var(--red)",
                }} />
                <span style={{ fontSize: "0.85rem" }}>
                  X login session: <strong>{summary.xSession.status === "ok" ? "healthy" : summary.xSession.status}</strong>
                  {summary.xSession.daysUntilExpiry != null && ` — ${summary.xSession.daysUntilExpiry} day(s) left`}
                </span>
              </div>
            )}

            {/* Step-by-step */}
            <div className="kb-source-panel">
              <div className="section-header">
                <h2 className="section-title">What each step did</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {summary.steps.map((step, i) => (
                  <div
                    key={`${step.name}-${i}`}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: "12px",
                      padding: "12px 4px",
                      borderBottom: i < summary.steps.length - 1 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <span style={{
                      width: "9px", height: "9px", borderRadius: "50%", flexShrink: 0, marginTop: "5px",
                      background: step.status === "ok" ? "var(--green)" : "var(--red)",
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: "0.88rem" }}>{step.name}</p>
                      {step.status === "ok" ? (
                        <p style={{ margin: "3px 0 0", fontSize: "0.8rem", color: "var(--text-sub)" }}>
                          {step.detail || "Completed"}
                        </p>
                      ) : (
                        <p style={{ margin: "3px 0 0", fontSize: "0.8rem", color: "var(--red)" }}>
                          Failed — {step.error || "unknown error"}
                        </p>
                      )}
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap", flexShrink: 0 }}>
                      {fmtDuration(step.duration_secs)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </section>

      {/* ── Right Sidebar ─────────────────────────────────────────────────── */}
      <aside className="kb-right" aria-label="Summary info">
        <div>
          <h2 className="kb-right-title">About This Page</h2>
          <p className="kb-right-sub" style={{ lineHeight: 1.5 }}>
            A distilled, plain-language digest of the most recent scheduled
            pipeline run — what each step actually found and produced, not
            just pass/fail.
          </p>
        </div>
        <div style={{ marginTop: "20px" }}>
          <h2 className="kb-right-title">Why Steps Still Run</h2>
          <p className="kb-right-sub" style={{ lineHeight: 1.5 }}>
            Steps process whatever backlog is available, not just today&apos;s
            new imports — so a step can show real activity even on a day the
            import step itself failed. See <Link href="/runs" style={{ color: "var(--brand)" }}>Run History</Link> for
            every past run.
          </p>
        </div>
      </aside>
    </main>
  );
}
