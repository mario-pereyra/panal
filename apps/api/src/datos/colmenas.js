import { asignacionesDe } from "./base.js";

/**
 * Consultas de colmenas, integrantes e invitaciones.
 *
 * @typedef {import("./base.js").Consultor} Consultor
 *
 * @typedef {object} FilaDeColmena
 * @property {string} id
 * @property {string} nombre
 * @property {string | null} descripcion
 * @property {string} fundadora_id
 * @property {string | null} entrega_el
 * @property {Date} creada_en
 * @property {Date | null} cerrada_en
 * @property {Date | null} archivada_en
 *
 * @typedef {object} FilaDeIntegrante
 * @property {string} colmena_id
 * @property {string} id Identificador de la persona.
 * @property {string} nombre
 * @property {number} color
 * @property {Date} unida_en
 */

/** Colores de la paleta de abejas. */
export const COLORES_DE_ABEJA = 6;

const COLUMNAS =
  "c.id, c.nombre, c.descripcion, c.fundadora_id, c.entrega_el, c.creada_en, c.cerrada_en, c.archivada_en";

/**
 * @param {Consultor} db
 * @param {string} id
 * @returns {Promise<FilaDeColmena | undefined>}
 */
export async function colmenaPorId(db, id) {
  const [fila] = await db.consulta(`select ${COLUMNAS} from colmenas c where c.id = $1`, [id]);
  return fila;
}

/**
 * Las colmenas en las que una persona sigue dentro, de la más nueva a la más vieja.
 * @param {Consultor} db
 * @param {string} personaId
 * @returns {Promise<FilaDeColmena[]>}
 */
export async function colmenasDePersona(db, personaId) {
  return db.consulta(
    `select ${COLUMNAS}
     from colmenas c join integrantes i on i.colmena_id = c.id
     where i.persona_id = $1 and i.salio_en is null
     order by c.creada_en desc, c.id`,
    [personaId],
  );
}

/**
 * Si una persona sigue dentro de una colmena.
 * @param {Consultor} db
 * @param {string} colmenaId
 * @param {string} personaId
 */
export async function esIntegrante(db, colmenaId, personaId) {
  const filas = await db.consulta(
    "select 1 from integrantes where colmena_id = $1 and persona_id = $2 and salio_en is null",
    [colmenaId, personaId],
  );
  return filas.length > 0;
}

/**
 * Quienes siguen dentro de unas colmenas, por orden de llegada.
 * @param {Consultor} db
 * @param {string[]} colmenaIds
 * @returns {Promise<FilaDeIntegrante[]>}
 */
export async function integrantesDe(db, colmenaIds) {
  if (colmenaIds.length === 0) return [];
  return db.consulta(
    `select i.colmena_id, p.id, p.nombre, i.color, i.unida_en
     from integrantes i join personas p on p.id = i.persona_id
     where i.colmena_id = any($1::uuid[]) and i.salio_en is null
     order by i.unida_en, p.id`,
    [colmenaIds],
  );
}

/**
 * Una celda por actividad activa de cada colmena, en orden de creación, con quién la llenó.
 * @param {Consultor} db
 * @param {string[]} colmenaIds
 * @returns {Promise<Array<{ colmena_id: string, actividad_id: string, asignada_a: string | null, llena_por: string | null, llenada_en: Date | null }>>}
 */
export async function celdasDeColmenas(db, colmenaIds) {
  if (colmenaIds.length === 0) return [];
  return db.consulta(
    `select a.colmena_id, a.id as actividad_id, a.asignada_a,
            celda.persona_id as llena_por, celda.llenada_en
     from actividades a
     left join lateral (
       select cl.persona_id, cl.llenada_en from celdas_llenas cl
       where cl.actividad_id = a.id order by cl.llenada_en limit 1
     ) as celda on true
     where a.colmena_id = any($1::uuid[]) and a.archivada_en is null
     order by a.creada_en, a.id`,
    [colmenaIds],
  );
}

