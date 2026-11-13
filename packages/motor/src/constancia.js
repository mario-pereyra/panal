import { lunesDe, sumarDias } from "./dia.js";

/**
 * Intensidad de un día en el panal de constancia.
 * @param {number} llenas Celdas llenas ese día.
 * @param {number} meta Meta diaria.
 * @returns {0 | 1 | 2 | 3} 0 sin celdas, 1 al menos una, 2 la mitad o más, 3 panal cerrado.
 */
export function nivelDeConstancia(llenas, meta) {
  if (llenas <= 0) return 0;
  if (llenas >= meta) return 3;
  return llenas * 2 >= meta ? 2 : 1;
}

/**
 * Panal de constancia: las últimas semanas, de lunes a domingo, terminando en la semana de hoy.
 *
 * @param {Array<{ dia: string }>} celdas Celdas llenas.
 * @param {{ metaDiaria: number }} ajustes
 * @param {string} hoy
 * @param {number} [semanas]
 * @returns {Array<Array<{ dia: string, llenas: number, nivel: 0 | 1 | 2 | 3, esHoy: boolean, futuro: boolean }>>}
 */
export function constanciaDe(celdas, ajustes, hoy, semanas = 5) {
  const porDia = new Map();
  for (const { dia } of celdas) porDia.set(dia, (porDia.get(dia) ?? 0) + 1);

  const primerLunes = sumarDias(lunesDe(hoy), -7 * (semanas - 1));
  return Array.from({ length: semanas }, (_, semana) =>
    Array.from({ length: 7 }, (_, columna) => {
      const dia = sumarDias(primerLunes, semana * 7 + columna);
      const llenas = porDia.get(dia) ?? 0;
      return {
        dia,
        llenas,
        nivel: nivelDeConstancia(llenas, ajustes.metaDiaria),
        esHoy: dia === hoy,
        futuro: dia > hoy,
      };
    }),
  );
}
