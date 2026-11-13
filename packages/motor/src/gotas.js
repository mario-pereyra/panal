/**
 * Gotas de miel: los puntos de Panal y sus límites contra el abuso.
 *
 * Las gotas nunca se guardan sueltas: se calculan a partir de las celdas llenas,
 * por eso al vaciar una celda desaparecen solas.
 */
export const GOTAS = {
  recurrente: 10,
  unica: 25,
  unicaAlta: 35,
  unicaVencida: 15,
  cierreDelPanal: 20,
  /** Desde la undécima celda del día, cada una vale esto. */
  trasElTope: 2,
};

/** Celdas del día que valen completas antes del tope suave. */
export const TOPE_SUAVE_DIARIO = 10;
/** Únicas de prioridad alta que valen como tales en un mismo día. */
export const ALTAS_POR_DIA = 2;
/** Celdas relámpago (creadas y llenadas en menos de un minuto) que dan gotas en un día. */
export const RELAMPAGOS_POR_DIA = 3;

/**
 * Gotas que vale llenar una celda.
 *
 * @param {{ tipo: "recurrente" | "unica", prioridad?: "normal" | "alta", vencida?: boolean, relampago?: boolean }} celda
 * @param {{ llenasAntes?: number, altasAntes?: number, relampagosAntes?: number }} [contexto]
 *   Lo que la persona ya llenó ese mismo día, antes de esta celda.
 * @returns {number}
 */
export function gotasDeCelda(celda, contexto = {}) {
  const { llenasAntes = 0, altasAntes = 0, relampagosAntes = 0 } = contexto;
  if (llenasAntes >= TOPE_SUAVE_DIARIO) return GOTAS.trasElTope;

  let gotas = GOTAS.recurrente;
  if (celda.tipo === "unica") {
    if (celda.vencida) gotas = GOTAS.unicaVencida;
    else if (celda.prioridad === "alta" && altasAntes < ALTAS_POR_DIA) gotas = GOTAS.unicaAlta;
    else gotas = GOTAS.unica;
  }

  if (celda.relampago) {
    return relampagosAntes < RELAMPAGOS_POR_DIA ? Math.floor(gotas / 2) : 0;
  }
  return gotas;
}
