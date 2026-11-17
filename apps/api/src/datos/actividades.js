/**
 * Consultas de actividades, sus repeticiones y sus celdas llenas.
 *
 * @typedef {import("./base.js").Consultor} Consultor
 *
 * @typedef {object} FilaDeActividad
 * @property {string} id
 * @property {string} titulo
 * @property {"unica" | "recurrente"} tipo
 * @property {boolean} prioridad_alta
 * @property {string | null} vence_el
 * @property {string | null} colmena_id
 * @property {string | null} colmena_nombre
 * @property {Date | null} colmena_archivada_en
 * @property {string | null} asignada_a
 * @property {string} creada_por
 * @property {Date} creada_en
 * @property {Date | null} archivada_en
 * @property {"diaria" | "dias" | "veces" | "mes" | null} clase
 * @property {number[] | null} dias
 * @property {number | null} veces
 * @property {number | null} dia_mes
 * @property {string | null} primera_llena_el Día de su primera celda llena, de quien sea.
 */

/**
 * Una actividad con su regla, el nombre de su colmena y el día de su primera celda.
 * @param {{ columnas?: string, uniones?: string }} [extra] Columnas y uniones de más, escritas en el código.
 */
function seleccion({ columnas = "", uniones = "" } = {}) {
  return `
    select a.id, a.titulo, a.tipo, a.prioridad_alta, a.vence_el, a.colmena_id,
           c.nombre as colmena_nombre, c.archivada_en as colmena_archivada_en,
           a.asignada_a, a.creada_por, a.creada_en, a.archivada_en,
           r.clase, r.dias, r.veces, r.dia_mes,
           (select min(cl.dia) from celdas_llenas cl where cl.actividad_id = a.id) as primera_llena_el
           ${columnas}
    from actividades a
    left join colmenas c on c.id = a.colmena_id
    left join repeticiones r on r.actividad_id = a.id
    ${uniones}
  `;
}

const ORDEN = "order by a.creada_en, a.id";

/**
 * @param {Consultor} db
 * @param {string} id
 * @returns {Promise<FilaDeActividad | undefined>}
 */
export async function actividadPorId(db, id) {
  const [fila] = await db.consulta(`${seleccion()} where a.id = $1`, [id]);
  return fila;
}

/**
 * Las actividades que el motor necesita para el progreso de una persona: las de
 * su panal (personales y asignadas a ella, también archivadas) y las que llenó
 * sin ser de su panal, como las libres de una colmena. `del_panal` las distingue.
 * @param {Consultor} db
 * @param {string} personaId
 * @returns {Promise<Array<FilaDeActividad & { del_panal: boolean }>>}
 */
export async function actividadesParaProgreso(db, personaId) {
  return db.consulta(
    `${seleccion({
      columnas: `, coalesce((a.colmena_id is null and a.creada_por = $1) or a.asignada_a = $1, false) as del_panal`,
    })}
     where (a.colmena_id is null and a.creada_por = $1)
        or a.asignada_a = $1
        or exists (select 1 from celdas_llenas cl where cl.actividad_id = a.id and cl.persona_id = $1)
     ${ORDEN}`,
    [personaId],
  );
}

/**
 * Las que una persona puede ver en "Celdas": sus personales y todas las de las
 * colmenas en las que sigue. Archivadas o no; la ruta elige la vista.
 * @param {Consultor} db
 * @param {string} personaId
 * @returns {Promise<FilaDeActividad[]>}
 */
export async function actividadesVisibles(db, personaId) {
  return db.consulta(
    `${seleccion()}
     where (a.colmena_id is null and a.creada_por = $1)
        or a.colmena_id in (
          select i.colmena_id from integrantes i where i.persona_id = $1 and i.salio_en is null
        )
     ${ORDEN}`,
    [personaId],
  );
}

/**
 * Las actividades activas de una colmena, en orden de creación, con su celda si está llena.
 * @param {Consultor} db
 * @param {string} colmenaId
 * @returns {Promise<Array<FilaDeActividad & { celda_id: string | null, llena_por: string | null, llenada_el: string | null }>>}
 */
export async function actividadesDeColmena(db, colmenaId) {
  return db.consulta(
    `${seleccion({
      columnas: ", celda.id as celda_id, celda.persona_id as llena_por, celda.dia as llenada_el",
      uniones: `left join lateral (
                  select cl.id, cl.persona_id, cl.dia from celdas_llenas cl
                  where cl.actividad_id = a.id order by cl.llenada_en limit 1
                ) as celda on true`,
    })}
     where a.colmena_id = $1 and a.archivada_en is null
     ${ORDEN}`,
    [colmenaId],
  );
}

/**
 * Crea o reemplaza una actividad con su regla.
 * @param {Consultor} db
 * @param {{ id: string, creadaPor: string, colmenaId: string | null, asignadaA: string | null, titulo: string,
 *   tipo: "unica" | "recurrente", prioridadAlta: boolean, venceEl: string | null, creadaEn: string,
 *   archivadaEn?: string | null, regla: import("@panal/motor").Regla | null }} actividad
 */
