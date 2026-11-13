import estilos from "./graficas.module.css";
import { puntosDeHexagono } from "./hexagono.js";

const RADIO = 16;
const COLUMNAS = 6;
const PASO = 36; // de centro a centro, en la misma fila
const SALTO = 31; // de una fila a la siguiente
const MARGEN_X = 20;
const MARGEN_Y = 22;

/**
 * La rejilla de una colmena: una celda por actividad, pintada con el color de
 * quien la llenó.
 *
 * @param {object} props
 * @param {Array<{ id: string, color: string | null }>} props.celdas
 * @param {string} props.descripcion Lo que oye quien no ve el dibujo.
 */
export function RejillaDeColmena({ celdas, descripcion }) {
  const filas = Math.max(1, Math.ceil(celdas.length / COLUMNAS));
  const ancho = MARGEN_X * 2 + PASO * (COLUMNAS - 1) + PASO / 2;
  const alto = MARGEN_Y * 2 + SALTO * (filas - 1);
  const puntos = puntosDeHexagono(RADIO);

  return (
    <svg
      className={estilos.rejillaDeColmena}
      role="img"
      aria-label={descripcion}
      viewBox={`0 0 ${ancho} ${alto}`}
    >
      {celdas.map((celda, indice) => {
        const fila = Math.floor(indice / COLUMNAS);
        const columna = indice % COLUMNAS;
        const x = MARGEN_X + PASO * columna + (fila % 2 === 1 ? PASO / 2 : 0);
        const y = MARGEN_Y + SALTO * fila;
        return (
          <polygon
            key={celda.id}
            className={celda.color ? estilos.celdaDeAbeja : estilos.celdaSinLlenar}
            style={celda.color ? { fill: celda.color } : undefined}
            points={puntos}
            transform={`translate(${x} ${y})`}
          />
        );
      })}
    </svg>
  );
}
