import { useId } from "react";
import { clases } from "../../lib/clases.js";
import { EnlaceAVentana } from "../ui/Controles.jsx";
import { puntosDeHexagono } from "../ui/hexagono.js";
import estilos from "./FilaDeCelda.module.css";
import { GOTAS, PRIORIDAD_ALTA, VENCIDA } from "./textos.js";

/**
 * La fila de una actividad en una lista: su casilla, su título, de qué tipo es
 * y las gotas que vale.
 *
 * La casilla es una casilla de verificación de verdad: funciona con teclado,
 * con lectores de pantalla y con el dedo; el hexágono es solo su aspecto. Sin
 * `alCambiar` es solo un dibujo: la actividad no se puede llenar desde esa
 * lista (por ejemplo, una que toca otro día).
 *
 * @param {object} props
 * @param {string} props.detalle Por ejemplo "Recurrente · diaria".
 * @param {boolean} [props.alta] Prioridad alta.
 * @param {boolean} [props.deshabilitada] La casilla no se puede tocar ahora (por ejemplo, sin red).
 * @param {import("react").ReactNode} [props.extra] Una línea más, como la cuota de la semana.
 * @param {import("react").ReactNode} [props.menu] El botón de acciones de la fila.
 * @param {string} [props.abrir] Si se puede editar: el título abre la celda en una ventana.
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
  abrir,
}) {
  const idDelTitulo = useId();
  const idDelDetalle = useId();

  return (
    <li className={estilos.fila} data-llena={llena ? "" : undefined}>
      {alCambiar ? (
        <label className={estilos.casilla}>
          <input
            className={estilos.control}
            type="checkbox"
            checked={llena}
            disabled={deshabilitada}
            onChange={(evento) => alCambiar(evento.target.checked)}
            aria-labelledby={idDelTitulo}
            aria-describedby={idDelDetalle}
          />
          <svg className={estilos.dibujo} aria-hidden="true" viewBox="-22 -22 44 44">
            <polygon className={estilos.celda} points={puntosDeHexagono(18)} />
            <path className={estilos.marca} d="M-7 0 l5 6 l9 -11" pathLength="1" />
          </svg>
        </label>
      ) : (
        <svg className={estilos.hexagono} viewBox="-22 -22 44 44" aria-hidden="true">
          <polygon points={puntosDeHexagono(16)} />
        </svg>
      )}
      <div className={estilos.textos}>
        {abrir ? (
          <EnlaceAVentana
            to={abrir}
            id={idDelTitulo}
            className={clases(estilos.titulo, estilos.enlace)}
          >
            {titulo}
          </EnlaceAVentana>
        ) : (
          <span id={idDelTitulo} className={estilos.titulo}>
            {titulo}
          </span>
        )}
        <span id={idDelDetalle} className={estilos.detalle}>
          {detalle}
          {alta && <span className={estilos.etiqueta}>{PRIORIDAD_ALTA}</span>}
          {vencida && <span className={estilos.etiqueta}>{VENCIDA}</span>}
        </span>
        {extra}
      </div>
      {gotas != null && (
        <span className={estilos.gotas}>
          +{gotas}
          <span className="solo-lectores">{GOTAS}</span>
        </span>
      )}
      {menu}
    </li>
  );
}
