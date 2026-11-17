import { asignacionesDe } from "./base.js";

/**
 * Consultas de personas, sesiones e intentos de entrada.
 * Cada función recibe la base (o la transacción) como primer argumento.
 *
 * @typedef {import("./base.js").Consultor} Consultor
 *
 * @typedef {object} FilaDePersona
 * @property {string} id
 * @property {string} nombre
 * @property {string} correo
 * @property {string} clave_hash
 * @property {number} meta_diaria
 * @property {number | null} meta_siguiente
 * @property {string | null} meta_cambia_el
 * @property {string} zona_horaria
 * @property {number | null} dia_sin_flores
 * @property {string | null} invernada_desde
 * @property {string | null} invernada_hasta
 * @property {Date | null} primer_vuelo_en
 * @property {Date} creada_en
 */

const COLUMNAS = [
  "id",
  "nombre",
  "correo",
  "clave_hash",
  "meta_diaria",
  "meta_siguiente",
  "meta_cambia_el",
  "zona_horaria",
  "dia_sin_flores",
  "invernada_desde",
  "invernada_hasta",
  "primer_vuelo_en",
  "creada_en",
];
/** Las columnas de `personas p`, para las consultas que la unen con otra tabla. */
const COLUMNAS_DE_PERSONA = COLUMNAS.map((columna) => `p.${columna}`).join(", ");
const DEVUELVE_PERSONA = `returning ${COLUMNAS.join(", ")}`;

/**
 * @param {Consultor} db
 * @param {string} correo Ya normalizado en minúsculas.
 * @returns {Promise<FilaDePersona | undefined>}
 */
export async function personaPorCorreo(db, correo) {
  const [fila] = await db.consulta(
    `select ${COLUMNAS_DE_PERSONA} from personas p where p.correo = $1`,
    [correo],
  );
  return fila;
}

/**
 * @param {Consultor} db
 * @param {string} id
 * @returns {Promise<FilaDePersona | undefined>}
 */
export async function personaPorId(db, id) {
  const [fila] = await db.consulta(
    `select ${COLUMNAS_DE_PERSONA} from personas p where p.id = $1`,
    [id],
  );
  return fila;
}

/**
 * @param {Consultor} db
 * @param {{ id: string, nombre: string, correo: string, claveHash: string, creadaEn: string, zonaHoraria?: string }} persona
 * @returns {Promise<FilaDePersona>}
 */
export async function crearPersona(db, { id, nombre, correo, claveHash, creadaEn, zonaHoraria }) {
  const [fila] = await db.consulta(
    `insert into personas (id, nombre, correo, clave_hash, creada_en, zona_horaria)
     values ($1, $2, $3, $4, $5, coalesce($6, 'America/La_Paz'))
     ${DEVUELVE_PERSONA}`,
    [id, nombre, correo, claveHash, creadaEn, zonaHoraria ?? null],
  );
  return fila;
}

/** Columnas que se pueden cambiar desde el perfil. Los nombres son fijos: nunca vienen de la petición. */
const COLUMNAS_EDITABLES = [
  "nombre",
  "meta_diaria",
  "meta_siguiente",
  "meta_cambia_el",
  "zona_horaria",
  "dia_sin_flores",
  "invernada_desde",
  "invernada_hasta",
  "primer_vuelo_en",
];

/**
 * Cambia algunas columnas de una persona. Los valores siempre van como parámetros.
 * @param {Consultor} db
 * @param {string} id
 * @param {Partial<Record<(typeof COLUMNAS_EDITABLES)[number], unknown>>} cambios
 * @returns {Promise<FilaDePersona>}
 */
export async function actualizarPersona(db, id, cambios) {
  const cambio = asignacionesDe(COLUMNAS_EDITABLES, cambios);
  if (!cambio) return personaPorId(db, id);
  const [fila] = await db.consulta(
    `update personas set ${cambio.asignaciones} where id = $1
     ${DEVUELVE_PERSONA}`,
    [id, ...cambio.valores],
  );
  return fila;
}

// Tramos de ajustes

/**
 * @typedef {object} FilaDeTramo
 * @property {string} desde Día lógico, AAAA-MM-DD.
 * @property {number} meta_diaria
 * @property {number | null} dia_sin_flores
 */

