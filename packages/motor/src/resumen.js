import { ajustesDelDia, esDescanso } from "./dia.js";
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
 * @param {import("./dia.js").Ajustes} ajustes Con `historial`, cuenta la meta que regía ese día.
 * @param {string} dia
 */
export function resumenDelDia(hechos, ajustes, dia) {
  const delDia = hechos.celdas.filter((celda) => celda.dia === dia);
  const llenas = delDia.length;
  const { programadas } = hechos;
  const { metaDiaria } = ajustesDelDia(ajustes, dia);
  const meta = programadas > 0 ? Math.min(metaDiaria, programadas) : metaDiaria;
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
