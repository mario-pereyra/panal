import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { baseDelEntorno } from "./entorno.js";

/**
 * Migraciones: los archivos `migraciones/NNN_nombre.sql`, aplicados en orden.
 * Cada una corre en su propia transacción y queda anotada en la tabla
 * `migraciones`, así que volver a ejecutar el script no repite nada.
 */

export const CARPETA_DE_MIGRACIONES = fileURLToPath(new URL("../../migraciones/", import.meta.url));

/**
 * @param {import("./base.js").Base} base
 * @param {{ carpeta?: string, avisar?: (mensaje: string) => void }} [opciones]
 * @returns {Promise<string[]>} Las migraciones que se aplicaron ahora.
 */
export async function aplicarMigraciones(base, { carpeta = CARPETA_DE_MIGRACIONES, avisar } = {}) {
  await base.ejecutar(`
    create table if not exists migraciones (
      nombre text primary key,
      aplicada_en timestamptz not null default now()
    )
  `);
  const filas = await base.consulta("select nombre from migraciones");
  const aplicadas = new Set(filas.map((fila) => fila.nombre));
  const archivos = (await readdir(carpeta))
    .filter((nombre) => /^\d{3}_.+\.sql$/.test(nombre))
    .sort();

  const nuevas = [];
  for (const archivo of archivos.filter((nombre) => !aplicadas.has(nombre))) {
    const texto = await readFile(join(carpeta, archivo), "utf8");
    await base.transaccion(async (tx) => {
      await tx.ejecutar(texto);
      await tx.consulta("insert into migraciones (nombre) values ($1)", [archivo]);
    });
    avisar?.(`Migración aplicada: ${archivo}`);
    nuevas.push(archivo);
  }
  return nuevas;
}

if (import.meta.main) {
  const base = await baseDelEntorno();
  try {
    const nuevas = await aplicarMigraciones(base, { avisar: console.log });
    if (nuevas.length === 0) console.log("La base ya estaba al día.");
  } finally {
    await base.cerrar();
  }
}
