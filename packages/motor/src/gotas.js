/**
 * Gotas de miel: los puntos de Panal y sus límites contra el abuso.
 *
 * Las gotas nunca se guardan: se calculan a partir de las celdas llenas, por
 * eso al vaciar una celda desaparecen solas.
 */

export const GOTAS = {
  recurrente: 10,
  unica: 25,
  unicaAlta: 35,
  unicaVencida: 15,
  cierreDelPanal: 20,
  /** Desde la undécima celda del día, cada una vale esto. */
  trasElTope: 2,
  /** Completar la cuota semanal de una recurrente. */
  cuotaSemanal: 15,
  /** Cada 7 días de racha. */
  hitoDeRacha: 50,
  /** A quienes aportaron en el tramo de un cuadro de colmena. */
  cuadroDeColmena: 30,
  /** A cada integrante con al menos un aporte, al cerrar la colmena. */
  colmenaCerrada: 100,
};

/** Celdas del día que valen completas antes del tope suave. */
export const TOPE_SUAVE_DIARIO = 10;

/** Únicas de prioridad alta que valen como tales en un mismo día. */
export const ALTAS_POR_DIA = 2;

/** Celdas relámpago (creadas y llenadas en menos de un minuto) que dan gotas en un día. */
export const RELAMPAGOS_POR_DIA = 3;

/** Segundos entre crear y llenar una celda por debajo de los cuales es relámpago. */
export const SEGUNDOS_RELAMPAGO = 60;

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

/**
 * Si una celda se llenó a menos de un minuto de crear su actividad.
 * @param {{ creadaEn?: string }} actividad
 * @param {{ llenadaEn?: string }} celda
 */
export function esRelampago(actividad, celda) {
  if (!actividad.creadaEn || !celda.llenadaEn) return false;
  const segundos = (Date.parse(celda.llenadaEn) - Date.parse(actividad.creadaEn)) / 1000;
  return segundos >= 0 && segundos < SEGUNDOS_RELAMPAGO;
}

/**
 * Pone su valor a cada celda de un mismo día, en el orden en que se llenaron.
 * Es un recorrido con acumulador: lo ya llenado ese día decide cuánto vale la siguiente.
 *
 * @template {{ actividadId: string, dia: string, llenadaEn?: string }} C
 * @param {C[]} celdasDelDia
 * @param {Map<string, import("./actividades.js").Actividad>} actividades Por identificador.
 * @returns {Array<C & { gotas: number }>}
 */
export function valorarDia(celdasDelDia, actividades) {
  const ordenadas = [...celdasDelDia].sort((a, b) =>
    (a.llenadaEn ?? "").localeCompare(b.llenadaEn ?? ""),
  );
  const inicial = { valoradas: [], altas: 0, relampagos: 0 };
  return ordenadas.reduce((acumulado, celda) => {
    const actividad = actividades.get(celda.actividadId) ?? { tipo: "recurrente" };
    const vencida = Boolean(
      actividad.tipo === "unica" && actividad.vence && actividad.vence < celda.dia,
    );
    const relampago = esRelampago(actividad, celda);
    const gotas = gotasDeCelda(
      { tipo: actividad.tipo, prioridad: actividad.prioridad, vencida, relampago },
      {
        llenasAntes: acumulado.valoradas.length,
        altasAntes: acumulado.altas,
        relampagosAntes: acumulado.relampagos,
      },
    );
    const esAlta = actividad.tipo === "unica" && actividad.prioridad === "alta" && !vencida;
    return {
      valoradas: [...acumulado.valoradas, { ...celda, gotas }],
      altas: acumulado.altas + (esAlta ? 1 : 0),
      relampagos: acumulado.relampagos + (relampago ? 1 : 0),
    };
  }, inicial).valoradas;
}
