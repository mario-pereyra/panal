import { diaLogico, horaLocal, progresoDe } from "@panal/motor";
import { actividadesParaProgreso, celdasDePersona } from "../datos/actividades.js";
import { colmenasParaProgreso, llenasDeColmenasDe } from "../datos/colmenas.js";
import { tramosDeAjustes } from "../datos/personas.js";
import { actividadDe, ajustesDe, iso } from "./formatos.js";

/**
 * El progreso de una persona, calculado por el motor a partir de sus hechos.
 *
 * Aquí está toda la lectura que necesita `progresoDe`: nada derivado se guarda,
 * así que el servidor carga los hechos y deja que el motor deduzca el resto.
 *
 * @typedef {import("../datos/base.js").Consultor} Consultor
 * @typedef {import("../datos/personas.js").FilaDePersona} FilaDePersona
 *
 * @typedef {object} ActividadConHechos
 * @property {ReturnType<typeof actividadDe>} actividad En la forma de la respuesta.
 * @property {boolean} delPanal Personal o asignada a la persona.
 * @property {string | null} primeraLlenaEl Día de su primera celda, de quien sea.
 *
 * @typedef {object} Hechos
 * @property {string} hoy
 * @property {string} zona
 * @property {ActividadConHechos[]} actividades
 * @property {import("../datos/actividades.js").FilaDeCelda[]} celdas Las que llenó la persona.
 * @property {import("@panal/motor").EntradaDeProgreso} entrada Lo que recibe `progresoDe`.
 */

/**
 * Carga los hechos de una persona y los deja listos para el motor.
 * @param {Consultor} db
 * @param {FilaDePersona} persona
 * @param {number} ahora
 * @returns {Promise<Hechos>}
 */
export async function hechosDe(db, persona, ahora) {
  const zona = persona.zona_horaria;
  const hoy = diaLogico(ahora, zona);
  // Una consulta tras otra: dentro de una transacción la conexión es una sola.
  const filasDeActividades = await actividadesParaProgreso(db, persona.id);
  const celdas = await celdasDePersona(db, persona.id);
  const colmenas = await colmenasParaProgreso(db, persona.id);
  const llenas = await llenasDeColmenasDe(db, persona.id);
  const tramos = await tramosDeAjustes(db, persona.id);

  const actividades = filasDeActividades.map((fila) => ({
    actividad: actividadDe(fila, zona),
    delPanal: fila.del_panal,
    primeraLlenaEl: fila.primera_llena_el,
  }));

  return {
    hoy,
    zona,
    actividades,
    celdas,
    entrada: {
      personaId: persona.id,
      hoy,
      desde: diaLogico(persona.creada_en, zona),
      ajustes: ajustesDe(persona, hoy, tramos),
      actividades: actividades.filter((a) => a.delPanal).map((a) => a.actividad),
      otras: actividades.filter((a) => !a.delPanal).map((a) => a.actividad),
      celdas: celdas.map((celda) => ({
        id: celda.id,
        actividadId: celda.actividad_id,
        dia: celda.dia,
        llenadaEn: iso(celda.llenada_en),
        horaLocal: horaLocal(celda.llenada_en, zona),
      })),
      colmenas: colmenas.map((colmena) => ({
        id: colmena.id,
        nombre: colmena.nombre,
        fundadoraId: colmena.fundadora_id,
        unidas: colmena.unidas,
        total: colmena.total,
        llenas: llenas
          .filter((llena) => llena.colmena_id === colmena.id)
          .map((llena) => ({
            personaId: llena.persona_id,
            dia: llena.dia,
            llenadaEn: iso(llena.llenada_en),
          })),
      })),
    },
  };
}

/**
 * Los hechos de una persona y su progreso.
 * @param {Consultor} db
 * @param {FilaDePersona} persona
 * @param {number} ahora
 */
export async function progresoDePersona(db, persona, ahora) {
  const hechos = await hechosDe(db, persona, ahora);
  return { hechos, progreso: progresoDe(hechos.entrada) };
}

/**
 * Las gotas de cada celda, según el progreso.
 * @param {ReturnType<typeof progresoDe>} progreso
 * @returns {Map<string, number>}
 */
export function gotasPorCelda(progreso) {
  return new Map(progreso.celdas.map((celda) => [celda.id, celda.gotas]));
}
