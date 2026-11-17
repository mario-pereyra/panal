import { mkdir } from "node:fs/promises";
import pg from "pg";

/**
 * La base de datos de Panal detrás de una interfaz pequeña, igual para los dos motores:
 *
 * - PostgreSQL real con `pg`, cuando hay una dirección (el contenedor local o Neon).
 * - PGlite, PostgreSQL compilado para correr dentro de Node: en memoria para las
 *   pruebas, o en una carpeta para desarrollar sin contenedor.
 *
 * Las fechas de día (`date`) vuelven como texto AAAA-MM-DD, sin pasar por la
 * zona horaria del proceso. Los instantes (`timestamptz`) vuelven como `Date`.
 *
 * @typedef {object} Consultor
 * @property {(texto: string, parametros?: unknown[]) => Promise<any[]>} consulta
 *   Una sentencia con parámetros `$1, $2…`. Devuelve las filas.
 * @property {(texto: string) => Promise<void>} ejecutar
 *   Varias sentencias sin parámetros, como una migración.
 *
 * @typedef {Consultor & {
 *   motor: "postgres" | "pglite",
 *   transaccion: <T>(trabajo: (tx: Consultor) => Promise<T>) => Promise<T>,
 *   cerrar: () => Promise<void>,
 * }} Base
 */

/** Código de tipo de PostgreSQL para `date`. */
const TIPO_DATE = 1082;

/**
 * @param {{ url?: string, directorio?: string }} [opciones]
 *   Con `url`, PostgreSQL real. Sin ella, PGlite: persistente en `directorio`
 *   o, si tampoco hay directorio, en memoria.
 * @returns {Promise<Base>}
 */
export async function crearBase({ url, directorio } = {}) {
  return url ? crearPostgres(url) : crearPglite(directorio);
}

/**
 * @param {string} url
 * @returns {Promise<Base>}
 */
async function crearPostgres(url) {
  const pool = new pg.Pool({
    // Neon entrega `sslmode=require`. En `pg` eso ya verifica el certificado,
    // como `verify-full`, pero avisa en cada arranque que cambiará: se pide
    // `verify-full` explícito, que es lo que ocurre hoy y lo que se quiere.
    connectionString: url.replace(/([?&]sslmode=)require\b/, "$1verify-full"),
    max: 10,
    types: {
      getTypeParser: (tipo, formato) =>
        tipo === TIPO_DATE ? (texto) => texto : pg.types.getTypeParser(tipo, formato),
    },
  });
  // Una conexión inactiva que falla no debe tumbar el proceso.
  pool.on("error", (error) =>
    console.error("Error en una conexión inactiva de PostgreSQL:", error),
  );
  await pool.query("select 1");

  /** @param {pg.Pool | pg.PoolClient} cliente @returns {Consultor} */
  const consultor = (cliente) => ({
    consulta: async (texto, parametros = []) => (await cliente.query(texto, parametros)).rows,
    ejecutar: async (texto) => {
      await cliente.query(texto);
    },
  });

  return {
    motor: "postgres",
    ...consultor(pool),
    async transaccion(trabajo) {
      const cliente = await pool.connect();
      try {
        await cliente.query("begin");
        const resultado = await trabajo(consultor(cliente));
        await cliente.query("commit");
        return resultado;
      } catch (error) {
        await cliente.query("rollback");
        throw error;
      } finally {
        cliente.release();
      }
    },
    cerrar: () => pool.end(),
  };
}

/**
 * @param {string} [directorio]
 * @returns {Promise<Base>}
 */
async function crearPglite(directorio) {
  // Se carga solo aquí: desplegado con DATABASE_URL, PGlite ni se lee.
  const { PGlite, types: tiposPglite } = await import("@electric-sql/pglite");
  if (directorio) await mkdir(directorio, { recursive: true });
  const db = new PGlite({
    dataDir: directorio,
    parsers: { [tiposPglite.DATE]: (texto) => texto },
  });
  await db.waitReady;

  /** @param {Pick<import("@electric-sql/pglite").PGlite, "query" | "exec">} conexion @returns {Consultor} */
  const consultor = (conexion) => ({
    consulta: async (texto, parametros = []) => (await conexion.query(texto, parametros)).rows,
    ejecutar: async (texto) => {
      await conexion.exec(texto);
    },
  });

  return {
    motor: "pglite",
    ...consultor(db),
    // PGlite atiende una sola conexión: mientras dura la transacción, el resto espera.
    // Por eso todo lo de adentro tiene que usar `tx`, nunca la base.
    transaccion: (trabajo) => db.transaction((tx) => trabajo(consultor(tx))),
    cerrar: () => db.close(),
  };
}

/**
 * Si un error de la base es una restricción única violada.
 * @param {unknown} error
 * @param {string} [restriccion] Nombre de la restricción, si importa cuál.
 */
export function esDuplicado(error, restriccion) {
  const { code, constraint } = /** @type {{ code?: string, constraint?: string }} */ (error ?? {});
  return code === "23505" && (!restriccion || constraint === restriccion);
}

/**
 * La parte `set` de un `update` con solo las columnas que cambian. Los nombres
 * salen de una lista fija del archivo de datos, nunca de la petición; los
 * valores van como parámetros desde `$2` (el `$1` es el identificador).
 *
 * @param {readonly string[]} editables Columnas que se pueden cambiar.
 * @param {Record<string, unknown>} cambios
 * @returns {{ asignaciones: string, valores: unknown[] } | null} Nulo si no cambia nada.
 */
export function asignacionesDe(editables, cambios) {
  const columnas = editables.filter((columna) => columna in cambios);
  if (columnas.length === 0) return null;
  return {
    asignaciones: columnas.map((columna, indice) => `${columna} = $${indice + 2}`).join(", "),
    valores: columnas.map((columna) => cambios[columna]),
  };
}
