import { Link } from "react-router";
import estilos from "./Controles.module.css";

/**
 * Botón principal. Con `a` es un enlace que lleva a otra pantalla; sin `a`,
 * un botón que hace algo aquí mismo.
 *
 * @param {object} props
 * @param {string} [props.a] Ruta de destino.
 * @param {"tinta" | "claro"} [props.tono]
 */
export function Boton({ a, tono = "tinta", className, children, ...resto }) {
  const clase = [estilos.boton, estilos[tono], className].filter(Boolean).join(" ");
  if (a) {
    return (
      <Link to={a} className={clase} {...resto}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={clase} {...resto}>
      {children}
    </button>
  );
}

/**
 * Ficha: un dato corto con su icono, como la racha o las reservas.
 *
 * @param {object} props
 * @param {import("react").ReactNode} [props.icono]
 */
export function Ficha({ icono, className, children }) {
  return (
    <span className={[estilos.ficha, className].filter(Boolean).join(" ")}>
      {icono}
      {children}
    </span>
  );
}
