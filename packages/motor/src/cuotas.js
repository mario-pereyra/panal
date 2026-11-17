import { agruparPor, cuotaSemanal, hechasEnLaSemana } from "./actividades.js";
import { lunesDe, sumarDias } from "./dia.js";

/**
 * Cuotas semanales de las recurrentes: "2 de 3 esta semana".
 */

/**
 * Avance de la semana de una recurrente, o nulo si no tiene cuota semanal.
 * @param {import("./actividades.js").Actividad} actividad
 * @param {Array<{ dia: string }>} hechos Celdas de esta actividad.
 * @param {string} hoy
 * @returns {{ hechas: number, meta: number, cumplida: boolean } | null}
 */
export function avanceDeLaSemana(actividad, hechos, hoy) {
  const meta = actividad.tipo === "recurrente" ? cuotaSemanal(actividad.regla) : null;
  if (!meta) return null;
  const hechas = hechasEnLaSemana(hechos, hoy);
  return { hechas, meta, cumplida: hechas >= meta };
}

/**
 * Semanas en que una recurrente cumplió su cuota, con el día en que la alcanzó.
 * @param {import("./actividades.js").Actividad} actividad
 * @param {Array<{ dia: string }>} hechos
 * @returns {Array<{ lunes: string, dia: string }>} De la más antigua a la más reciente.
 */
export function cuotasCumplidas(actividad, hechos) {
  const cuota = actividad.tipo === "recurrente" ? cuotaSemanal(actividad.regla) : null;
  if (!cuota) return [];
  const porSemana = agruparPor(hechos, (hecho) => lunesDe(hecho.dia));
  return [...porSemana]
    .flatMap(([lunes, deLaSemana]) => {
      const dias = deLaSemana.map((hecho) => hecho.dia).sort();
      return dias.length >= cuota ? [{ lunes, dia: dias[cuota - 1] }] : [];
    })
    .sort((a, b) => a.lunes.localeCompare(b.lunes));
}

/**
 * La serie más larga de semanas seguidas con la cuota cumplida, y el día en que llegó a cada largo.
 * @param {Array<{ lunes: string, dia: string }>} cumplidas Ordenadas por semana.
 * @returns {{ mejor: number, alcanzada: Record<number, string> }}
 */
export function seriesDeCuotas(cumplidas) {
  const inicial = { actual: 0, anterior: null, mejor: 0, alcanzada: {} };
  const final = cumplidas.reduce((serie, { lunes, dia }) => {
    const seguida = serie.anterior !== null && sumarDias(serie.anterior, 7) === lunes;
    const actual = seguida ? serie.actual + 1 : 1;
    return {
      actual,
      anterior: lunes,
      mejor: Math.max(serie.mejor, actual),
      alcanzada:
        actual in serie.alcanzada ? serie.alcanzada : { ...serie.alcanzada, [actual]: dia },
    };
  }, inicial);
  return { mejor: final.mejor, alcanzada: final.alcanzada };
}
