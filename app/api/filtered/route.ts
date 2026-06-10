import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const FILTERED_INDEX_PATH = path.join(ROOT, "data", "indexes", "filtered-tweets.json");

interface FilteredEntry {
  filtered_at:    string;
  tweet_url:      string;
  author_handle:  string;
  tweet_text:     string;
  reason:         string;
}

interface FilteredIndex {
  schema_version: number;
  tweet_ids:      Record<string, FilteredEntry>;
}

export async function GET() {
  try {
    if (!fs.existsSync(FILTERED_INDEX_PATH)) {
      return NextResponse.json({ tweets: [], total: 0 });
    }
    const raw: FilteredIndex = JSON.parse(fs.readFileSync(FILTERED_INDEX_PATH, "utf8"));
    const tweets = Object.entries(raw.tweet_ids || {})
      .map(([tweet_id, entry]) => ({ tweet_id, ...entry }))
      .sort((a, b) => (b.filtered_at > a.filtered_at ? 1 : -1));
    return NextResponse.json({ tweets, total: tweets.length });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
