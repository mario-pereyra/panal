import { OFICIOS } from "@panal/motor";
import { puntosDeHexagono } from "../ui/hexagono.js";
import estilos from "./EscaleraDeOficios.module.css";

/**
 * La escalera de oficios: diez celdas, llenas hasta el oficio actual.
 * @param {{ nivel: number, descripcion: string }} props `nivel` de 1 a 10.
 */
export function EscaleraDeOficios({ nivel, descripcion }) {
  const radio = 17;
  const paso = 34;
  const puntos = puntosDeHexagono(radio);
  return (
    <svg
      className={estilos.escalera}
      role="img"
      aria-label={descripcion}
      viewBox={`0 0 ${paso * OFICIOS.length + 8} 66`}
    >
      {Array.from({ length: OFICIOS.length }, (_, indice) => {
        const peldano = indice + 1;
        const x = 4 + paso * indice + paso / 2;
        // Cada oficio sube un poco: una escalera, no una fila.
        const y = 46 - indice * 2.4;
        return (
          <g key={peldano} transform={`translate(${x} ${y})`}>
            <polygon
              className={estilos.peldano}
              data-estado={peldano < nivel ? "lleno" : peldano === nivel ? "actual" : "pendiente"}
              points={puntos}
            />
            <text className={estilos.numeroDePeldano} y="4.5">
              {peldano}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
