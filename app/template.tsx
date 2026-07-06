"use client";

// A template (unlike layout) re-mounts on every navigation, so this wrapper
// replays its entrance animation on each route change — giving app-wide page
// transitions with no dependency. Opacity-only (no transform) so it never
// establishes a containing block that would break the sticky sidebar.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="kb-page-transition">{children}</div>;
}
