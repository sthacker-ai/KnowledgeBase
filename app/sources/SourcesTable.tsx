"use client";
import { useState } from "react";
import Link from "next/link";
import type { KbSource } from "../lib/kb-data";

type SortKey = "title" | "type" | "status" | "topic" | "importedAt";
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

export default function SourcesTable({ sources }: { sources: KbSource[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("importedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(col: SortKey) {
    if (col === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(col);
      setSortDir("asc");
    }
  }

  const sorted = [...sources].sort((a, b) => {
    const va = (a[sortKey] ?? "") as string;
    const vb = (b[sortKey] ?? "") as string;
    const cmp = va.localeCompare(vb, undefined, { numeric: true });
    return sortDir === "asc" ? cmp : -cmp;
  });

  return (
    <div>
      <div className="kb-table-header" aria-hidden="true">
        <SortHeader label="Source"   col="title"      current={sortKey} dir={sortDir} onSort={handleSort} />
        <SortHeader label="Type"     col="type"       current={sortKey} dir={sortDir} onSort={handleSort} />
        <SortHeader label="Status"   col="status"     current={sortKey} dir={sortDir} onSort={handleSort} />
        <SortHeader label="Topic"    col="topic"      current={sortKey} dir={sortDir} onSort={handleSort} />
        <SortHeader label="Imported" col="importedAt" current={sortKey} dir={sortDir} onSort={handleSort} />
      </div>

      {sorted.map((s) => (
        <div key={s.id} className="kb-source-row">
          <div>
            <a
              href={s.url || `https://x.com/i/status/${s.id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="kb-source-title">{s.title}</div>
              <div className="kb-source-author">{s.author}</div>
            </a>
          </div>

          <div className="kb-source-type">{s.type}</div>

          <div>
            <span className={`kb-badge ${s.status}`}>{s.status.replace("_", " ")}</span>
          </div>

          <div className="kb-source-author" style={{ fontSize: "0.78rem" }}>
            {s.topicSlug ? (
              <Link href={`/courseware/${s.topicSlug}`} style={{ color: "var(--brand)", textDecoration: "none" }}>
                {s.topic || s.topicSlug}
              </Link>
            ) : (
              s.topic || "—"
            )}
          </div>

          <div style={{ fontSize: "0.73rem", color: "var(--muted)", lineHeight: 1.4 }}>
            {formatDate(s.importedAt)}
          </div>
        </div>
      ))}
    </div>
  );
}
