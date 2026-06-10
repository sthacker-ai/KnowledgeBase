import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const FILTERED_INDEX_PATH = path.join(ROOT, "data", "indexes", "filtered-tweets.json");
const SEEN_INDEX_PATH     = path.join(ROOT, "data", "indexes", "seen-tweets.json");
const RAW_DIR             = path.join(ROOT, "data", "raw", "tweets");

interface FilteredIndex {
  schema_version: number;
  tweet_ids:      Record<string, object>;
}

interface SeenIndex {
  schema_version: number;
  tweet_ids:      Record<string, object>;
}

export async function POST(req: NextRequest) {
  try {
    const { tweet_id } = await req.json() as { tweet_id: string };
    if (!tweet_id) return NextResponse.json({ error: "tweet_id required" }, { status: 400 });

    // Load filtered index
    const filtered: FilteredIndex = fs.existsSync(FILTERED_INDEX_PATH)
      ? JSON.parse(fs.readFileSync(FILTERED_INDEX_PATH, "utf8"))
      : { schema_version: 1, tweet_ids: {} };

    if (!filtered.tweet_ids[tweet_id]) {
      return NextResponse.json({ error: "Tweet not found in filtered index" }, { status: 404 });
    }

    const entry = filtered.tweet_ids[tweet_id] as Record<string, string>;

    // Remove from filtered index
    delete filtered.tweet_ids[tweet_id];
    fs.writeFileSync(FILTERED_INDEX_PATH, JSON.stringify(filtered, null, 2));

    // Also remove from seen index so next import re-processes it
    if (fs.existsSync(SEEN_INDEX_PATH)) {
      const seen: SeenIndex = JSON.parse(fs.readFileSync(SEEN_INDEX_PATH, "utf8"));
      if (seen.tweet_ids[tweet_id]) {
        delete seen.tweet_ids[tweet_id];
        fs.writeFileSync(SEEN_INDEX_PATH, JSON.stringify(seen, null, 2));
      }
    }

    // Create a minimal raw tweet JSON so the pipeline can pick it up
    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
    const rawPath = path.join(RAW_DIR, `${tweet_id}.json`);
    if (!fs.existsSync(rawPath)) {
      const rawTweet = {
        tweet_id,
        tweet_url:        entry.tweet_url || `https://x.com/i/status/${tweet_id}`,
        author_handle:    entry.author_handle || "",
        tweet_text:       entry.tweet_text || "",
        scraped_at:       new Date().toISOString(),
        processing_status: "imported",
        unfiltered_at:    new Date().toISOString(),
        unfiltered_note:  "Manually unfiltered via Admin UI",
      };
      fs.writeFileSync(rawPath, JSON.stringify(rawTweet, null, 2));
    }

    return NextResponse.json({ ok: true, tweet_id });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
