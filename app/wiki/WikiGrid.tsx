"use client";
import { useState } from "react";
import Link from "next/link";

export interface WikiSummaryData {
  slug: string;
  label: string;
  courseCount: number;
  excerpt: string;
  summarizedAt?: string;
}

type SortKey = "label" | "courseCount" | "summarizedAt";
type SortDir = "asc" | "desc";

function SortHeader({
  label, col, current, dir, onSort,
}: {
  label: string; col: SortKey; current: SortKey; dir: SortDir; onSort: (c: SortKey) => void;
}) {
  const active = current === col;
  const arrow = !active ? "↕" : dir === "asc" ? "↑" : "↓";
  return (
    <span
      onClick={() => onSort(col)}
      style={{ cursor: "pointer", userSelect: "none", display: "inline-flex", gap: "3px", alignItems: "center" }}
      title={`Sort by ${label}`}
    >
      {label} <span style={{ opacity: active ? 1 : 0.35, fontSize: "0.65rem" }}>{arrow}</span>
    </span>
  );
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" }) +
    " " +
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  );
}

export default function WikiGrid({ summaries }: { summaries: WikiSummaryData[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("courseCount");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(col: SortKey) {
    if (col === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(col);
      setSortDir(col === "courseCount" ? "desc" : "asc");
    }
  }

  const filtered = (query.trim()
    ? summaries.filter(
        (s) =>
          s.label.toLowerCase().includes(query.toLowerCase()) ||
          s.excerpt.toLowerCase().includes(query.toLowerCase())
      )
    : summaries
  ).sort((a, b) => {
    if (sortKey === "courseCount") {
      const diff = a.courseCount - b.courseCount;
      return sortDir === "asc" ? diff : -diff;
    }
    const va = sortKey === "summarizedAt" ? (a.summarizedAt ?? "") : a.label;
    const vb = sortKey === "summarizedAt" ? (b.summarizedAt ?? "") : b.label;
    const cmp = va.localeCompare(vb);
    return sortDir === "asc" ? cmp : -cmp;
  });

  return (
    <div>
      {/* Search + count */}
      <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
        <input
          type="search"
          placeholder="Filter topics…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 14px",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            background: "var(--surface)",
            color: "inherit",
            fontSize: "0.9rem",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        <span style={{ fontSize: "0.8rem", color: "var(--muted)", whiteSpace: "nowrap" }}>
          {filtered.length} / {summaries.length}
        </span>
      </div>

      {/* Column headers */}
      <div className="kb-table-header" aria-hidden="true">
        <SortHeader label="Topic"   col="label"        current={sortKey} dir={sortDir} onSort={handleSort} />
        <SortHeader label="Courses" col="courseCount"  current={sortKey} dir={sortDir} onSort={handleSort} />
        <span />
        <span />
        <SortHeader label="Updated" col="summarizedAt" current={sortKey} dir={sortDir} onSort={handleSort} />
      </div>

      {filtered.length === 0 && query && (
        <p style={{ color: "var(--muted)", padding: "20px 0" }}>
          No topics match &ldquo;{query}&rdquo;
        </p>
      )}

      {filtered.map((s) => (
        <Link
          key={s.slug}
          href={`/wiki/${s.slug}`}
          className="kb-source-row"
          style={{ textDecoration: "none", alignItems: "flex-start", paddingTop: "14px", paddingBottom: "14px" }}
        >
          <div style={{ flex: 2 }}>
            <div className="kb-source-title">{s.label}</div>
            {s.excerpt && (
              <div style={{ fontSize: "0.76rem", color: "var(--muted)", marginTop: "4px", lineHeight: 1.5 }}>
                {s.excerpt}
              </div>
            )}
          </div>
          <div className="kb-source-author" style={{ fontSize: "0.82rem", paddingTop: "2px" }}>
            {s.courseCount} course{s.courseCount !== 1 ? "s" : ""}
          </div>
          <div />
          <div />
          <div style={{ fontSize: "0.73rem", color: "var(--muted)", lineHeight: 1.4, paddingTop: "2px" }}>
            {formatDate(s.summarizedAt)}
          </div>
        </Link>
      ))}
    </div>
  );
}
