/** Cuadros de una colmena: se completa uno cada 20 % de avance. */
export const CUADROS_POR_COLMENA = 5;

/**
 * Avance de una colmena: una celda por actividad, a nombre de quien la llenó.
 *
 * @param {Array<{ llenaPor: string | null }>} celdas
 * @returns {{ total: number, llenas: number, porcentaje: number, cuadro: number, faltanParaElSiguiente: number, aportes: Array<{ personaId: string, celdas: number }> }}
 *   Los aportes van de mayor a menor.
 */
export function avanceDeColmena(celdas) {
  const total = celdas.length;
  const porPersona = new Map();
  for (const { llenaPor } of celdas) {
    if (llenaPor) porPersona.set(llenaPor, (porPersona.get(llenaPor) ?? 0) + 1);
  }
  const llenas = celdas.filter((celda) => celda.llenaPor).length;
  const cuadro = total > 0 ? Math.floor((llenas * CUADROS_POR_COLMENA) / total) : 0;
  const metaDelSiguiente = Math.ceil(((cuadro + 1) * total) / CUADROS_POR_COLMENA);
  return {
    total,
    llenas,
    porcentaje: total > 0 ? Math.round((llenas * 100) / total) : 0,
    cuadro,
    faltanParaElSiguiente: cuadro >= CUADROS_POR_COLMENA ? 0 : metaDelSiguiente - llenas,
    aportes: [...porPersona]
      .map(([personaId, cantidad]) => ({ personaId, celdas: cantidad }))
      .sort((a, b) => b.celdas - a.celdas),
  };
}
