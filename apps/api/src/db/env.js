import { fileURLToPath } from "node:url";
import { createDb } from "./client.js";

export const PGLITE_DIR = fileURLToPath(new URL("../../.datos/pglite", import.meta.url));

export function getDatabaseUrl() {
  return process.env.DATABASE_URL?.trim() || null;
}

export async function createDbFromEnv({ log = console.warn } = {}) {
  const url = getDatabaseUrl();
  if (url) return createDb({ url });
  log(
    `Sin DATABASE_URL: uso PGlite en ${PGLITE_DIR}. ` +
      "Para PostgreSQL real, inicia el contenedor (wslc start panal-db) y define DATABASE_URL.",
  );
  return createDb({ dataDir: PGLITE_DIR });
}
