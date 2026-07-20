import fs from "fs";
import path from "path";

const ROOT           = process.cwd();
const MANIFEST_PATH  = path.join(ROOT, "data", "media-manifest.json");

interface MediaManifest {
  hero: string[];
  podcast: string[];
}

let cachedManifest: MediaManifest | null = null;
function loadManifest(): MediaManifest {
  if (cachedManifest) return cachedManifest;
  try {
    cachedManifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  } catch {
    cachedManifest = { hero: [], podcast: [] };
  }
  return cachedManifest!;
}

/**
 * Resolves hero image / podcast audio URLs for a course.
 *
 * Local dev/prod: falls back to checking the actual file under public/ (works
 * without any R2 setup, matches pre-R2 behavior).
 * Hosted (Vercel): public/course-assets and public/course-audio are
 * git-ignored and don't exist in the deployment, so this reads
 * data/media-manifest.json (committed, written by
 * `npm run upload:media`) instead — if a topic/course pair is listed there,
 * the URL points at R2_PUBLIC_URL_BASE.
 */
export function getCourseMediaUrls(topic: string, course: string): { heroUrl: string | null; podcastUrl: string | null } {
  const key = `${topic}/${course}`;
  const r2Base = (process.env.R2_PUBLIC_URL_BASE || "").replace(/\/$/, "");

  const localHeroPath    = path.join(ROOT, "public", "course-assets", topic, `${course}-hero.jpg`);
  const localPodcastPath = path.join(ROOT, "public", "course-audio", topic, `${course}-podcast.mp3`);
  const hasLocalHero     = fs.existsSync(localHeroPath);
  const hasLocalPodcast  = fs.existsSync(localPodcastPath);

  let heroUrl: string | null = hasLocalHero ? `/course-assets/${topic}/${course}-hero.jpg` : null;
  let podcastUrl: string | null = hasLocalPodcast ? `/course-audio/${topic}/${course}-podcast.mp3` : null;

  // Manifest + R2 take priority when local files aren't present (the hosted
  // case) — if both exist somehow, prefer local (dev machine, avoids a
  // network round-trip).
  if (!heroUrl && r2Base) {
    const manifest = loadManifest();
    if (manifest.hero.includes(key)) {
      heroUrl = `${r2Base}/course-assets/${topic}/${course}-hero.jpg`;
    }
  }
  if (!podcastUrl && r2Base) {
    const manifest = loadManifest();
    if (manifest.podcast.includes(key)) {
      podcastUrl = `${r2Base}/course-audio/${topic}/${course}-podcast.mp3`;
    }
  }

  return { heroUrl, podcastUrl };
}
