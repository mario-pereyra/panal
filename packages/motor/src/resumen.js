import { esDescanso } from "./dia.js";
import { GOTAS } from "./gotas.js";

/**
 * Resumen de un día: cuántas celdas se llenaron, la meta y si el panal cerró.
 *
 * El panal cierra al llenar tantas celdas como la meta diaria, o todas las
 * programadas si son menos. Cerrar da un bono. Un día de descanso nunca cierra
 * ni queda a medias.
 *
 * @param {{ celdas: Array<{ dia: string, gotas: number }>, programadas: number }} hechos
 *   Celdas llenas (de cualquier día) y cuántas actividades tocan ese día.
 * @param {{ metaDiaria: number, diaSinFlores?: number | null, invernada?: { desde: string, hasta: string } | null }} ajustes
 * @param {string} dia
 */
export function resumenDelDia(hechos, ajustes, dia) {
  const delDia = hechos.celdas.filter((celda) => celda.dia === dia);
  const llenas = delDia.length;
  const { programadas } = hechos;
  const meta = programadas > 0 ? Math.min(ajustes.metaDiaria, programadas) : ajustes.metaDiaria;
  const descanso = esDescanso(ajustes, dia);
  const cerrado = !descanso && programadas > 0 && llenas >= meta;
  const gotasDeCeldas = delDia.reduce((suma, celda) => suma + celda.gotas, 0);
  const bonoDeCierre = cerrado ? GOTAS.cierreDelPanal : 0;
  return {
    dia,
    llenas,
    programadas,
    meta,
    faltan: Math.max(0, meta - llenas),
    cerrado,
    descanso,
    gotasDeCeldas,
    bonoDeCierre,
    gotas: gotasDeCeldas + bonoDeCierre,
  };
}
