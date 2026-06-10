"use client";
import { useState } from "react";
import Link from "next/link";

export interface CourseEntry {
  slug: string;
  title: string;
  num: string;
  readingTimeMin: number;
  generatedAt?: string;
}

interface Props {
  courses: CourseEntry[];
  topic: string;
  topicLabel: string;
}

export default function CourseList({ courses, topic, topicLabel }: Props) {
  const [query, setQuery] = useState("");
  const filtered = query.trim()
    ? courses.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
    : courses;

  return (
    <div>
      {courses.length > 3 && (
        <div style={{ padding: "0 0 12px" }}>
          <input
            type="search"
            placeholder="Search courses…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
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
        </div>
      )}

      {filtered.length === 0 && query && (
        <p style={{ color: "var(--muted)", padding: "12px 0" }}>
          No courses match &ldquo;{query}&rdquo;
        </p>
      )}

      {filtered.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 90px 140px",
            gap: "12px",
            padding: "0 12px 10px",
            borderBottom: "1px solid var(--border)",
            marginBottom: "2px",
          }}
        >
          {["Course", "Read Time", "Generated"].map((h) => (
            <span key={h} style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
              {h}
            </span>
          ))}
        </div>
      )}

      {filtered.map((course) => {
        const dateStr = course.generatedAt
          ? (() => { const d = new Date(course.generatedAt!); return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" }) + " " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }); })()
          : "—";
        return (
          <Link
            key={course.slug}
            href={`/courseware/${topic}/${course.slug}`}
            className="kb-source-row"
            style={{ textDecoration: "none", gridTemplateColumns: "minmax(0, 1fr) 90px 140px" }}
          >
            <div className="kb-source-title">{course.title}</div>
            <div className="kb-source-author">~{course.readingTimeMin} min</div>
            <div className="kb-source-author" style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.72rem" }}>
              {dateStr}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