/**
 * Lo que el motor necesita de las colmenas de una persona: todas en las que
 * estuvo, aunque haya salido, para no quitarle los bonos que ya ganó.
 * @param {Consultor} db
 * @param {string} personaId
 * @returns {Promise<Array<{ id: string, nombre: string, fundadora_id: string, unidas: number, total: number }>>}
 */
export async function colmenasParaProgreso(db, personaId) {
  return db.consulta(
    `select c.id, c.nombre, c.fundadora_id,
            (select count(*)::int from integrantes otra
             where otra.colmena_id = c.id and otra.persona_id <> c.fundadora_id) as unidas,
            (select count(*)::int from actividades a
             where a.colmena_id = c.id and a.archivada_en is null) as total
     from colmenas c join integrantes i on i.colmena_id = c.id
     where i.persona_id = $1
     order by c.creada_en, c.id`,
    [personaId],
  );
}

/**
 * Las celdas llenas, de quien sea, de las actividades activas de esas mismas colmenas.
 * @param {Consultor} db
 * @param {string} personaId
 * @returns {Promise<Array<{ colmena_id: string, persona_id: string, dia: string, llenada_en: Date }>>}
 */
export async function llenasDeColmenasDe(db, personaId) {
  return db.consulta(
    `select a.colmena_id, cl.persona_id, cl.dia, cl.llenada_en
     from celdas_llenas cl
     join actividades a on a.id = cl.actividad_id and a.archivada_en is null
     join integrantes i on i.colmena_id = a.colmena_id and i.persona_id = $1
     order by cl.llenada_en, cl.id`,
    [personaId],
  );
}

/**
 * Las celdas de unas colmenas llenas en un periodo, por persona.
 * @param {Consultor} db
 * @param {string[]} colmenaIds
 * @param {string} desde
 * @param {string} hasta
 * @returns {Promise<Array<{ colmena_id: string, persona_id: string, celdas: number }>>}
 */
export async function aportesEnPeriodo(db, colmenaIds, desde, hasta) {
  if (colmenaIds.length === 0) return [];
  return db.consulta(
    `select a.colmena_id, cl.persona_id, count(*)::int as celdas
     from celdas_llenas cl
     join actividades a on a.id = cl.actividad_id and a.archivada_en is null
     where a.colmena_id = any($1::uuid[]) and cl.dia between $2 and $3
     group by a.colmena_id, cl.persona_id`,
    [colmenaIds, desde, hasta],
  );
}

/**
 * @param {Consultor} db
 * @param {{ id: string, nombre: string, descripcion: string | null, fundadoraId: string, entregaEl: string | null, creadaEn: string }} colmena
 */
export async function crearColmena(
  db,
  { id, nombre, descripcion, fundadoraId, entregaEl, creadaEn },
) {
  await db.consulta(
    `insert into colmenas (id, nombre, descripcion, fundadora_id, entrega_el, creada_en)
     values ($1, $2, $3, $4, $5, $6)`,
    [id, nombre, descripcion, fundadoraId, entregaEl, creadaEn],
  );
}

/** Columnas que se pueden cambiar de una colmena. Los nombres son fijos: nunca vienen de la petición. */
const COLUMNAS_EDITABLES = ["nombre", "descripcion", "entrega_el", "archivada_en", "cerrada_en"];

/**
 * @param {Consultor} db
 * @param {string} id
 * @param {Partial<Record<(typeof COLUMNAS_EDITABLES)[number], unknown>>} cambios
 */
export async function actualizarColmena(db, id, cambios) {
  const cambio = asignacionesDe(COLUMNAS_EDITABLES, cambios);
  if (!cambio) return;
  await db.consulta(`update colmenas set ${cambio.asignaciones} where id = $1`, [
    id,
    ...cambio.valores,
  ]);
}

