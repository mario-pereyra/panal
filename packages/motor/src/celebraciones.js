import { GOTAS } from "./gotas.js";

/**
 * Celebraciones: lo que se ganó entre dos momentos.
 *
 * No se guarda ningún logro. El servidor calcula el progreso antes y después
 * de un cambio y esta función dice qué hay de nuevo, para que la ventana de
 * celebración lo muestre.
 */

/** Importancia de cada logro: la ventana los muestra del más grande al más pequeño. */
export const PESO_DE_CELEBRACION = {
  "colmena-cerrada": 6,
  oficio: 5,
  cuadro: 4,
  sello: 3,
  racha: 2,
  "panal-cerrado": 1,
};

/**
 * @typedef {object} Foto Lo que hace falta comparar de un progreso.
 * @property {{ cerrado: boolean }} hoy
 * @property {{ racha: number, hitos: number }} vuelo
 * @property {{ nivel: number, nombre: string, siguiente: string | null, faltan: number }} oficio
 * @property {Array<{ id: string, nombre: string, ganado: boolean }>} sellos
 * @property {Array<{ id: string, nombre: string, cuadro: number, cerrada: boolean }>} colmenas
 *
 * @typedef {{ tipo: string, gotas?: number, [dato: string]: any }} Celebracion
 */

/**
 * Los logros nuevos entre dos fotos del progreso.
 * @param {Foto} antes
 * @param {Foto} despues
 * @returns {Celebracion[]} Del más importante al menos importante.
 */
export function celebracionesEntre(antes, despues) {
  /** @type {Celebracion[]} */
  const nuevas = [];

  if (despues.hoy.cerrado && !antes.hoy.cerrado) {
    nuevas.push({
      tipo: "panal-cerrado",
      gotas: GOTAS.cierreDelPanal,
      racha: despues.vuelo.racha,
    });
  }
  if (despues.vuelo.hitos > antes.vuelo.hitos) {
    nuevas.push({ tipo: "racha", dias: despues.vuelo.racha, gotas: GOTAS.hitoDeRacha });
  }
  if (despues.oficio.nivel > antes.oficio.nivel) {
    nuevas.push({
      tipo: "oficio",
      nivel: despues.oficio.nivel,
      nombre: despues.oficio.nombre,
      siguiente: despues.oficio.siguiente,
      faltan: despues.oficio.faltan,
    });
  }

  const ganadosAntes = new Set(antes.sellos.filter((s) => s.ganado).map((s) => s.id));
  for (const sello of despues.sellos) {
    if (sello.ganado && !ganadosAntes.has(sello.id)) {
      nuevas.push({ tipo: "sello", id: sello.id, nombre: sello.nombre });
    }
  }

  const colmenasAntes = new Map(antes.colmenas.map((colmena) => [colmena.id, colmena]));
  for (const colmena of despues.colmenas) {
    const previa = colmenasAntes.get(colmena.id);
    if (!previa) continue;
    if (colmena.cerrada && !previa.cerrada) {
      nuevas.push({
        tipo: "colmena-cerrada",
        colmenaId: colmena.id,
        colmena: colmena.nombre,
        gotas: GOTAS.colmenaCerrada,
      });
    } else if (colmena.cuadro > previa.cuadro) {
      nuevas.push({
        tipo: "cuadro",
        colmenaId: colmena.id,
        colmena: colmena.nombre,
        cuadro: colmena.cuadro,
        gotas: GOTAS.cuadroDeColmena,
      });
    }
  }

  return nuevas.sort((a, b) => PESO_DE_CELEBRACION[b.tipo] - PESO_DE_CELEBRACION[a.tipo]);
}
