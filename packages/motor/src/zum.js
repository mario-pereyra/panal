import { HORA_DE_CAMBIO } from "./dia.js";

/** Los seis estados de Zum, en el orden en que se evalúan: gana el primero que se cumple. */
export const ESTADOS_DE_ZUM = [
  "descansando",
  "celebrando",
  "feliz",
  "animando",
  "preocupada",
  "esperando",
];

/** Hora local desde la que Zum se preocupa por una racha sin celdas. */
export const HORA_DE_PREOCUPARSE = 18;

/**
 * Estado de Zum según el día y la racha. Zum se preocupa por la racha; nunca reprocha.
 *
 * @param {{ llenas: number, meta: number, programadas: number, cerrado: boolean, descanso: boolean }} resumen
 * @param {{ actual: number }} racha
 * @param {{ hora: number }} ahora Hora local (0 a 23). El motor no lee el reloj.
 * @returns {"descansando" | "celebrando" | "feliz" | "animando" | "preocupada" | "esperando"}
 */
export function estadoDeZum(resumen, racha, ahora) {
  if (resumen.descanso) return "descansando";
  if (resumen.cerrado) return "celebrando";
  if (resumen.llenas > 0) return resumen.llenas * 2 >= resumen.meta ? "feliz" : "animando";
  // El día de Panal sigue hasta las 03:00, así que la madrugada también cuenta como tarde.
  const esTarde = ahora.hora >= HORA_DE_PREOCUPARSE || ahora.hora < HORA_DE_CAMBIO;
  if (esTarde && resumen.programadas > 0 && racha.actual > 0) return "preocupada";
  return "esperando";
}
