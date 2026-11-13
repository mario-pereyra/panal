import { useId } from "react";
import { CasillaHexagonal } from "./CasillaHexagonal.jsx";
import estilos from "./FilaDeCelda.module.css";

/**
 * La fila de una actividad en una lista: su casilla, su título, de qué tipo es
 * y las gotas que vale.
 *
 * @param {object} props
 * @param {string} props.titulo
 * @param {string} props.detalle Por ejemplo "Recurrente · diaria".
 * @param {number} props.gotas
 * @param {boolean} props.llena
 * @param {boolean} [props.vencida]
 * @param {(llena: boolean) => void} props.alCambiar
 */
export function FilaDeCelda({ titulo, detalle, gotas, llena, vencida = false, alCambiar }) {
  const idDelTitulo = useId();
  const idDelDetalle = useId();

  return (
    <li className={estilos.fila} data-llena={llena ? "" : undefined}>
      <CasillaHexagonal
        llena={llena}
        alCambiar={alCambiar}
        nombradaPor={idDelTitulo}
        descritaPor={idDelDetalle}
      />
      <div className={estilos.textos}>
        <span id={idDelTitulo} className={estilos.titulo}>
          {titulo}
        </span>
        <span id={idDelDetalle} className={estilos.detalle}>
          {detalle}
          {vencida && <span className={estilos.vencida}>Vencida</span>}
        </span>
      </div>
      <span className={estilos.gotas}>
        +{gotas}
        <span className="solo-lectores"> gotas</span>
      </span>
    </li>
  );
}
