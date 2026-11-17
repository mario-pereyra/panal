import { diaLogico } from "@panal/motor";

/**
 * De filas de la base a la forma de las respuestas (`@panal/contratos/respuestas.js`).
 * Los nombres pasan a camelCase, los instantes a ISO 8601 en UTC y los días
 * lógicos se calculan en la zona horaria de quien mira.
 */

/**
 * @param {Date | string | null | undefined} valor
 * @returns {string | null}
 */
export function instante(valor) {
  return valor == null ? null : new Date(valor).toISOString();
}

/**
 * @param {Date | string | number} valor
 * @returns {string} Instante ISO 8601 en UTC.
 */
export function iso(valor) {
  return new Date(valor).toISOString();
}

/**
 * La meta que rige hoy y el cambio pendiente, si lo hay. Un cambio de meta
 * espera en `meta_siguiente` hasta su día.
 * @param {import("../datos/personas.js").FilaDePersona} persona
 * @param {string} hoy
 * @returns {{ metaDiaria: number, metaSiguiente: number | null }}
 */
export function metasDe(persona, hoy) {
  const rigeLaSiguiente = persona.meta_siguiente != null && persona.meta_cambia_el <= hoy;
  return rigeLaSiguiente
    ? { metaDiaria: persona.meta_siguiente, metaSiguiente: null }
    : { metaDiaria: persona.meta_diaria, metaSiguiente: persona.meta_siguiente };
}

/**
 * Lo que rige desde hoy según la fila de la persona: el tramo de hoy y, si un
 * cambio de meta espera su día, el de ese día.
 * @param {import("../datos/personas.js").FilaDePersona} persona
 * @param {string} hoy
 * @returns {import("@panal/motor").TramoDeAjustes[]}
 */
export function tramosDesdeHoy(persona, hoy) {
  const { metaDiaria, metaSiguiente } = metasDe(persona, hoy);
  const diaSinFlores = persona.dia_sin_flores;
  const tramos = [{ desde: hoy, metaDiaria, diaSinFlores }];
  if (metaSiguiente != null)
    tramos.push({ desde: persona.meta_cambia_el, metaDiaria: metaSiguiente, diaSinFlores });
  return tramos;
}

/**
 * Los ajustes que el motor necesita para decidir cómo se cuenta cada día.
 *
 * El historial junta los tramos guardados antes de hoy con lo que dice la fila
 * desde hoy: así hoy siempre se cuenta con la fila, aunque falten tramos.
 *
 * @param {import("../datos/personas.js").FilaDePersona} persona
 * @param {string} hoy
 * @param {import("../datos/personas.js").FilaDeTramo[]} [tramos] De `tramosDeAjustes`.
 * @returns {import("@panal/motor").Ajustes}
 */
export function ajustesDe(persona, hoy, tramos = []) {
  return {
    metaDiaria: metasDe(persona, hoy).metaDiaria,
    diaSinFlores: persona.dia_sin_flores,
    invernada: persona.invernada_desde
      ? { desde: persona.invernada_desde, hasta: persona.invernada_hasta }
      : null,
    historial: [
      ...tramos
        .filter((tramo) => tramo.desde < hoy)
        .map((tramo) => ({
          desde: tramo.desde,
          metaDiaria: tramo.meta_diaria,
          diaSinFlores: tramo.dia_sin_flores,
        })),
      ...tramosDesdeHoy(persona, hoy),
    ],
  };
}

/**
 * `Perfil` de respuestas.js.
 * @param {import("../datos/personas.js").FilaDePersona} persona
 * @param {number} ahora Instante del reloj del servidor.
 */
export function perfilDe(persona, ahora) {
  const zona = persona.zona_horaria;
  const hoy = diaLogico(ahora, zona);
  const { diaSinFlores, invernada } = ajustesDe(persona, hoy);
  return {
    id: persona.id,
    nombre: persona.nombre,
    correo: persona.correo,
    ...metasDe(persona, hoy),
    zonaHoraria: zona,
    diaSinFlores,
    invernada,
    primerVueloEn: instante(persona.primer_vuelo_en),
    creadaEl: diaLogico(persona.creada_en, zona),
  };
}

/**
 * @param {Pick<import("../datos/actividades.js").FilaDeActividad, "clase" | "dias" | "veces" | "dia_mes">} fila
 * @returns {import("@panal/motor").Regla | null}
 */
export function reglaDe(fila) {
  switch (fila.clase) {
    case "diaria":
      return { clase: "diaria" };
    case "dias":
      return { clase: "dias", dias: [...fila.dias].map(Number).sort((a, b) => a - b) };
    case "veces":
      return { clase: "veces", veces: fila.veces };
    case "mes":
      return { clase: "mes", dia: fila.dia_mes };
    default:
      return null;
  }
}

/**
 * `Actividad` de respuestas.js. También sirve tal cual como actividad del motor.
 *
 * `archivadaEl` es el día en que dejó de estar activa: el de la propia actividad
 * o, si su colmena se archivó antes, el de la colmena.
 *
 * @param {import("../datos/actividades.js").FilaDeActividad} fila
 * @param {string} zona Zona horaria de quien mira.
 */
export function actividadDe(fila, zona) {
  const archivos = [fila.archivada_en, fila.colmena_archivada_en].filter(Boolean).map(Number);
  return {
    id: fila.id,
    titulo: fila.titulo,
    tipo: fila.tipo,
    prioridad: fila.prioridad_alta ? "alta" : "normal",
    regla: reglaDe(fila),
    vence: fila.vence_el,
    colmenaId: fila.colmena_id,
    colmena: fila.colmena_id ? { id: fila.colmena_id, nombre: fila.colmena_nombre } : null,
    asignadaA: fila.asignada_a,
    creadaPor: fila.creada_por,
    creadaEl: diaLogico(fila.creada_en, zona),
    creadaEn: iso(fila.creada_en),
    archivadaEl: archivos.length > 0 ? diaLogico(Math.min(...archivos), zona) : null,
  };
}

/**
 * `CeldaLlena` de respuestas.js.
 * @param {import("../datos/actividades.js").FilaDeCelda} fila
 * @param {number} gotas
 */
export function celdaDe(fila, gotas) {
  return {
    id: fila.id,
    actividadId: fila.actividad_id,
    personaId: fila.persona_id,
    dia: fila.dia,
    llenadaEn: iso(fila.llenada_en),
    gotas,
  };
}

/**
 * `Integrante` de respuestas.js.
 * @param {import("../datos/colmenas.js").FilaDeIntegrante} fila
 */
export function integranteDe(fila) {
  return { id: fila.id, nombre: fila.nombre, color: fila.color };
}
