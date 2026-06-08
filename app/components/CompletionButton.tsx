"use client";

import { useState, useEffect } from "react";

interface Props {
  courseId: string;   // e.g. "ai-agents/course-001"
  topicSlug: string;  // e.g. "ai-agents"
}

export default function CompletionButton({ courseId, topicSlug }: Props) {
  const [status, setStatus]   = useState<"none" | "in_progress" | "completed" | "loading">("loading");
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    fetch(`/api/learn/progress?courseId=${encodeURIComponent(courseId)}`)
      .then((r) => r.json())
      .then((d) => setStatus(d.status ?? "none"))
      .catch(() => setStatus("none"));
  }, [courseId]);

  const markCompleted = async () => {
    if (saving || status === "completed") return;
    setSaving(true);
    try {
      await fetch("/api/learn/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, topicSlug, status: "completed" }),
      });
      setStatus("completed");
    } catch {
      /* ignore */
    }
    setSaving(false);
  };

  if (status === "loading") return null;

  if (status === "completed") {
    return (
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        background: "#dcfce7", color: "#15803d",
        border: "1px solid #bbf7d0",
        borderRadius: "8px", padding: "7px 14px",
        fontSize: "0.85rem", fontWeight: 600,
      }}>
        ✓ Completed
      </div>
    );
  }

  return (
    <button
      onClick={markCompleted}
      disabled={saving}
      style={{
        background: saving ? "var(--border)" : "var(--brand)",
        color: "#fff", border: "none", borderRadius: "8px",
        padding: "7px 16px", fontWeight: 600, fontSize: "0.85rem",
        cursor: saving ? "not-allowed" : "pointer",
        transition: "background 0.15s",
      }}
    >
      {saving ? "Saving…" : "Mark as Completed"}
    </button>
  );
}