export async function guardarActividad(db, actividad) {
  await db.consulta(
    `insert into actividades
       (id, creada_por, colmena_id, asignada_a, titulo, tipo, prioridad_alta, vence_el, creada_en, archivada_en)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     on conflict (id) do update set
       colmena_id = excluded.colmena_id,
       asignada_a = excluded.asignada_a,
       titulo = excluded.titulo,
       tipo = excluded.tipo,
       prioridad_alta = excluded.prioridad_alta,
       vence_el = excluded.vence_el,
       archivada_en = excluded.archivada_en`,
    [
      actividad.id,
      actividad.creadaPor,
      actividad.colmenaId,
      actividad.asignadaA,
      actividad.titulo,
      actividad.tipo,
      actividad.prioridadAlta,
      actividad.venceEl,
      actividad.creadaEn,
      actividad.archivadaEn ?? null,
    ],
  );
  await db.consulta("delete from repeticiones where actividad_id = $1", [actividad.id]);
  const { regla } = actividad;
  if (regla) {
    await db.consulta(
      "insert into repeticiones (actividad_id, clase, dias, veces, dia_mes) values ($1, $2, $3, $4, $5)",
      [
        actividad.id,
        regla.clase,
        regla.clase === "dias" ? regla.dias : null,
        regla.clase === "veces" ? regla.veces : null,
        regla.clase === "mes" ? regla.dia : null,
      ],
    );
  }
}

/**
 * Cuántas únicas de prioridad alta tiene pendientes una persona: activas, sin
 * llenar y en su panal (personales o asignadas a ella en una colmena activa).
 * @param {Consultor} db
 * @param {string} personaId
 * @param {string} excepto La actividad que se está guardando, que no cuenta.
 * @returns {Promise<number>}
 */
export async function altasPendientes(db, personaId, excepto) {
  const [{ cantidad }] = await db.consulta(
    `select count(*)::int as cantidad
     from actividades a
     left join colmenas c on c.id = a.colmena_id
     where a.tipo = 'unica' and a.prioridad_alta and a.archivada_en is null and c.archivada_en is null
       and a.id <> $2
       and ((a.colmena_id is null and a.creada_por = $1) or a.asignada_a = $1)
       and not exists (select 1 from celdas_llenas cl where cl.actividad_id = a.id)`,
    [personaId, excepto],
  );
  return cantidad;
}

/**
 * Al salir de una colmena, sus celdas asignadas que siguen vacías quedan libres.
 * @param {Consultor} db
 * @param {string} colmenaId
 * @param {string} personaId
 */
export async function liberarPendientes(db, colmenaId, personaId) {
  await db.consulta(
    `update actividades a set asignada_a = null
     where a.colmena_id = $1 and a.asignada_a = $2
       and not exists (select 1 from celdas_llenas cl where cl.actividad_id = a.id)`,
    [colmenaId, personaId],
  );
}

// Celdas llenas

/**
 * @typedef {object} FilaDeCelda
 * @property {string} id
 * @property {string} actividad_id
 * @property {string} persona_id
 * @property {string} dia
 * @property {Date} llenada_en
 */

/**
 * @param {Consultor} db
 * @param {string} id
 * @returns {Promise<FilaDeCelda | undefined>}
 */
export async function celdaPorId(db, id) {
  const [fila] = await db.consulta(
    "select id, actividad_id, persona_id, dia, llenada_en from celdas_llenas where id = $1",
    [id],
  );
  return fila;
}

/**
 * Si una actividad ya tiene una celda llena: ese día o, sin día, cualquiera.
 * @param {Consultor} db
 * @param {string} actividadId
 * @param {string | null} dia
 */
export async function yaLlena(db, actividadId, dia) {
  const filas = await db.consulta(
    `select 1 from celdas_llenas where actividad_id = $1 and ($2::date is null or dia = $2::date) limit 1`,
    [actividadId, dia],
  );
  return filas.length > 0;
}

/**
 * @param {Consultor} db
 * @param {{ id: string, actividadId: string, personaId: string, dia: string, llenadaEn: string }} celda
 */
export async function insertarCelda(db, { id, actividadId, personaId, dia, llenadaEn }) {
  await db.consulta(
    "insert into celdas_llenas (id, actividad_id, persona_id, dia, llenada_en) values ($1, $2, $3, $4, $5)",
    [id, actividadId, personaId, dia, llenadaEn],
  );
}

/**
 * @param {Consultor} db
 * @param {string} id
 */
export async function borrarCelda(db, id) {
  await db.consulta("delete from celdas_llenas where id = $1", [id]);
}

/**
 * Todas las celdas que llenó una persona, en el orden en que las llenó.
 * @param {Consultor} db
 * @param {string} personaId
 * @returns {Promise<FilaDeCelda[]>}
 */
export async function celdasDePersona(db, personaId) {
  return db.consulta(
    `select id, actividad_id, persona_id, dia, llenada_en from celdas_llenas
     where persona_id = $1 order by llenada_en, id`,
    [personaId],
  );
}
