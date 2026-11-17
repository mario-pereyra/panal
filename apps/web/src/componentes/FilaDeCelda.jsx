import { useId } from "react";
import { CasillaHexagonal } from "./CasillaHexagonal.jsx";
import estilos from "./FilaDeCelda.module.css";
import { puntosDeHexagono } from "./hexagono.js";

/**
 * La fila de una actividad en una lista: su casilla, su título, de qué tipo es
 * y las gotas que vale.
 *
 * Sin `alCambiar`, la casilla es solo un dibujo: la actividad no se puede
 * llenar desde esa lista (por ejemplo, una que toca otro día).
 *
 * @param {object} props
 * @param {string} props.titulo
 * @param {string} props.detalle Por ejemplo "Recurrente · diaria".
 * @param {number | null} [props.gotas]
 * @param {boolean} props.llena
 * @param {boolean} [props.vencida]
 * @param {boolean} [props.alta] Prioridad alta.
 * @param {boolean} [props.deshabilitada] La casilla no se puede tocar ahora (por ejemplo, sin red).
 * @param {(llena: boolean) => void} [props.alCambiar]
 * @param {import("react").ReactNode} [props.extra] Una línea más, como la cuota de la semana.
 * @param {import("react").ReactNode} [props.menu] El botón de acciones de la fila.
 */
export function FilaDeCelda({
  titulo,
  detalle,
  gotas = null,
  llena,
  vencida = false,
  alta = false,
  deshabilitada = false,
  alCambiar,
  extra,
  menu,
}) {
  const idDelTitulo = useId();
  const idDelDetalle = useId();

  return (
    <li className={estilos.fila} data-llena={llena ? "" : undefined}>
      {alCambiar ? (
        <CasillaHexagonal
          llena={llena}
          alCambiar={alCambiar}
          nombradaPor={idDelTitulo}
          descritaPor={idDelDetalle}
          deshabilitada={deshabilitada}
        />
      ) : (
        <svg className={estilos.hexagono} viewBox="-22 -22 44 44" aria-hidden="true">
          <polygon points={puntosDeHexagono(16)} />
        </svg>
      )}
      <div className={estilos.textos}>
        <span id={idDelTitulo} className={estilos.titulo}>
          {titulo}
        </span>
        <span id={idDelDetalle} className={estilos.detalle}>
          {detalle}
          {alta && <span className={estilos.etiqueta}>Prioridad alta</span>}
          {vencida && <span className={estilos.etiqueta}>Vencida</span>}
        </span>
        {extra}
      </div>
      {gotas != null && (
        <span className={estilos.gotas}>
          +{gotas}
          <span className="solo-lectores"> gotas</span>
        </span>
      )}
      {menu}
    </li>
  );
}
