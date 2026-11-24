import { clases } from "../../lib/clases.js";
import { panalDe, puntosDeHexagono, RADIO_DEL_PANAL } from "../ui/hexagono.js";
import estilos from "./PanalDeHoy.module.css";

/**
 * El panal de hoy: una celda por cada actividad de la meta. Se llenan en orden.
 *
 * @param {object} props
 * @param {string} [props.descripcion] Lo que oye quien no ve el dibujo. Sin ella, es decorativo.
 */
export function PanalDeHoy({ llenas, meta, descripcion, className }) {
  const { centros, ancho, alto } = panalDe(meta);
  const puntos = puntosDeHexagono(RADIO_DEL_PANAL);

  return (
    <svg
      className={clases(estilos.panalDeHoy, className)}
      role={descripcion ? "img" : undefined}
      aria-label={descripcion || undefined}
      aria-hidden={descripcion ? undefined : "true"}
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
