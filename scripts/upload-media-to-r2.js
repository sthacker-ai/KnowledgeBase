#!/usr/bin/env node
"use strict";

/**
 * scripts/upload-media-to-r2.js
 *
 * Uploads hero images (public/course-assets/) and podcast audio
 * (public/course-audio/) to Cloudflare R2, since both are .gitignore'd and
 * never reach the deployed Vercel bundle. Writes data/media-manifest.json
 * (committed to git) listing which topic/course pairs have media uploaded,
 * so the course page can decide whether to render an <img>/<audio> tag at
 * build time without a network existence-check per page.
 *
 * Idempotent: only uploads files not already listed in the manifest, safe
 * to run after every pipeline run (new courses only).
 *
 * Requires in .env:
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME,
 *   R2_PUBLIC_URL_BASE (e.g. https://pub-xxxx.r2.dev or a custom domain)
 *
 * Usage:
 *   node scripts/upload-media-to-r2.js            # upload everything new
 *   node scripts/upload-media-to-r2.js --dry-run   # list what would upload
 */

require("dotenv").config({ quiet: true });

const fs   = require("fs");
const path = require("path");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const ROOT           = process.cwd();
const ASSETS_DIR      = path.join(ROOT, "public", "course-assets");
const AUDIO_DIR       = path.join(ROOT, "public", "course-audio");
const MANIFEST_PATH   = path.join(ROOT, "data", "media-manifest.json");
const DRY_RUN         = process.argv.includes("--dry-run");

function requireEnv(name) {
  const v = (process.env[name] || "").trim();
  if (!v) {
    console.error(`[r2] Missing required env var: ${name}. See .env.example.`);
    process.exit(1);
  }
  return v;
}

function loadManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  } catch {
    return { hero: [], podcast: [] };
  }
}

function saveManifest(manifest) {
  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  manifest.hero    = [...new Set(manifest.hero)].sort();
  manifest.podcast = [...new Set(manifest.podcast)].sort();
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
}

// Walk public/course-assets/<topic>/<course>-hero.jpg
function findHeroFiles() {
  const out = [];
  if (!fs.existsSync(ASSETS_DIR)) return out;
  for (const topic of fs.readdirSync(ASSETS_DIR)) {
    const topicDir = path.join(ASSETS_DIR, topic);
    if (!fs.statSync(topicDir).isDirectory()) continue;
    for (const f of fs.readdirSync(topicDir)) {
      const m = f.match(/^(course-\d+)-hero\.jpg$/);
      if (m) out.push({ key: `${topic}/${m[1]}`, file: path.join(topicDir, f), r2Path: `course-assets/${topic}/${f}`, contentType: "image/jpeg" });
    }
  }
  return out;
}

// Walk public/course-audio/<topic>/<course>-podcast.mp3
function findPodcastFiles() {
  const out = [];
  if (!fs.existsSync(AUDIO_DIR)) return out;
  for (const topic of fs.readdirSync(AUDIO_DIR)) {
    const topicDir = path.join(AUDIO_DIR, topic);
    if (!fs.statSync(topicDir).isDirectory()) continue;
    for (const f of fs.readdirSync(topicDir)) {
      const m = f.match(/^(course-\d+)-podcast\.mp3$/);
      if (m) out.push({ key: `${topic}/${m[1]}`, file: path.join(topicDir, f), r2Path: `course-audio/${topic}/${f}`, contentType: "audio/mpeg" });
    }
  }
  return out;
}

async function main() {
  const accountId = requireEnv("R2_ACCOUNT_ID");
  const accessKey = requireEnv("R2_ACCESS_KEY_ID");
  const secretKey = requireEnv("R2_SECRET_ACCESS_KEY");
  const bucket    = requireEnv("R2_BUCKET_NAME");

  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
  });

  const manifest = loadManifest();
  const heroSeen    = new Set(manifest.hero);
  const podcastSeen = new Set(manifest.podcast);

  const heroFiles    = findHeroFiles().filter((f) => !heroSeen.has(f.key));
  const podcastFiles = findPodcastFiles().filter((f) => !podcastSeen.has(f.key));

  console.log(`[r2] Found ${heroFiles.length} new hero image(s), ${podcastFiles.length} new podcast(s) to upload.`);
  if (DRY_RUN) {
    heroFiles.forEach((f) => console.log(`  [dry-run] would upload ${f.r2Path}`));
    podcastFiles.forEach((f) => console.log(`  [dry-run] would upload ${f.r2Path}`));
    return;
  }

  let uploaded = 0, errors = 0;
  for (const f of [...heroFiles, ...podcastFiles]) {
    try {
      const body = fs.readFileSync(f.file);
      await s3.send(new PutObjectCommand({
        Bucket: bucket,
        Key: f.r2Path,
        Body: body,
        ContentType: f.contentType,
      }));
      const isHero = f.r2Path.startsWith("course-assets/");
      (isHero ? manifest.hero : manifest.podcast).push(f.key);
      console.log(`  ✓ ${f.r2Path} (${(body.length / 1024).toFixed(0)} KB)`);
      uploaded++;
    } catch (e) {
      console.error(`  ✗ ${f.r2Path} — ${e.message}`);
      errors++;
    }
  }

  saveManifest(manifest);
  console.log(`[r2] Done. ${uploaded} uploaded, ${errors} error(s). Manifest saved to ${MANIFEST_PATH}`);
}

main().catch((e) => { console.error("[r2] Fatal:", e.message); process.exit(1); });
