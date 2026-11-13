import { useId } from "react";
import { Link } from "react-router";
import estilos from "./Tarjeta.module.css";

/**
 * Tarjeta: fondo blanco, borde de tinta y sombra dura.
 *
 * Con `a`, el título es un enlace y toda la tarjeta se puede tocar para ir a
 * ese destino; los controles que tenga dentro siguen funcionando por separado.
 *
 * @param {object} props
 * @param {string} props.titulo
 * @param {import("react").ReactNode} [props.dato] Cifra que acompaña al título, a la derecha.
 * @param {string} [props.nota] Línea de apoyo bajo el título.
 * @param {string} [props.a] Ruta a la que lleva la tarjeta.
 */
export function Tarjeta({ titulo, dato, nota, a, className, children }) {
  const idDelTitulo = useId();
  return (
    <article
      className={[estilos.tarjeta, className].filter(Boolean).join(" ")}
      aria-labelledby={idDelTitulo}
    >
      <header className={estilos.cabeza}>
        <h2 id={idDelTitulo} className={estilos.titulo}>
          {a ? (
            <Link to={a} className={estilos.enlace}>
              {titulo}
            </Link>
          ) : (
            titulo
          )}
        </h2>
        {dato != null && <span className={estilos.dato}>{dato}</span>}
      </header>
      {nota && <p className={estilos.nota}>{nota}</p>}
      {children}
    </article>
  );
}
