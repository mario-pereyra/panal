import { puntosDeHexagono } from "../ui/hexagono.js";
import estilos from "./EstadoVacio.module.css";

/**
 * Vacío: el dibujo, una frase y la acción que lo resuelve. El dibujo es un
 * panal sin miel con una flor; nunca una Zum triste.
 *
 * @param {{ frase: string, accion?: import("react").ReactNode }} props
 */
export function EstadoVacio({ frase, accion }) {
  const celda = puntosDeHexagono(26);
  return (
    <div className={estilos.vacio}>
      <svg className={estilos.dibujo} viewBox="0 0 160 110" aria-hidden="true">
        <g className={estilos.celdaVacia}>
          <polygon points={celda} transform="translate(52 36)" />
          <polygon points={celda} transform="translate(100 36)" />
          <polygon points={celda} transform="translate(76 77)" />
        </g>
        <g className={estilos.flor} transform="translate(136 88)">
          <path d="M0 18 V2" />
          {[0, 72, 144, 216, 288].map((giro) => (
            <ellipse key={giro} cx="0" cy="-7" rx="4.5" ry="6.5" transform={`rotate(${giro})`} />
          ))}
          <circle r="3.5" />
        </g>
      </svg>
      <p className={estilos.frase}>{frase}</p>
      {accion}
    </div>
  );
}
