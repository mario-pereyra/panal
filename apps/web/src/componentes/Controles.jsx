import { Link } from "react-router";
import estilos from "./Controles.module.css";

/**
 * Botón principal. Con `a` es un enlace que lleva a otra pantalla; sin `a`,
 * un botón que hace algo aquí mismo.
 *
 * @param {object} props
 * @param {string} [props.a] Ruta de destino.
 * @param {object} [props.estado] Estado que viaja con la navegación (por ejemplo, la pantalla de fondo).
 * @param {"tinta" | "claro" | "miel" | "peligro" | "sutil"} [props.tono]
 * @param {"normal" | "chico"} [props.tamano]
 */
export function Boton({
  a,
  estado,
  tono = "tinta",
  tamano = "normal",
  className,
  children,
  ...resto
}) {
  const clase = [estilos.boton, estilos[tono], tamano === "chico" && estilos.chico, className]
    .filter(Boolean)
    .join(" ");
  if (a) {
    return (
      <Link to={a} state={estado} className={clase} {...resto}>
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
