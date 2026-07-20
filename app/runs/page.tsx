import Link from "next/link";
import RunsClient from "./RunsClient";
import { getRunsData } from "../lib/runs-tokens-data";

export const dynamic = "force-dynamic";

export default async function RunsPage() {
  const runs = await getRunsData();

  return (
    <main className="kb-shell">
      {/* ── Left Nav ──────────────────────────────────────────────────────── */}
      <aside className="kb-sidebar" aria-label="KnowledgeBase navigation">
        <div className="kb-brand">
          <div className="kb-brand-mark" aria-hidden="true" />
          <div>
            <p className="kb-brand-name">KnowledgeBase</p>
            <p className="kb-brand-sub">Run History</p>
          </div>
        </div>
        <p className="nav-section-label">Menu</p>
        <Link href="/"           className="kb-nav-link"><span className="kb-nav-icon" />Overview</Link>
        <Link href="/summary"    className="kb-nav-link"><span className="kb-nav-icon" />Daily Summary</Link>
        <Link href="/sources"    className="kb-nav-link"><span className="kb-nav-icon" />Source Inbox</Link>
        <Link href="/filtered"   className="kb-nav-link"><span className="kb-nav-icon" />Filtered Tweets</Link>
        <Link href="/courseware" className="kb-nav-link"><span className="kb-nav-icon" />Courseware</Link>
        <Link href="/wiki"       className="kb-nav-link"><span className="kb-nav-icon" />Wiki Notes</Link>
        <Link href="/graph"      className="kb-nav-link"><span className="kb-nav-icon" />Knowledge Graph</Link>
        <Link href="/runs"       className="kb-nav-link active" aria-current="page"><span className="kb-nav-icon" />Run History</Link>
        <Link href="/tokens"     className="kb-nav-link"><span className="kb-nav-icon" />Token Usage</Link>
        <div className="sidebar-bottom">
          <Link href="/admin" className="kb-nav-link"><span className="kb-nav-icon" />Admin</Link>
        </div>
      </aside>

      {/* ── Main Workspace ────────────────────────────────────────────────── */}
      <section className="kb-workspace" style={{ gap: "16px" }}>
        <div style={{ padding: "16px 0 4px" }}>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>Run History</h1>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: "2px" }}>
            {runs.length} run{runs.length !== 1 ? "s" : ""} recorded &middot; Click a row to expand step details.
          </p>
        </div>

        <div className="kb-widget" style={{ padding: "0" }}>
          <RunsClient initialRuns={runs} />
        </div>
      </section>

      {/* ── Right Sidebar ─────────────────────────────────────────────────── */}
      <aside className="kb-right" aria-label="Run info">
        <div>
          <h2 className="kb-right-title">Pipeline Steps</h2>
          <p className="kb-right-sub">Execution order</p>
          <div className="kb-widget" style={{ marginTop: "12px" }}>
            {[
              { n: "1", step: "Import X Likes",        desc: "Fetch & filter new liked tweets" },
              { n: "2", step: "Source extraction",     desc: "Parse tweet content & links" },
              { n: "3", step: "Video transcripts",     desc: "Download & transcribe video audio" },
              { n: "4", step: "AI classification",     desc: "AI topic assignment" },
              { n: "5", step: "Course generation",     desc: "Generate courseware markdown" },
              { n: "6", step: "Topic summaries",       desc: "Build wiki summaries" },
              { n: "7", step: "Graph build",           desc: "Update knowledge graph" },
              { n: "8", step: "Hero images",           desc: "AI images for courses" },
              { n: "9", step: "Podcasts",              desc: "2-speaker podcast audio" },
              { n: "10", step: "Obsidian vault export", desc: "Sync to Obsidian vault" },
            ].map((s) => (
              <div key={s.n} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
                <span style={{ background: "var(--accent, #6366f1)", color: "#fff", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, flexShrink: 0 }}>{s.n}</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: "0.8rem" }}>{s.step}</p>
                  <p style={{ margin: 0, fontSize: "0.73rem", color: "var(--muted)" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: "20px" }}>
          <h2 className="kb-right-title">Pipeline Behavior</h2>
          <p className="kb-right-sub" style={{ lineHeight: 1.5 }}>
            A failed step no longer stops the run — the rest of the pipeline still processes whatever's available, and the run is marked &ldquo;Partial&rdquo; instead of aborted. Each step is idempotent, so the next scheduled run picks up anything that was skipped.
          </p>
        </div>
      </aside>
    </main>
  );
}