/**
 * Suma a una persona a una colmena, o la devuelve si había salido, con el menor
 * color libre entre quienes siguen dentro.
 * @param {Consultor} db
 * @param {string} colmenaId
 * @param {string} personaId
 * @param {string} ahora
 */
export async function sumarIntegrante(db, colmenaId, personaId, ahora) {
  const ocupados = await db.consulta(
    "select color from integrantes where colmena_id = $1 and salio_en is null and persona_id <> $2",
    [colmenaId, personaId],
  );
  const usados = new Set(ocupados.map((fila) => fila.color));
  const libre = Array.from({ length: COLORES_DE_ABEJA }, (_, color) => color).find(
    (color) => !usados.has(color),
  );
  // Con seis abejas o más la paleta da la vuelta.
  const color = libre ?? ocupados.length % COLORES_DE_ABEJA;
  await db.consulta(
    `insert into integrantes (colmena_id, persona_id, color, unida_en) values ($1, $2, $3, $4)
     on conflict (colmena_id, persona_id) do update set color = $3, unida_en = $4, salio_en = null`,
    [colmenaId, personaId, color, ahora],
  );
}

/**
 * @param {Consultor} db
 * @param {string} colmenaId
 * @param {string} personaId
 * @param {string} ahora
 */
export async function sacarIntegrante(db, colmenaId, personaId, ahora) {
  await db.consulta(
    "update integrantes set salio_en = $3 where colmena_id = $1 and persona_id = $2 and salio_en is null",
    [colmenaId, personaId, ahora],
  );
}

// Invitaciones

/**
 * La invitación vigente de una colmena.
 * @param {Consultor} db
 * @param {string} colmenaId
 * @param {string} ahora
 * @returns {Promise<{ codigo: string, vence_en: Date } | undefined>}
 */
export async function invitacionVigente(db, colmenaId, ahora) {
  const [fila] = await db.consulta(
    `select codigo, vence_en from invitaciones
     where colmena_id = $1 and anulada_en is null and vence_en > $2
     order by creada_en desc limit 1`,
    [colmenaId, ahora],
  );
  return fila;
}

/**
 * Anula las invitaciones abiertas de la colmena y crea una nueva.
 * @param {Consultor} db
 * @param {{ codigo: string, colmenaId: string, creadaPor: string, creadaEn: string, venceEn: string }} invitacion
 */
export async function crearInvitacion(db, { codigo, colmenaId, creadaPor, creadaEn, venceEn }) {
  await db.consulta(
    "update invitaciones set anulada_en = $2 where colmena_id = $1 and anulada_en is null",
    [colmenaId, creadaEn],
  );
  await db.consulta(
    `insert into invitaciones (codigo, colmena_id, creada_por, creada_en, vence_en)
     values ($1, $2, $3, $4, $5)`,
    [codigo, colmenaId, creadaPor, creadaEn, venceEn],
  );
}

/**
 * Una invitación con lo que muestra la pantalla "Unirme": la colmena, cuántas
 * abejas tiene y quién invita.
 * @param {Consultor} db
 * @param {string} codigo
 * @returns {Promise<{ codigo: string, colmena_id: string, colmena_nombre: string, colmena_archivada_en: Date | null,
 *   abejas: number, invita: string, vence_en: Date, anulada_en: Date | null } | undefined>}
 */
export async function invitacionPorCodigo(db, codigo) {
  const [fila] = await db.consulta(
    `select inv.codigo, inv.colmena_id, c.nombre as colmena_nombre, c.archivada_en as colmena_archivada_en,
            (select count(*)::int from integrantes i
             where i.colmena_id = c.id and i.salio_en is null) as abejas,
            p.nombre as invita, inv.vence_en, inv.anulada_en
     from invitaciones inv
     join colmenas c on c.id = inv.colmena_id
     join personas p on p.id = inv.creada_por
     where inv.codigo = $1`,
    [codigo],
  );
  return fila;
}
