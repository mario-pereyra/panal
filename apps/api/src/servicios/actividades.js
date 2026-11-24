import { identificador, MAXIMO_DE_PRIORIDAD_ALTA, permisosSobreActividad } from "@panal/contratos";
import { duenaDe, ocupaCupoDeAlta } from "@panal/motor";
import { altasPendientes } from "../datos/actividades.js";
import { colmenaPorId, esIntegrante } from "../datos/colmenas.js";
import { falla } from "../errores.js";

/**
 * Reglas de permisos y límites de las actividades (sección 8 de `05-datos-y-api.md`).
 *
 * @typedef {import("../datos/base.js").Consultor} Consultor
 * @typedef {import("../datos/actividades.js").FilaDeActividad} FilaDeActividad
 */

/** @param {string} valor */
export function esIdentificador(valor) {
  return identificador.safeParse(valor).success;
}

/**
 * Ver `permisosSobreActividad` en contratos. Fuera de la colmena no se ve; en una
 * colmena archivada, nada cambia.
 * @param {Consultor} db
 * @param {FilaDeActividad} actividad
 * @param {{ personaId: string, hoy: string, accion: "editar" | "archivar" }} quien
 */
export async function exigirPermisoSobreActividad(db, actividad, { personaId, hoy, accion }) {
  if (actividad.colmena_id) {
    if (!(await esIntegrante(db, actividad.colmena_id, personaId))) throw falla("sin_permiso");
    if (actividad.colmena_archivada_en) throw falla("colmena_cerrada");
  }
  const permisos = permisosSobreActividad(
    {
      tipo: actividad.tipo,
      creadaPor: actividad.creada_por,
      asignadaA: actividad.asignada_a,
      primeraLlenaEl: actividad.primera_llena_el,
    },
    {
      personaId,
      hoy,
      colmena: actividad.colmena_id
        ? { fundadoraId: actividad.colmena_fundadora_id, archivada: false }
        : null,
    },
  );
  if (!permisos[accion]) throw falla("sin_permiso");
}

/**
 * La colmena a la que va una actividad: tiene que existir, la persona tiene que
 * seguir dentro y no puede estar archivada. Quien la recibe asignada, también.
 * @param {Consultor} db
 * @param {{ colmenaId: string | null, asignadaA: string | null }} destino
 * @param {string} personaId
 */
export async function exigirColmenaDeDestino(db, { colmenaId, asignadaA }, personaId) {
  if (!colmenaId) return;
  const colmena = await colmenaPorId(db, colmenaId);
  if (!colmena) throw falla("datos_invalidos", { campos: { colmenaId: "Esa colmena no existe." } });
  if (!(await esIntegrante(db, colmenaId, personaId))) throw falla("sin_permiso");
  if (colmena.archivada_en) throw falla("colmena_cerrada");
  if (asignadaA && !(await esIntegrante(db, colmenaId, asignadaA))) {
    throw falla("datos_invalidos", { campos: { asignadaA: "Esa abeja no está en la colmena." } });
  }
}

/**
 * @typedef {object} EstadoDeActividad Lo que importa para el cupo de prioridad alta.
 * @property {string} id
 * @property {"unica" | "recurrente"} tipo
 * @property {"normal" | "alta"} prioridad
 * @property {string | null} colmenaId
 * @property {string | null} asignadaA
 * @property {string} creadaPor
 * @property {boolean} archivada
 * @property {boolean} llena
 */

/**
 * Nadie tiene más de tres únicas de prioridad alta pendientes a la vez. Solo se
 * comprueba cuando el cambio suma una al panal de alguien: editar el título de
 * una que ya contaba no la rechaza.
 * @param {Consultor} db
 * @param {EstadoDeActividad | null} antes
 * @param {EstadoDeActividad} despues
 */
export async function exigirCupoDeAlta(db, antes, despues) {
  if (!ocupaCupoDeAlta(despues)) return;
  const duena = duenaDe(despues);
  if (ocupaCupoDeAlta(antes) && duenaDe(antes) === duena) return;
  if ((await altasPendientes(db, duena, despues.id)) >= MAXIMO_DE_PRIORIDAD_ALTA) {
    throw falla("prioridad_alta_completa");
  }
}

/**
 * El estado de una actividad guardada, para comparar antes y después de un cambio.
 * @param {FilaDeActividad} fila
 * @returns {EstadoDeActividad}
 */
export function estadoDeFila(fila) {
  return {
    id: fila.id,
    tipo: fila.tipo,
    prioridad: fila.prioridad_alta ? "alta" : "normal",
    colmenaId: fila.colmena_id,
    asignadaA: fila.asignada_a,
    creadaPor: fila.creada_por,
    archivada: Boolean(fila.archivada_en || fila.colmena_archivada_en),
    llena: Boolean(fila.primera_llena_el),
  };
}
