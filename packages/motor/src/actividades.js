import { diaDeLaSemana } from "./dia.js";

/**
 * Si una actividad aparece en el panal de un día, y si llega vencida.
 *
 * @param {{ tipo: "recurrente" | "unica", vence?: string | null }} actividad
 * @param {{ clase: "diaria" } | { clase: "semanal", dias: number[] } | null} regla
 *   Regla de repetición; los días usan 0 para lunes y 6 para domingo. Las únicas no tienen.
 * @param {Array<{ dia: string }>} hechos Celdas ya llenas de esta actividad.
 * @param {string} hoy
 * @returns {{ toca: boolean, vencida: boolean }}
 */
export function tocaHoy(actividad, regla, hechos, hoy) {
  if (actividad.tipo === "unica") {
    // Una única ya cumplida otro día no vuelve; si se cumplió hoy, se queda a la vista.
    const cumplidaAntes = hechos.some((hecho) => hecho.dia < hoy);
    const vencida = Boolean(actividad.vence && actividad.vence < hoy);
    return { toca: !cumplidaAntes, vencida: !cumplidaAntes && vencida };
  }
  if (!regla || regla.clase === "diaria") return { toca: true, vencida: false };
  return { toca: regla.dias.includes(diaDeLaSemana(hoy)), vencida: false };
}
