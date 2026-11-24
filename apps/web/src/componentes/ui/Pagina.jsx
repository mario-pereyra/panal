import { clases } from "../../lib/clases.js";
import estilos from "./Pagina.module.css";
import { tituloDePestana } from "./textos.js";

/**
 * Encabezado de una pantalla de la aplicación: el título, una línea de apoyo y
 * sus acciones. También fija el título de la pestaña del navegador.
 *
 * @param {object} props
 * @param {import("react").ReactNode} [props.antes] Lo que va sobre el título, como "Volver".
 */
export function Pagina({ titulo, antes, nota, acciones, children }) {
  return (
    <div className={estilos.pagina}>
      <TituloDePestana>{titulo}</TituloDePestana>
      <header className={estilos.encabezado}>
        <div className={estilos.titulos}>
          {antes}
          <h1 className={estilos.titulo}>{titulo}</h1>
          {nota && <p className={estilos.nota}>{nota}</p>}
        </div>
        {acciones && <div className={estilos.acciones}>{acciones}</div>}
      </header>
      {children}
    </div>
  );
}

/** El título de la pestaña del navegador: React lo lleva al `head`. */
export function TituloDePestana({ children }) {
  return <title>{tituloDePestana(children)}</title>;
}

/**
 * El contenido principal de la página. Es el destino de "Saltar al contenido"
 * y adonde vuelve el foco cuando se cierra un aviso que lo tenía: por eso
 * acepta el foco (`tabIndex` -1) aunque no se llegue a él con el tabulador.
 */
export function Principal({ className, children }) {
  return (
    <main id="contenido" className={clases(estilos.principal, className)} tabIndex={-1}>
      {children}
    </main>
  );
}
