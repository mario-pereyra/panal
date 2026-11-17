import estilos from "./Pagina.module.css";

/**
 * Encabezado de una pantalla de la aplicación: el título, una línea de apoyo y
 * sus acciones. También fija el título de la pestaña del navegador.
 *
 * @param {object} props
 * @param {string} props.titulo
 * @param {import("react").ReactNode} [props.antes] Lo que va sobre el título, como "Volver".
 * @param {import("react").ReactNode} [props.nota]
 * @param {import("react").ReactNode} [props.acciones]
 */
export function Pagina({ titulo, antes, nota, acciones, children }) {
  return (
    <div className={estilos.pagina}>
      <title>{`${titulo} · Panal`}</title>
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

/** Rejilla de tarjetas: una, dos o tres columnas, según quepan tarjetas de al menos 340 px. */
export function Rejilla({ children }) {
  return <div className={estilos.rejilla}>{children}</div>;
}
