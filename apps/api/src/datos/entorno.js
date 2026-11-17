import { fileURLToPath } from "node:url";
import { crearBase } from "./base.js";

/**
 * Qué base usar según el entorno, con una sola variable: `DATABASE_URL`.
 *
 * - Con valor: PostgreSQL real (el contenedor `panal-db` en local, Neon desplegado).
 * - Vacía: PGlite persistente en `apps/api/.datos/pglite`, para desarrollar sin
 *   contenedor. Esa carpeta no se sube al repositorio.
 */

export const CARPETA_PGLITE = fileURLToPath(new URL("../../.datos/pglite", import.meta.url));

/**
 * @param {{ avisar?: (mensaje: string) => void }} [opciones]
 * @returns {Promise<import("./base.js").Base>}
 */
export async function baseDelEntorno({ avisar = console.warn } = {}) {
  const url = process.env.DATABASE_URL?.trim();
  if (url) return crearBase({ url });
  avisar(
    `Sin DATABASE_URL: uso PGlite en ${CARPETA_PGLITE}. ` +
      "Para PostgreSQL real, inicia el contenedor (wslc start panal-db) y define DATABASE_URL.",
  );
  return crearBase({ directorio: CARPETA_PGLITE });
}
