import { puntosDeHexagono } from "./hexagono.js";
import estilos from "./CasillaHexagonal.module.css";

/**
 * La casilla con la que se llena una celda.
 *
 * Por dentro es una casilla de verificación de verdad: funciona con teclado,
 * con lectores de pantalla y con el dedo. El hexágono es solo su aspecto.
 *
 * @param {object} props
 * @param {boolean} props.llena
 * @param {(llena: boolean) => void} props.alCambiar
 * @param {string} props.nombradaPor Identificador del elemento que le da nombre (el título).
 * @param {string} [props.descritaPor] Identificador del elemento que la describe.
 */
export function CasillaHexagonal({ llena, alCambiar, nombradaPor, descritaPor }) {
  return (
    <label className={estilos.casilla}>
      <input
        className={estilos.control}
        type="checkbox"
        checked={llena}
        onChange={(evento) => alCambiar(evento.target.checked)}
        aria-labelledby={nombradaPor}
        aria-describedby={descritaPor}
      />
      <svg className={estilos.dibujo} aria-hidden="true" viewBox="-22 -22 44 44">
        <polygon className={estilos.celda} points={puntosDeHexagono(18)} />
        <path className={estilos.marca} d="M-7 0 l5 6 l9 -11" pathLength="1" />
      </svg>
    </label>
  );
}
