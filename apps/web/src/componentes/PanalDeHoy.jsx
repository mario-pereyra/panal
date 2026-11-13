import estilos from "./graficas.module.css";
import { panalDe, puntosDeHexagono } from "./hexagono.js";

const RADIO = 38;

/**
 * El panal de hoy: una celda por cada actividad de la meta. Se llenan en orden.
 *
 * @param {object} props
 * @param {number} props.llenas
 * @param {number} props.meta
 * @param {string} props.descripcion Lo que oye quien no ve el dibujo.
 */
export function PanalDeHoy({ llenas, meta, descripcion, className }) {
  const { centros, ancho, alto } = panalDe(meta, { radio: RADIO });
  const puntos = puntosDeHexagono(RADIO);

  return (
    <svg
      className={[estilos.panalDeHoy, className].filter(Boolean).join(" ")}
      role="img"
      aria-label={descripcion}
      width={ancho}
      height={alto}
      viewBox={`0 0 ${ancho} ${alto}`}
    >
      {centros.map((centro, indice) => (
        <g
          key={indice}
          className={estilos.celdaDeHoy}
          data-llena={indice < llenas ? "" : undefined}
          transform={`translate(${centro.x} ${centro.y})`}
        >
          <polygon points={puntos} />
          <path d="M-12 0 l8 9 l16 -18" pathLength="1" />
        </g>
      ))}
    </svg>
  );
}