/**
 * Desde qué día rigió cada meta y día sin flores, del más antiguo al más nuevo.
 * @param {Consultor} db
 * @param {string} personaId
 * @returns {Promise<FilaDeTramo[]>}
 */
export async function tramosDeAjustes(db, personaId) {
  return db.consulta(
    `select desde, meta_diaria, dia_sin_flores from tramos_de_ajustes
     where persona_id = $1 order by desde`,
    [personaId],
  );
}

/**
 * Reemplaza los tramos de un día en adelante. Los anteriores son el pasado y no se tocan.
 * @param {Consultor} db
 * @param {string} personaId
 * @param {string} desde
 * @param {Array<{ desde: string, metaDiaria: number, diaSinFlores: number | null }>} tramos
 */
export async function reemplazarTramosDesde(db, personaId, desde, tramos) {
  await db.consulta("delete from tramos_de_ajustes where persona_id = $1 and desde >= $2", [
    personaId,
    desde,
  ]);
  for (const tramo of tramos) {
    await db.consulta(
      `insert into tramos_de_ajustes (persona_id, desde, meta_diaria, dia_sin_flores)
       values ($1, $2, $3, $4)`,
      [personaId, tramo.desde, tramo.metaDiaria, tramo.diaSinFlores],
    );
  }
}

// Sesiones

/**
 * @param {Consultor} db
 * @param {{ idHash: string, personaId: string, creadaEn: string, venceEn: string }} sesion
 */
export async function crearSesion(db, { idHash, personaId, creadaEn, venceEn }) {
  await db.consulta(
    "insert into sesiones (id_hash, persona_id, creada_en, vence_en) values ($1, $2, $3, $4)",
    [idHash, personaId, creadaEn, venceEn],
  );
}

/**
 * La persona de una sesión vigente.
 * @param {Consultor} db
 * @param {string} idHash
 * @param {string} ahora
 * @returns {Promise<(FilaDePersona & { sesion_vence_en: Date }) | undefined>}
 */
export async function personaDeSesion(db, idHash, ahora) {
  const [fila] = await db.consulta(
    `select ${COLUMNAS_DE_PERSONA}, s.vence_en as sesion_vence_en
     from sesiones s join personas p on p.id = s.persona_id
     where s.id_hash = $1 and s.vence_en > $2`,
    [idHash, ahora],
  );
  return fila;
}

/**
 * @param {Consultor} db
 * @param {string} idHash
 * @param {string} venceEn
 */
export async function renovarSesion(db, idHash, venceEn) {
  await db.consulta("update sesiones set vence_en = $2 where id_hash = $1", [idHash, venceEn]);
}

/**
 * @param {Consultor} db
 * @param {string} idHash
 */
export async function borrarSesion(db, idHash) {
  await db.consulta("delete from sesiones where id_hash = $1", [idHash]);
}

// Intentos de entrada

/**
 * Los fallos más recientes de un correo dentro de la ventana, del más nuevo al más viejo.
 * @param {Consultor} db
 * @param {string} correo
 * @param {string} desde Instante desde el que cuentan.
 * @param {number} limite
 * @returns {Promise<Date[]>}
 */
export async function fallosRecientes(db, correo, desde, limite) {
  const filas = await db.consulta(
    `select fallido_en from intentos_fallidos
     where correo = $1 and fallido_en > $2
     order by fallido_en desc
     limit $3`,
    [correo, desde, limite],
  );
  return filas.map((fila) => fila.fallido_en);
}

/**
 * Anota un fallo y, de paso, borra los que ya no cuentan.
 * @param {Consultor} db
 * @param {string} correo
 * @param {string} ahora
 * @param {string} caducados Instante antes del cual un fallo ya no importa.
 */
export async function anotarFallo(db, correo, ahora, caducados) {
  await db.consulta("delete from intentos_fallidos where fallido_en <= $1", [caducados]);
  await db.consulta("insert into intentos_fallidos (correo, fallido_en) values ($1, $2)", [
    correo,
    ahora,
  ]);
}

/**
 * @param {Consultor} db
 * @param {string} correo
 */
export async function olvidarFallos(db, correo) {
  await db.consulta("delete from intentos_fallidos where correo = $1", [correo]);
}
