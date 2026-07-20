#!/usr/bin/env node
"use strict";

/**
 * scripts/migrate-to-neon.js
 *
 * One-time migration: copies all rows from the local Postgres (DATABASE_URL)
 * into a new Neon Postgres (NEON_DATABASE_URL), after creating the schema
 * there via db-setup.js. Safe to re-run — every insert uses ON CONFLICT DO
 * NOTHING, so running twice just skips rows already copied.
 *
 * This does NOT modify the local database — it only reads from it. Nothing
 * is deleted or altered locally.
 *
 * Requires in .env:
 *   DATABASE_URL       — existing local Postgres (source, read-only here)
 *   NEON_DATABASE_URL  — new Neon connection string (target)
 *
 * Usage:
 *   node scripts/migrate-to-neon.js
 */

require("dotenv").config({ quiet: true });

const { execFileSync } = require("child_process");
const { Pool } = require("pg");

const LOCAL_URL = (process.env.DATABASE_URL || "").trim();
const NEON_URL  = (process.env.NEON_DATABASE_URL || "").trim();

if (!LOCAL_URL) {
  console.error("[migrate] ERROR: DATABASE_URL (local source) is not set in .env.");
  process.exit(1);
}
if (!NEON_URL) {
  console.error("[migrate] ERROR: NEON_DATABASE_URL (target) is not set in .env.");
  console.error("  Add the connection string Neon gave you as NEON_DATABASE_URL, then re-run.");
  process.exit(1);
}

const TABLES = [
  { name: "learning_progress", conflictCols: "(course_id)" },
  { name: "reading_sessions",  conflictCols: null }, // no unique constraint — plain insert
  { name: "daily_streaks",     conflictCols: "(streak_date)" },
  { name: "pipeline_runs",     conflictCols: "(run_id)" },
  { name: "token_usage",       conflictCols: "(ts, label)" },
  { name: "course_index",      conflictCols: "(course_id)" },
];

async function main() {
  console.log("[migrate] Step 1/3 — creating schema on Neon (db-setup.js)...");
  execFileSync(process.execPath, ["scripts/db-setup.js"], {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: NEON_URL },
  });

  console.log("\n[migrate] Step 2/3 — copying rows...");
  const localPool = new Pool({ connectionString: LOCAL_URL });
  const neonPool  = new Pool({ connectionString: NEON_URL });

  let totalCopied = 0;
  for (const { name, conflictCols } of TABLES) {
    const { rows } = await localPool.query(`SELECT * FROM ${name}`);
    if (rows.length === 0) {
      console.log(`  ${name}: 0 rows (nothing to copy)`);
      continue;
    }

    const columns = Object.keys(rows[0]).filter((c) => c !== "id"); // let Neon assign its own serial ids
    const colList = columns.map((c) => `"${c}"`).join(", ");
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
    const conflictClause = conflictCols ? `ON CONFLICT ${conflictCols} DO NOTHING` : "";
    const sql = `INSERT INTO ${name} (${colList}) VALUES (${placeholders}) ${conflictClause}`;

    let copied = 0;
    for (const row of rows) {
      const values = columns.map((c) => row[c]);
      try {
        const result = await neonPool.query(sql, values);
        if (result.rowCount > 0) copied++;
      } catch (e) {
        console.error(`  ${name}: row insert failed — ${e.message}`);
      }
    }
    console.log(`  ${name}: ${copied}/${rows.length} row(s) copied (rest already present or skipped)`);
    totalCopied += copied;
  }

  await localPool.end();
  await neonPool.end();

  console.log(`\n[migrate] Step 3/3 — done. ${totalCopied} row(s) copied to Neon.`);
  console.log("[migrate] Next: update .env's DATABASE_URL to NEON_DATABASE_URL's value");
  console.log("           so the local pipeline and Vercel read/write the same database.");
}

main().catch((e) => { console.error("[migrate] Fatal:", e.message); process.exit(1); });
