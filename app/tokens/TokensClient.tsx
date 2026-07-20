"use client";
import { useState } from "react";

interface TokenRow {
  model:             string;
  provider:          string;
  calls:             number;
  prompt_tokens:     number;
  completion_tokens: number;
  total_tokens:      number;
  audio_seconds?:    number;
}

interface RecentEntry {
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

type ModelSortKey  = "model" | "provider" | "calls" | "prompt_tokens" | "completion_tokens" | "total_tokens";
type RecentSortKey = "ts" | "label" | "model" | "prompt_tokens" | "completion_tokens" | "total_tokens";
type SortDir = "asc" | "desc";

function fmtNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function fmtDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" }) +
    " " +
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  );
}

function SortTh({
  label, col, current, dir, right, onSort,
}: {
  label: string; col: string; current: string; dir: SortDir; right?: boolean;
  onSort: (c: string) => void;
}) {
  const active = current === col;
  const arrow = !active ? "↕" : dir === "asc" ? "↑" : "↓";
  return (
    <th
      onClick={() => onSort(col)}
      style={{
        padding: right ? "8px 12px" : "8px 16px",
        fontWeight: 600,
        textAlign: right ? "right" : "left",
        cursor: "pointer",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      {label} <span style={{ opacity: active ? 1 : 0.35, fontSize: "0.6rem" }}>{arrow}</span>
    </th>
  );
}

function useSort<K extends string>(defaultKey: K, defaultDir: SortDir = "desc") {
  const [key, setKey] = useState<K>(defaultKey);
  const [dir, setDir] = useState<SortDir>(defaultDir);
  function toggle(col: string) {
    if (col === key) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setKey(col as K); setDir("desc"); }
  }
  return { key, dir, toggle };
}

export default function TokensClient({
  byModel,
  recentEntries,
}: {
  byModel: TokenRow[];
  recentEntries: RecentEntry[];
}) {
  const model  = useSort<ModelSortKey>("total_tokens");
  const recent = useSort<RecentSortKey>("ts");

  const sortedModels = [...byModel].sort((a, b) => {
    const numKeys: ModelSortKey[] = ["calls", "prompt_tokens", "completion_tokens", "total_tokens"];
    if (numKeys.includes(model.key)) {
      const diff = (a[model.key] as number) - (b[model.key] as number);
      return model.dir === "asc" ? diff : -diff;
    }
    const cmp = String(a[model.key]).localeCompare(String(b[model.key]));
    return model.dir === "asc" ? cmp : -cmp;
  });

  const sortedRecent = [...recentEntries].sort((a, b) => {
    const numKeys: RecentSortKey[] = ["prompt_tokens", "completion_tokens", "total_tokens"];
    if (numKeys.includes(recent.key)) {
      const diff = (a[recent.key] as number) - (b[recent.key] as number);
      return recent.dir === "asc" ? diff : -diff;
    }
    const va = recent.key === "ts" ? a.ts : recent.key === "model" ? a.model : a.label;
    const vb = recent.key === "ts" ? b.ts : recent.key === "model" ? b.model : b.label;
    const cmp = String(va ?? "").localeCompare(String(vb ?? ""));
    return recent.dir === "asc" ? cmp : -cmp;
  });

  return (
    <>
      {/* By model table */}
      <div className="kb-widget" style={{ padding: "0" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border, #e5e7eb)" }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: "0.88rem" }}>By Model</p>
        </div>
        {byModel.length === 0 ? (
          <p style={{ padding: "16px", color: "var(--muted)", fontSize: "0.85rem" }}>
            No token data yet. Token tracking starts from the next pipeline run.
          </p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border, #e5e7eb)", color: "var(--muted)", textAlign: "left" }}>
                <SortTh label="Model"    col="model"             current={model.key} dir={model.dir} onSort={model.toggle} />
                <SortTh label="Provider" col="provider"          current={model.key} dir={model.dir} onSort={model.toggle} />
                <SortTh label="Calls"    col="calls"             current={model.key} dir={model.dir} onSort={model.toggle} right />
                <SortTh label="Input"    col="prompt_tokens"     current={model.key} dir={model.dir} onSort={model.toggle} right />
                <SortTh label="Output"   col="completion_tokens" current={model.key} dir={model.dir} onSort={model.toggle} right />
                <SortTh label="Total"    col="total_tokens"      current={model.key} dir={model.dir} onSort={model.toggle} right />
              </tr>
            </thead>
            <tbody>
              {sortedModels.map((row) => (
                <tr key={row.model} style={{ borderBottom: "1px solid var(--border, #f3f4f6)" }}>
                  <td style={{ padding: "10px 16px", fontFamily: "ui-monospace, monospace", fontSize: "0.78rem" }}>{row.model}</td>
                  <td style={{ padding: "10px 12px", color: "var(--muted)" }}>{row.provider}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right" }}>{row.calls}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right", color: "var(--muted)" }}>
                    {row.provider === "Groq" ? `${Math.round((row.audio_seconds || 0) / 60)}m audio` : fmtNum(row.prompt_tokens)}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", color: "var(--muted)" }}>
                    {row.provider === "Groq" ? "—" : fmtNum(row.completion_tokens)}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600 }}>
                    {row.provider === "Groq" ? `${Math.round((row.audio_seconds || 0) / 60)}m` : fmtNum(row.total_tokens)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent API calls */}
      {recentEntries.length > 0 && (
        <div className="kb-widget" style={{ padding: "0" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border, #e5e7eb)" }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: "0.88rem" }}>Recent API Calls</p>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border, #e5e7eb)", color: "var(--muted)", textAlign: "left" }}>
                <SortTh label="Date/Time" col="ts"                current={recent.key} dir={recent.dir} onSort={recent.toggle} />
                <SortTh label="Label"     col="label"             current={recent.key} dir={recent.dir} onSort={recent.toggle} />
                <SortTh label="Model"     col="model"             current={recent.key} dir={recent.dir} onSort={recent.toggle} />
                <SortTh label="In"        col="prompt_tokens"     current={recent.key} dir={recent.dir} onSort={recent.toggle} right />
                <SortTh label="Out"       col="completion_tokens" current={recent.key} dir={recent.dir} onSort={recent.toggle} right />
                <SortTh label="Total"     col="total_tokens"      current={recent.key} dir={recent.dir} onSort={recent.toggle} right />
              </tr>
            </thead>
            <tbody>
              {sortedRecent.map((e, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border, #f9fafb)" }}>
                  <td style={{ padding: "5px 16px", fontSize: "0.72rem", color: "var(--muted)", whiteSpace: "nowrap" }}>{fmtDate(e.ts)}</td>
                  <td style={{ padding: "5px 12px", fontFamily: "ui-monospace, monospace", color: "var(--muted)", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.label}</td>
                  <td style={{ padding: "5px 12px", fontFamily: "ui-monospace, monospace", fontSize: "0.72rem" }}>{e.model.split("/").pop()}</td>
                  <td style={{ padding: "5px 12px", textAlign: "right", color: "var(--muted)" }}>
                    {e.provider === "Groq" ? `${Math.round((e.audio_seconds || 0))}s` : fmtNum(e.prompt_tokens)}
                  </td>
                  <td style={{ padding: "5px 12px", textAlign: "right", color: "var(--muted)" }}>
                    {e.provider === "Groq" ? `${e.word_count || 0}w` : fmtNum(e.completion_tokens)}
                  </td>
                  <td style={{ padding: "5px 12px", textAlign: "right" }}>
                    {e.provider === "Groq" ? `${Math.round((e.audio_seconds || 0))}s` : fmtNum(e.total_tokens)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
