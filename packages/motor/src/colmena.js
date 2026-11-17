import { GOTAS } from "./gotas.js";

/** Cuadros de una colmena: se completa uno cada 20 % de avance. */
export const CUADROS_POR_COLMENA = 5;

/**
 * Avance de una colmena: una celda por actividad, a nombre de quien la llenó.
 *
 * @param {Array<{ llenaPor: string | null }>} celdas
 * @returns {{ total: number, llenas: number, porcentaje: number, cuadro: number, faltanParaElSiguiente: number, cerrada: boolean, aportes: Array<{ personaId: string, celdas: number }> }}
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
    cerrada: total > 0 && llenas >= total,
    aportes: [...porPersona]
      .map(([personaId, cantidad]) => ({ personaId, celdas: cantidad }))
      .sort((a, b) => b.celdas - a.celdas),
  };
}

/**
 * Celdas que hacen falta para alcanzar un cuadro.
 * @param {number} cuadro De 1 a 5.
 * @param {number} total
 */
export function umbralDeCuadro(cuadro, total) {
  return Math.ceil((cuadro * total) / CUADROS_POR_COLMENA);
}

/**
 * Los cuadros de una colmena en el orden en que se alcanzaron, y los bonos que dieron.
 *
 * Recorre las celdas llenas por orden de llegada. Al alcanzar un cuadro, quienes
 * llenaron celdas en ese tramo reciben el bono de cuadro. Al llegar al 100 %,
 * cada integrante con al menos un aporte recibe además el de colmena cerrada.
 *
 * @param {Array<{ personaId: string, dia: string, llenadaEn?: string }>} llenas
 * @param {number} total Actividades de la colmena.
 * @returns {{ cuadros: Array<{ cuadro: number, dia: string, personas: string[] }>, bonos: Array<{ personaId: string, dia: string, gotas: number, motivo: "cuadro" | "colmena-cerrada" }> }}
 */
export function cuadrosDeColmena(llenas, total) {
  const ordenadas = [...llenas].sort((a, b) =>
    (a.llenadaEn ?? a.dia).localeCompare(b.llenadaEn ?? b.dia),
  );
  const cuadros = [];
  const bonos = [];
  if (total <= 0) return { cuadros, bonos };

  let siguiente = 1;
  let inicioDelTramo = 0;
  ordenadas.forEach((celda, indice) => {
    const cantidad = indice + 1;
    while (siguiente <= CUADROS_POR_COLMENA && cantidad >= umbralDeCuadro(siguiente, total)) {
      const tramo = ordenadas.slice(inicioDelTramo, cantidad);
      const personas = [...new Set(tramo.map((otra) => otra.personaId))];
      cuadros.push({ cuadro: siguiente, dia: celda.dia, personas });
      for (const personaId of personas) {
        bonos.push({ personaId, dia: celda.dia, gotas: GOTAS.cuadroDeColmena, motivo: "cuadro" });
      }
      if (siguiente === CUADROS_POR_COLMENA) {
        const todas = [...new Set(ordenadas.slice(0, cantidad).map((otra) => otra.personaId))];
        for (const personaId of todas) {
          bonos.push({
            personaId,
            dia: celda.dia,
            gotas: GOTAS.colmenaCerrada,
            motivo: "colmena-cerrada",
          });
        }
      }
      inicioDelTramo = cantidad;
      siguiente += 1;
    }
  });
  return { cuadros, bonos };
}
