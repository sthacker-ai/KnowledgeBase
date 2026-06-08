import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { requireAdmin } from "../_lib/auth";

const FILTERS_PATH = path.join(process.cwd(), "data", "config", "relevance-filters.json");

function loadFilters(): string[] {
  try {
    if (!fs.existsSync(FILTERS_PATH)) return [];
    const raw = fs.readFileSync(FILTERS_PATH, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data.patterns) ? data.patterns : [];
  } catch {
    return [];
  }
}

export async function GET() {
  return NextResponse.json({ patterns: loadFilters() });
}

export async function POST(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    if (!Array.isArray(body.patterns)) {
      return NextResponse.json({ error: "patterns must be an array" }, { status: 400 });
    }

    const patterns: string[] = body.patterns
      .map((p: unknown) => String(p).trim())
      .filter((p: string) => p.length > 0);

    if (patterns.length > 200) {
      return NextResponse.json({ error: "Too many patterns; maximum is 200" }, { status: 400 });
    }

    // Validate each entry is a valid regex before saving
    for (const p of patterns) {
      if (p.length > 200) {
        return NextResponse.json({ error: `Regex is too long: ${p.slice(0, 80)}...` }, { status: 400 });
      }
      try { new RegExp(p, "i"); } catch {
        return NextResponse.json({ error: `Invalid regex: ${p}` }, { status: 400 });
      }
    }

    const dir = path.dirname(FILTERS_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let existing: Record<string, unknown> = {};
    if (fs.existsSync(FILTERS_PATH)) {
      try { existing = JSON.parse(fs.readFileSync(FILTERS_PATH, "utf8")); } catch { existing = {}; }
    }

    existing.patterns = patterns;
    existing.updated_at = new Date().toISOString();
    fs.writeFileSync(FILTERS_PATH, JSON.stringify(existing, null, 2), "utf8");

    return NextResponse.json({ ok: true, count: patterns.length });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
