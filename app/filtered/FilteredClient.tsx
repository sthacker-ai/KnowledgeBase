"use client";

import { useState } from "react";

interface FilteredTweet {
  tweet_id:      string;
  filtered_at:   string;
  tweet_url:     string;
  author_handle: string;
  tweet_text:    string;
  reason:        string;
}

interface Props {
  initialTweets: FilteredTweet[];
}

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" });
}

function reasonLabel(reason: string) {
  const map: Record<string, string> = {
    no_topic_match: "No topic match",
    too_short:      "Too short",
    spam:           "Spam",
  };
  return map[reason] || reason || "Filtered";
}

function smartTruncate(text: string, maxLen = 180): string {
  if (!text || text.length <= maxLen) return text;
  const sentenceEnd = /[.!?] /g;
  let lastGood = -1;
  let m;
  while ((m = sentenceEnd.exec(text)) !== null) {
    if (m.index + 2 <= maxLen) lastGood = m.index + 1;
    else break;
  }
  if (lastGood > maxLen * 0.5) return text.slice(0, lastGood + 1).trimEnd() + "…";
  const wordCut = text.lastIndexOf(" ", maxLen);
  if (wordCut > maxLen * 0.5) return text.slice(0, wordCut) + "…";
  return text.slice(0, maxLen) + "…";
}

export default function FilteredClient({ initialTweets }: Props) {
  const [tweets, setTweets]     = useState<FilteredTweet[]>(initialTweets);
  const [unfiltering, setUnfiltering] = useState<string | null>(null);
  const [query, setQuery]       = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filtered = query.trim()
    ? tweets.filter(
        (t) =>
          t.tweet_text.toLowerCase().includes(query.toLowerCase()) ||
          t.author_handle.toLowerCase().includes(query.toLowerCase()),
      )
    : tweets;

  async function handleUnfilter(tweet_id: string) {
    if (unfiltering) return;
    setUnfiltering(tweet_id);
    try {
      const res = await fetch("/api/filtered/unfilter", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ tweet_id }),
      });
      if (res.ok) {
        setTweets((prev) => prev.filter((t) => t.tweet_id !== tweet_id));
      }
    } catch { /* ignore */ }
    setUnfiltering(null);
  }

  return (
    <div>
      {tweets.length > 5 && (
        <div style={{ padding: "0 0 12px" }}>
          <input
            type="search"
            placeholder="Search filtered tweets…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%", padding: "10px 14px",
              border: "1px solid var(--border)", borderRadius: "8px",
              background: "var(--surface)", color: "inherit",
              fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
            }}
          />
        </div>
      )}

      {filtered.length === 0 && (
        <p style={{ color: "var(--muted)", padding: "12px 0", fontSize: "0.88rem" }}>
          {tweets.length === 0
            ? "No filtered tweets — all imported tweets matched your relevance filters."
            : `No results for "${query}"`}
        </p>
      )}

      {filtered.map((t) => {
        const isExpanded = expanded.has(t.tweet_id);
        const needsTruncate = (t.tweet_text?.length ?? 0) > 180;
        const displayText = needsTruncate && !isExpanded
          ? smartTruncate(t.tweet_text, 180)
          : t.tweet_text;
        return (
        <div
          key={t.tweet_id}
          className="kb-source-row"
          style={{ gridTemplateColumns: "minmax(0, 1fr) auto", gap: "12px", alignItems: "start" }}
        >
          <div style={{ minWidth: 0 }}>
            <div className="kb-source-title" style={{ marginBottom: "4px", wordBreak: "break-word" }}>
              {t.tweet_text
                ? <>
                    {displayText}
                    {needsTruncate && (
                      <button
                        onClick={() => setExpanded(prev => {
                          const next = new Set(prev);
                          isExpanded ? next.delete(t.tweet_id) : next.add(t.tweet_id);
                          return next;
                        })}
                        style={{ marginLeft: "6px", fontSize: "0.72rem", color: "var(--brand)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        {isExpanded ? "less" : "more"}
                      </button>
                    )}
                  </>
                : <em style={{ color: "var(--muted)" }}>(no text — media-only tweet)</em>}
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
              <span className="kb-source-author">@{t.author_handle}</span>
              <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{formatDate(t.filtered_at)}</span>
              <span style={{
                fontSize: "0.7rem", fontWeight: 600, padding: "1px 7px", borderRadius: "99px",
                background: "var(--amber-dim)", color: "var(--amber)",
              }}>
                {reasonLabel(t.reason)}
              </span>
              <a
                href={t.tweet_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "0.72rem", color: "var(--brand)" }}
              >
                View on X ↗
              </a>
            </div>
          </div>
          <button
            onClick={() => handleUnfilter(t.tweet_id)}
            disabled={unfiltering === t.tweet_id}
            style={{
              background: unfiltering === t.tweet_id ? "var(--surface-alt)" : "var(--accent-gradient)",
              color: unfiltering === t.tweet_id ? "var(--muted)" : "#1a1206", border: "none", borderRadius: "6px",
              padding: "5px 12px", fontSize: "0.78rem", fontWeight: 700,
              cursor: unfiltering === t.tweet_id ? "not-allowed" : "pointer",
              whiteSpace: "nowrap", flexShrink: 0,
            }}
          >
            {unfiltering === t.tweet_id ? "…" : "Unfilter"}
          </button>
        </div>
        );
      })}
    </div>
  );
}
