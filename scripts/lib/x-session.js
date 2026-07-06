"use strict";

/**
 * scripts/lib/x-session.js
 *
 * Shared helper for reasoning about the saved X (Twitter) login session.
 *
 * The importer (import-x-likes.js) stores a Playwright storageState JSON at
 * X_STORAGE_STATE_PATH (default ./data/private/x-storage-state.json). That
 * session expires — X rotates auth_token / ct0 — and when it does the daily
 * pipeline's import step fails with "X session is not logged in".
 *
 * This module inspects that file and reports its health so callers can WARN
 * before the session dies (pipeline pre-flight) and surface status in the UI
 * (admin dashboard). It never throws — a missing/corrupt file is just a status.
 */

const fs   = require("fs");
const path = require("path");

const DAY_MS = 24 * 60 * 60 * 1000;

// How many days before expiry we start warning.
const WARN_WITHIN_DAYS = 5;

/**
 * Resolve the storage-state path the importer uses.
 * @param {string} [root] project root, defaults to process.cwd()
 */
function sessionPath(root = process.cwd()) {
  const configured = process.env.X_STORAGE_STATE_PATH || "./data/private/x-storage-state.json";
  return path.resolve(root, configured);
}

/**
 * Inspect the saved X session.
 *
 * @param {object}  [opts]
 * @param {string}  [opts.root]  project root (defaults to process.cwd())
 * @param {number}  [opts.now]   epoch ms override, for testing
 * @returns {{
 *   exists: boolean,
 *   path: string,
 *   status: 'ok'|'warning'|'expired'|'missing'|'unreadable',
 *   ageDays: number|null,
 *   expiresAt: string|null,        // ISO of auth_token cookie expiry, if known
 *   daysUntilExpiry: number|null,  // negative if already expired
 *   message: string,
 * }}
 */
function getXSessionStatus(opts = {}) {
  const root = opts.root || process.cwd();
  const now  = opts.now || Date.now();
  const p     = sessionPath(root);

  if (!fs.existsSync(p)) {
    return {
      exists: false, path: p, status: "missing",
      ageDays: null, expiresAt: null, daysUntilExpiry: null,
      message: 'No saved X session. Run "npm run import:x-login" to create one.',
    };
  }

  let stat, raw;
  try {
    stat = fs.statSync(p);
    raw  = JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (err) {
    return {
      exists: true, path: p, status: "unreadable",
      ageDays: null, expiresAt: null, daysUntilExpiry: null,
      message: `X session file could not be read: ${err.message}`,
    };
  }

  const ageDays = Math.floor((now - stat.mtimeMs) / DAY_MS);

  // Prefer the real auth_token cookie expiry; fall back to mtime + 30d heuristic
  // (matches the 30-day expiry the --set-cookies path hardcodes).
  const cookies   = Array.isArray(raw.cookies) ? raw.cookies : [];
  const authToken = cookies.find((c) => c && c.name === "auth_token");
  let expiresMs = null;
  if (authToken && typeof authToken.expires === "number" && authToken.expires > 0) {
    expiresMs = authToken.expires * 1000; // Playwright stores seconds
  } else {
    expiresMs = stat.mtimeMs + 30 * DAY_MS;
  }

  const daysUntilExpiry = Math.floor((expiresMs - now) / DAY_MS);
  const expiresAt = new Date(expiresMs).toISOString();

  let status, message;
  if (daysUntilExpiry < 0) {
    status  = "expired";
    message = `X session expired ${Math.abs(daysUntilExpiry)} day(s) ago. Run "npm run import:x-login" to renew.`;
  } else if (daysUntilExpiry <= WARN_WITHIN_DAYS) {
    status  = "warning";
    message = `X session expires in ${daysUntilExpiry} day(s). Renew soon with "npm run import:x-login".`;
  } else {
    status  = "ok";
    message = `X session healthy — expires in ${daysUntilExpiry} day(s).`;
  }

  return { exists: true, path: p, status, ageDays, expiresAt, daysUntilExpiry, message };
}

module.exports = { getXSessionStatus, sessionPath, WARN_WITHIN_DAYS };
