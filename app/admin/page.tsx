"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Task {
  taskId: string;
  step:   string;
  ts:     string;
  done:   boolean;
  failed: boolean;
  summary: string;
}

interface Stats {
  sources_total?: number;
  sources_classified?: number;
  courses_total?: number;
  topics_total?: number;
  sources_pending_extract?: number;
  sources_pending_classify?: number;
  sources_pending_course?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin Console
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [recentTasks, setRecentTasks]     = useState<Task[]>([]);
  const [stats, setStats]                 = useState<Stats | null>(null);
  const [prompts, setPrompts]             = useState<Record<string, string>>({});
  const [promptsSaving, setPromptsSaving] = useState(false);
  const [promptsSaved, setPromptsSaved]   = useState(false);
  const [filters, setFilters]             = useState<string[]>([]);
  const [filtersSaving, setFiltersSaving] = useState(false);
  const [filtersSaved, setFiltersSaved]   = useState(false);
  const [newFilter, setNewFilter]         = useState("");
  const [filterError, setFilterError]     = useState("");

  // ── Load stats and recent tasks on mount ──────────────────────────────────
  const refreshStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) setStats(await res.json());
    } catch { /* ignore */ }
  }, []);

  const refreshTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/tasks");
      if (res.ok) {
        const data = await res.json();
        setRecentTasks(data.tasks || []);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    refreshStats();
    refreshTasks();
    // Load prompts
    fetch("/api/admin/prompts")
      .then((r) => r.json())
      .then((d) => { if (d.prompts) setPrompts(d.prompts); })
      .catch(() => {});
    // Load relevance filters
    fetch("/api/admin/filters")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d.patterns)) setFilters(d.patterns); })
      .catch(() => {});
  }, [refreshStats, refreshTasks]);

  const savePrompts = async () => {
    setPromptsSaving(true);
    setPromptsSaved(false);
    try {
      await fetch("/api/admin/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prompts),
      });
      setPromptsSaved(true);
      setTimeout(() => setPromptsSaved(false), 3000);
    } catch { /* ignore */ }
    setPromptsSaving(false);
  };

  const saveFilters = async (updated: string[]) => {
    setFiltersSaving(true);
    setFiltersSaved(false);
    try {
      const res = await fetch("/api/admin/filters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patterns: updated }),
      });
      const data = await res.json();
      if (data.error) { setFilterError(data.error); } else {
        setFilters(updated);
        setFiltersSaved(true);
        setTimeout(() => setFiltersSaved(false), 3000);
      }
    } catch { /* ignore */ }
    setFiltersSaving(false);
  };

  const addFilter = () => {
    const val = newFilter.trim();
    if (!val) return;
    try { new RegExp(val, "i"); } catch {
      setFilterError(`Invalid regex: ${val}`);
      return;
    }
    if (filters.includes(val)) { setFilterError("Pattern already exists"); return; }
    setFilterError("");
    setNewFilter("");
    saveFilters([...filters, val]);
  };

  const removeFilter = (idx: number) => {
    saveFilters(filters.filter((_, i) => i !== idx));
  };

  // ── Auto-scroll terminal ──────────────────────────────────────────────────
  // (removed — terminal section removed)

  const formatTs = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <main className="kb-shell">
      {/* ── Left Nav ──────────────────────────────────────────────────────── */}
      <aside className="kb-sidebar" aria-label="KnowledgeBase navigation">
        <div className="kb-brand">
          <div className="kb-brand-mark" aria-hidden="true" />
          <div>
            <p className="kb-brand-name">KnowledgeBase</p>
            <p className="kb-brand-sub">Admin Console</p>
          </div>
        </div>
        <p className="nav-section-label">Menu</p>
        <Link href="/"           className="kb-nav-link"><span className="kb-nav-icon" />Overview</Link>
        <Link href="/sources"    className="kb-nav-link"><span className="kb-nav-icon" />Source Inbox</Link>
        <Link href="/filtered"   className="kb-nav-link"><span className="kb-nav-icon" />Filtered Tweets</Link>
        <Link href="/courseware" className="kb-nav-link"><span className="kb-nav-icon" />Courseware</Link>
        <Link href="/wiki"       className="kb-nav-link"><span className="kb-nav-icon" />Wiki Notes</Link>
        <Link href="/graph"      className="kb-nav-link"><span className="kb-nav-icon" />Knowledge Graph</Link>
        <Link href="/runs"       className="kb-nav-link"><span className="kb-nav-icon" />Run History</Link>
        <Link href="/tokens"     className="kb-nav-link"><span className="kb-nav-icon" />Token Usage</Link>
        <div className="sidebar-bottom">
          <Link href="/admin" className="kb-nav-link active" aria-current="page"><span className="kb-nav-icon" />Admin</Link>
        </div>
      </aside>

      {/* ── Main Workspace ────────────────────────────────────────────────── */}
      <section className="kb-workspace" style={{ gap: "16px" }}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div style={{ padding: "16px 0 4px" }}>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>Admin Console</h1>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: "2px" }}>
            Manage AI prompts, topic filters, and review recent activity.
          </p>
        </div>

        {/* ── Topic Relevance Filters ───────────────────────────────────────── */}
        <div className="kb-source-panel">
          <div className="section-header">
            <h2 className="section-title">Topic Relevance Filters</h2>
            <span className="see-all" style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              Regex patterns — tweets must match at least one to be imported
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px" }}>
            {filters.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--bg)", padding: "7px 10px", borderRadius: "6px", border: "1px solid var(--border)" }}>
                <code style={{ flex: 1, fontSize: "0.75rem", fontFamily: "'Consolas', monospace", wordBreak: "break-all", color: "var(--text)" }}>{p}</code>
                <button
                  onClick={() => removeFilter(i)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "1rem", lineHeight: 1, padding: "0 4px", flexShrink: 0 }}
                  title="Remove pattern"
                >×</button>
              </div>
            ))}
            {filters.length === 0 && (
              <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>No patterns — all tweets will be imported.</p>
            )}
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
            <input
              type="text"
              placeholder="Add regex pattern, e.g. \b(rust|golang|kotlin)\b"
              value={newFilter}
              onChange={(e) => { setNewFilter(e.target.value); setFilterError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") addFilter(); }}
              style={{
                flex: 1, padding: "8px 10px",
                border: `1px solid ${filterError ? "#ef4444" : "var(--border)"}`,
                borderRadius: "8px", fontSize: "0.78rem",
                fontFamily: "'Consolas', monospace",
                background: "var(--bg)", color: "var(--text)",
              }}
            />
            <button
              onClick={addFilter}
              disabled={filtersSaving}
              style={{ background: "var(--brand)", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", whiteSpace: "nowrap" }}
            >
              {filtersSaving ? "Saving…" : filtersSaved ? "Saved!" : "Add"}
            </button>
          </div>
          {filterError && <p style={{ fontSize: "0.76rem", color: "#ef4444", marginTop: "6px" }}>{filterError}</p>}
        </div>

        {/* ── AI Prompts Editor ─────────────────────────────────────────────── */}
        <div className="kb-source-panel">
          <div className="section-header">
            <h2 className="section-title">AI Prompts</h2>
            <span className="see-all" style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              Edits take effect on the next pipeline run
            </span>
          </div>

          {([
            { key: "compile_course_system",       label: "Course Generation — System Prompt",     rows: 4 },
            { key: "compile_course_instructions", label: "Course Generation — Instructions",       rows: 8 },
            { key: "summarize_topic_system",       label: "Topic Wiki — System Prompt",            rows: 4 },
            { key: "summarize_topic_instructions", label: "Topic Wiki — Instructions",             rows: 8 },
            { key: "classify_source_system",       label: "Source Classifier — System Prompt",    rows: 3 },
            { key: "classify_source_instructions", label: "Source Classifier — Instructions",     rows: 5 },
            { key: "podcast_system",               label: "Podcast Script — System Prompt",        rows: 10 },
          ] as { key: string; label: string; rows: number }[]).map(({ key, label, rows }) => (
            <div key={key} style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, display: "block", marginBottom: "5px", color: "var(--text)" }}>
                {label}
              </label>
              <textarea
                rows={rows}
                value={prompts[key] ?? ""}
                onChange={(e) => setPrompts((p) => ({ ...p, [key]: e.target.value }))}
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "8px 10px",
                  border: "1px solid var(--border)", borderRadius: "8px",
                  fontSize: "0.78rem", fontFamily: "'Consolas', monospace",
                  background: "var(--bg)", color: "var(--text)",
                  resize: "vertical", lineHeight: "1.5",
                }}
              />
            </div>
          ))}

          <button
            onClick={savePrompts}
            disabled={promptsSaving}
            style={{
              background: promptsSaved ? "#22c55e" : "var(--brand)",
              color: "#fff", border: "none", borderRadius: "8px",
              padding: "9px 22px", fontWeight: 700, fontSize: "0.85rem",
              cursor: promptsSaving ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {promptsSaving ? "Saving…" : promptsSaved ? "Saved!" : "Save Prompts"}
          </button>
        </div>

        {/* ── Recent Activity ───────────────────────────────────────────────── */}
        <div className="kb-source-panel">
          <div className="section-header">
            <h2 className="section-title">Recent Activity</h2>
            <button
              onClick={refreshTasks}
              style={{
                background: "none", border: "1px solid var(--border)",
                borderRadius: "6px", padding: "3px 10px",
                fontSize: "0.75rem", cursor: "pointer", color: "var(--muted)",
              }}
            >
              Refresh
            </button>
          </div>

          {recentTasks.length === 0 ? (
            <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>No tasks yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {recentTasks.slice(0, 15).map((t) => (
                <div
                  key={t.taskId}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "8px 12px", borderRadius: "8px",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <span style={{
                    width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
                    background: !t.done ? "#f59e0b" : t.failed ? "#ef4444" : "#22c55e",
                  }} />
                  <span style={{ fontWeight: 600, fontSize: "0.82rem", minWidth: "120px" }}>{t.step}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {t.summary.replace(/^\[task\]/, "").trim()}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "var(--muted)", whiteSpace: "nowrap" }}>
                    {formatTs(t.ts)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </section>

      {/* ── Right Sidebar ─────────────────────────────────────────────────── */}
      <aside className="kb-right" aria-label="System status">
        <div>
          <h2 className="kb-right-title">System Status</h2>
          <p className="kb-right-sub">Knowledge base health</p>
          {stats ? (
            <div className="kb-widget" style={{ marginTop: "12px" }}>
              <div className="vault-row"><span>Sources</span><strong>{stats.sources_total ?? "—"}</strong></div>
              <div className="vault-row"><span>Courses</span><strong>{stats.courses_total ?? "—"}</strong></div>
              <div className="vault-row"><span>Topics</span><strong>{stats.topics_total ?? "—"}</strong></div>
              {(stats.sources_pending_extract ?? 0) > 0 && (
                <div className="vault-row" style={{ color: "#f59e0b" }}>
                  <span>Pending extract</span><strong>{stats.sources_pending_extract}</strong>
                </div>
              )}
              {(stats.sources_pending_classify ?? 0) > 0 && (
                <div className="vault-row" style={{ color: "#f59e0b" }}>
                  <span>Pending classify</span><strong>{stats.sources_pending_classify}</strong>
                </div>
              )}
              {(stats.sources_pending_course ?? 0) > 0 && (
                <div className="vault-row" style={{ color: "#f59e0b" }}>
                  <span>Pending courses</span><strong>{stats.sources_pending_course}</strong>
                </div>
              )}
            </div>
          ) : (
            <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Loading…</p>
          )}
        </div>

        <div>
          <p className="kb-widget-title">Pipeline Order</p>
          <div className="kb-widget">
            {["Pull X Likes", "Extract Sources", "Classify Topics", "Compile Courses", "Summarize Topics", "Build Graph"].map((step, i) => (
              <div key={i} className="vault-row">
                <span style={{ color: "var(--muted)", fontFamily: "monospace" }}>{i + 1}</span>
                <span style={{ fontSize: "0.78rem" }}>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="kb-widget-title">Schedule</p>
          <div className="kb-widget">
            <div className="vault-row"><span>Daily at</span><strong>6:00 AM</strong></div>
            <div className="vault-row"><span>Limit</span><strong>50 likes/day</strong></div>
            <div className="vault-row"><span>Mode</span><strong>Incremental</strong></div>
          </div>
          <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "6px" }}>
            Task Scheduler runs <code>start-scheduled.bat</code> daily.
          </p>
        </div>

        <div>
          <button
            onClick={refreshStats}
            style={{
              width: "100%",
              background: "none", border: "1px solid var(--border)",
              borderRadius: "8px", padding: "9px",
              fontWeight: 600, fontSize: "0.82rem",
              cursor: "pointer", color: "var(--muted)",
            }}
          >
            Refresh Stats
          </button>
        </div>
      </aside>
    </main>
  );
}
