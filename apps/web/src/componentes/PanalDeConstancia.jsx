import estilos from "./graficas.module.css";
import { puntosDeHexagono } from "./hexagono.js";
import { INICIALES_DE_LA_SEMANA } from "./textos.js";

const RADIO = 13;
const PASO = 23; // de una columna a la siguiente
const SALTO = 26; // de una semana a la siguiente
const MARGEN_X = 18;
const PRIMERA_FILA = 34;

/**
 * El panal de constancia: una celda por día, una columna por día de la semana.
 * Más oscuro significa más celdas llenas ese día.
 *
 * @param {object} props
 * @param {Array<Array<{ dia: string, nivel: 0 | 1 | 2 | 3, esHoy: boolean, futuro: boolean }>>} props.semanas
 * @param {string} props.descripcion Lo que oye quien no ve el dibujo.
 */
export function PanalDeConstancia({ semanas, descripcion }) {
  const ancho = MARGEN_X * 2 + PASO * 6;
  const alto = PRIMERA_FILA + SALTO * (semanas.length - 1) + RADIO * 2 + 4;
  const puntos = puntosDeHexagono(RADIO, "plano");

  return (
    <svg
      className={estilos.panalDeConstancia}
      role="img"
      aria-label={descripcion}
      viewBox={`0 0 ${ancho} ${alto}`}
    >
      {INICIALES_DE_LA_SEMANA.map((inicial, columna) => (
        <text key={inicial} className={estilos.inicialDeDia} x={MARGEN_X + PASO * columna} y="12">
          {inicial}
        </text>
      ))}
      {semanas.flatMap((semana, fila) =>
        semana.map((dia, columna) => (
          <polygon
            key={dia.dia}
            className={estilos.diaDeConstancia}
            data-nivel={dia.futuro ? undefined : dia.nivel}
            data-hoy={dia.esHoy ? "" : undefined}
            data-futuro={dia.futuro ? "" : undefined}
            points={puntos}
            // Las columnas impares bajan media celda: así encajan como un panal.
            transform={`translate(${MARGEN_X + PASO * columna} ${
              PRIMERA_FILA + SALTO * fila + (columna % 2 === 1 ? RADIO : 0)
            })`}
          />
        )),
      )}
    </svg>
  );
}
