import { reemplazarTramosDesde } from "../datos/personas.js";
import { tramosDesdeHoy } from "./formatos.js";

/**
 * Anota en el historial lo que rige desde hoy. Va en la misma transacción que
 * el cambio de la persona: al crearla, en el primer vuelo y al cambiar su meta
 * o su día sin flores. Los días anteriores conservan sus tramos.
 *
 * @param {import("../datos/base.js").Consultor} db
 * @param {import("../datos/personas.js").FilaDePersona} persona Ya con el cambio.
 * @param {string} hoy Día lógico de la persona.
 */
export async function anotarAjustes(db, persona, hoy) {
  await reemplazarTramosDesde(db, persona.id, hoy, tramosDesdeHoy(persona, hoy));
}
