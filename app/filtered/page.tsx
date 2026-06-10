import Link from "next/link";
import FilteredClient from "./FilteredClient";

export const dynamic = "force-dynamic";

async function getFilteredTweets() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3005";
    const res = await fetch(`${baseUrl}/api/filtered`, { cache: "no-store" });
    if (!res.ok) return { tweets: [], total: 0 };
    return res.json();
  } catch {
    return { tweets: [], total: 0 };
  }
}

export default async function FilteredPage() {
  const { tweets, total } = await getFilteredTweets();

  return (
    <main className="kb-shell">
      {/* ── Left Nav ──────────────────────────────────────────────────────── */}
      <aside className="kb-sidebar" aria-label="KnowledgeBase navigation">
        <div className="kb-brand">
          <div className="kb-brand-mark" aria-hidden="true" />
          <div>
            <p className="kb-brand-name">KnowledgeBase</p>
            <p className="kb-brand-sub">Filtered Tweets</p>
          </div>
        </div>
        <p className="nav-section-label">Menu</p>
        <Link href="/"           className="kb-nav-link"><span className="kb-nav-icon" />Overview</Link>
        <Link href="/sources"    className="kb-nav-link"><span className="kb-nav-icon" />Source Inbox</Link>
        <Link href="/filtered"   className="kb-nav-link active" aria-current="page"><span className="kb-nav-icon" />Filtered Tweets</Link>
        <Link href="/courseware" className="kb-nav-link"><span className="kb-nav-icon" />Courseware</Link>
        <Link href="/wiki"       className="kb-nav-link"><span className="kb-nav-icon" />Wiki Notes</Link>
        <Link href="/graph"      className="kb-nav-link"><span className="kb-nav-icon" />Knowledge Graph</Link>
        <Link href="/runs"       className="kb-nav-link"><span className="kb-nav-icon" />Run History</Link>
        <Link href="/tokens"     className="kb-nav-link"><span className="kb-nav-icon" />Token Usage</Link>
        <div className="sidebar-bottom">
          <Link href="/admin"    className="kb-nav-link"><span className="kb-nav-icon" />Admin</Link>
        </div>
      </aside>

      {/* ── Main Workspace ────────────────────────────────────────────────── */}
      <section className="kb-workspace" style={{ gap: "16px" }}>
        <div style={{ padding: "16px 0 4px" }}>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>Filtered Tweets</h1>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: "2px" }}>
            {total} tweet{total !== 1 ? "s" : ""} filtered out by relevance rules &middot; Click &ldquo;Unfilter&rdquo; to re-add to the pipeline.
          </p>
        </div>

        <div className="kb-source-panel" style={{ padding: "16px" }}>
          <FilteredClient initialTweets={tweets} />
        </div>
      </section>

      {/* ── Right Sidebar ─────────────────────────────────────────────────── */}
      <aside className="kb-right" aria-label="Filtered tweets info">
        <div>
          <h2 className="kb-right-title">About Filtered Tweets</h2>
          <p className="kb-right-sub" style={{ lineHeight: 1.5 }}>
            Tweets that don&apos;t match any Topic Relevance Filter are placed here instead of entering the pipeline. They are not imported or processed.
          </p>
        </div>
        <div style={{ marginTop: "20px" }}>
          <h2 className="kb-right-title">Unfilter</h2>
          <p className="kb-right-sub" style={{ lineHeight: 1.5 }}>
            Clicking <strong>Unfilter</strong> removes the tweet from this list and adds it back to the import queue. It will be picked up on the next pipeline run.
          </p>
        </div>
        <div style={{ marginTop: "20px" }}>
          <h2 className="kb-right-title">Filter Rules</h2>
          <p className="kb-right-sub" style={{ lineHeight: 1.5 }}>
            Edit the regex patterns in <Link href="/admin" style={{ color: "var(--brand)" }}>Admin &rarr; Topic Relevance Filters</Link>.
          </p>
        </div>
      </aside>
    </main>
  );
}
