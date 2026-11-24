/**
 * Geometría del hexágono, la forma de todo en Panal.
 */

const redondear = (valor) => Math.round(valor * 10) / 10;

/**
 * Los seis vértices de un hexágono regular centrado en el origen, listos para
 * el atributo `points` de un polígono SVG.
 *
 * @param {number} radio Distancia del centro a un vértice.
 * @param {"punta" | "plano"} [orientacion] Con un vértice arriba, o con un lado arriba.
 * @returns {string}
 */
export function puntosDeHexagono(radio, orientacion = "punta") {
  const inicio = orientacion === "punta" ? -90 : 0;
  return Array.from({ length: 6 }, (_, vertice) => {
    const angulo = ((inicio + 60 * vertice) * Math.PI) / 180;
    return `${redondear(radio * Math.cos(angulo))},${redondear(radio * Math.sin(angulo))}`;
  }).join(" ");
}

/**
 * Cuántas celdas lleva cada fila del panal de hoy. La meta del día es la
 * diaria (3, 5 o 7) o menos, si hoy hay menos celdas programadas.
 */
const FILAS_DEL_PANAL = {
  1: [1],
  2: [2],
  3: [1, 2],
  4: [2, 2],
  5: [2, 3],
  6: [3, 3],
  7: [2, 3, 2],
};

export const RADIO_DEL_PANAL = 38;
const HUECO = 10;
const MARGEN = 6;

/**
 * Centros de las celdas de un panal de `cantidad` celdas, encajadas como en un
 * panal de verdad, y el tamaño del dibujo que las contiene.
 */
export function panalDe(cantidad) {
  const radio = RADIO_DEL_PANAL;
  const filas = FILAS_DEL_PANAL[cantidad];
  const paso = Math.sqrt(3) * radio + HUECO; // de centro a centro, en la misma fila
  const salto = 1.5 * radio + HUECO * 0.9; // de una fila a la siguiente

  // Filas de distinto largo encajan solas al centrarlas. Si todas miden lo mismo,
  // se corren un cuarto de celda a cada lado para que queden intercaladas.
  const parejas = filas.length > 1 && filas.every((celdas) => celdas === filas[0]);

  const centros = [];
  filas.forEach((celdas, fila) => {
    const corrimiento = parejas ? (fila % 2 === 0 ? -1 : 1) * (paso / 4) : 0;
    for (let columna = 0; columna < celdas; columna += 1) {
      centros.push({
        x: (columna - (celdas - 1) / 2) * paso + corrimiento,
        y: fila * salto,
      });
    }
  });

  const medioAncho = (Math.sqrt(3) / 2) * radio;
  const izquierda = Math.min(...centros.map((centro) => centro.x)) - medioAncho - MARGEN;
  const derecha = Math.max(...centros.map((centro) => centro.x)) + medioAncho + MARGEN;
  const arriba = -radio - MARGEN;
  const abajo = (filas.length - 1) * salto + radio + MARGEN;

  return {
    centros: centros.map((centro) => ({
      x: redondear(centro.x - izquierda),
      y: redondear(centro.y - arriba),
    })),
    ancho: Math.ceil(derecha - izquierda),
    alto: Math.ceil(abajo - arriba),
  };
}
