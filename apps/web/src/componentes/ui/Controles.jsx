import { Link } from "react-router";
import { clases } from "../../lib/clases.js";
import estilos from "./Controles.module.css";
import { useFondo } from "./useFondo.js";

/**
 * Botón principal. Con `a` es un enlace que lleva a otra pantalla; sin `a`,
 * un botón que hace algo aquí mismo. Con `ventana`, el enlace abre una ventana
 * con ruta propia sobre la pantalla actual.
 *
 * @param {{ tono?: "tinta" | "claro" | "peligro" | "sutil", tamano?: "normal" | "chico" } & Record<string, any>} props
 */
export function Boton({
  a,
  ventana = false,
  tono = "tinta",
  tamano = "normal",
  className,
  children,
  ...resto
}) {
  const clase = clases(
    estilos.boton,
    estilos[tono],
    tamano === "chico" && estilos.chico,
    className,
  );
  if (a) {
    const Enlace = ventana ? EnlaceAVentana : Link;
    return (
      <Enlace to={a} className={clase} {...resto}>
        {children}
      </Enlace>
    );
  }
  return (
    <button type="button" className={clase} {...resto}>
      {children}
    </button>
  );
}

/** Un enlace que abre una ventana con ruta propia y deja de fondo la pantalla actual. */
export function EnlaceAVentana(props) {
  const { fondo } = useFondo();
  return <Link state={{ fondo }} {...props} />;
}

/** Un dato corto con su icono, como la racha o las reservas. */
export function Ficha({ icono, className, children }) {
  return (
    <span className={clases(estilos.ficha, className)}>
      {icono}
      {children}
    </span>
  );
}

/**
 * Lo que dice que algo espera a que vuelva la red, junto al control que no se
 * puede usar. Con `recuadro`, destacado, como en las pantallas de acceso.
 */
export function AvisoSinConexion({ recuadro = false, className, children }) {
  return (
    <p className={clases(estilos.sinConexion, recuadro && estilos.recuadro, className)}>
      {children}
    </p>
  );
}
