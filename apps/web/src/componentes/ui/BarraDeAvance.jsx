import estilos from "./BarraDeAvance.module.css";

/**
 * Barra de avance hacia una meta. Es decorativa: el texto que la acompaña dice la cifra.
 * @param {{ avance: number, color?: string }} props `avance` de 0 a 1; sin `color`, miel.
 */
export function BarraDeAvance({ avance, color }) {
  const ancho = `${Math.round(Math.min(1, Math.max(0, avance)) * 100)}%`;
  return (
    <span className={estilos.barra} aria-hidden="true">
      <span style={{ inlineSize: ancho, background: color }} />
    </span>
  );
}
