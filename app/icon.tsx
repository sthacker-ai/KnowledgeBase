import { ImageResponse } from "next/og";

// Next.js App Router auto-detects this file and serves it as the favicon.
// Recreates the brand mark from docs/brandguide.md — two overlapping rounded
// squares, gold (top-left) and rose (bottom-right) — as a generated PNG
// rather than a binary asset, so it's plain code and stays in sync with the
// brand tokens if the palette ever changes.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0a0c14",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 4,
            top: 4,
            width: 17,
            height: 17,
            borderRadius: 4,
            background: "#f3c14b",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 4,
            bottom: 4,
            width: 17,
            height: 17,
            borderRadius: 4,
            background: "#f2789f",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
