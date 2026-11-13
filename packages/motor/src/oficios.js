/**
 * Los diez oficios de la abeja: los niveles de Panal.
 * Los primeros llegan rápido; los últimos piden constancia.
 */
export const OFICIOS = [
  { nivel: 1, desde: 0, nombre: "Novata" },
  { nivel: 2, desde: 100, nombre: "Nodriza" },
  { nivel: 3, desde: 250, nombre: "Cerera" },
  { nivel: 4, desde: 450, nombre: "Exploradora" },
  { nivel: 5, desde: 700, nombre: "Recolectora" },
  { nivel: 6, desde: 1000, nombre: "Almacenera" },
  { nivel: 7, desde: 1400, nombre: "Guardiana" },
  { nivel: 8, desde: 1900, nombre: "Danzante" },
  { nivel: 9, desde: 2500, nombre: "Arquitecta" },
  { nivel: 10, desde: 3200, nombre: "Maestra del panal" },
];

/**
 * Oficio que corresponde a un total de gotas.
 * @param {number} gotas
 * @returns {{ nivel: number, nombre: string, gotas: number, siguiente: string | null, faltan: number, avance: number }}
 *   El avance va de 0 a 1 dentro del tramo actual; en el último oficio es 1.
 */
export function oficioDe(gotas) {
  const total = Math.max(0, Math.floor(gotas));
  let actual = OFICIOS[0];
  for (const oficio of OFICIOS) {
    if (total >= oficio.desde) actual = oficio;
  }
  // El nivel empieza en 1, así que también es la posición del oficio siguiente.
  const siguiente = OFICIOS[actual.nivel] ?? null;
  return {
    nivel: actual.nivel,
    nombre: actual.nombre,
    gotas: total,
    siguiente: siguiente ? siguiente.nombre : null,
    faltan: siguiente ? siguiente.desde - total : 0,
    avance: siguiente ? (total - actual.desde) / (siguiente.desde - actual.desde) : 1,
  };
}
