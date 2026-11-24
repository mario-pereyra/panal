import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createDbFromEnv } from "./env.js";

export const MIGRATIONS_DIR = fileURLToPath(new URL("../../migraciones/", import.meta.url));

export async function runMigrations(db, { dir = MIGRATIONS_DIR, log } = {}) {
  await db.exec(`
    create table if not exists migraciones (
      nombre text primary key,
      aplicada_en timestamptz not null default now()
    )
  `);
  const rows = await db.query("select nombre from migraciones");
  const applied = new Set(rows.map((row) => row.nombre));
  const files = (await readdir(dir)).filter((name) => /^\d{3}_.+\.sql$/.test(name)).sort();

  const newlyApplied = [];
  for (const file of files.filter((name) => !applied.has(name))) {
    const sql = await readFile(join(dir, file), "utf8");
    await db.transaction(async (tx) => {
      await tx.exec(sql);
      await tx.query("insert into migraciones (nombre) values ($1)", [file]);
    });
    log?.(`Migración aplicada: ${file}`);
    newlyApplied.push(file);
  }
  return newlyApplied;
}

if (import.meta.main) {
  const db = await createDbFromEnv();
  try {
    const applied = await runMigrations(db, { log: console.log });
    if (applied.length === 0) console.log("La base ya estaba al día.");
  } finally {
    await db.close();
  }
}
