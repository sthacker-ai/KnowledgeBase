"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a number counting up from 0 on mount. Accepts the already-formatted
 * display string (e.g. "42" or "128k"); it parses the leading number, animates
 * it, and re-applies any suffix ("k"). Non-numeric values render unchanged.
 * Respects prefers-reduced-motion by rendering the final value immediately.
 */
export default function CountUp({ value, durationMs = 900 }: { value: string; durationMs?: number }) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[1]) : null;
  const suffix = match ? match[2] : "";

  const [display, setDisplay] = useState<string>(target === null ? value : `0${suffix}`);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (target === null) { setDisplay(value); return; }

    const reduce = typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setDisplay(value); return; }

    const start = performance.now();
    const isInt = Number.isInteger(target);

    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = target * eased;
      setDisplay((isInt ? Math.round(current) : current.toFixed(1)) + suffix);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, target, suffix, durationMs]);

  return <>{display}</>;
}
