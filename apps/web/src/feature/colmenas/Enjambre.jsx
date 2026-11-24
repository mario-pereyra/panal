import estilos from "./Enjambre.module.css";

export function Enjambre({ children }) {
  return (
    <ul className={estilos.enjambre} role="list">
      {children}
    </ul>
  );
}

export function Abeja({ abeja, detalle, accion, children }) {
  return (
    <li className={estilos.abeja}>
      <span className={estilos.avatar} style={{ background: abeja.color }} aria-hidden="true">
        {abeja.inicial}
      </span>
      <span className={estilos.nombre}>
        {abeja.nombre}
        {children}
      </span>
      <span className={estilos.detalle}>{detalle}</span>
      {accion && <span className={estilos.accion}>{accion}</span>}
    </li>
  );
}
