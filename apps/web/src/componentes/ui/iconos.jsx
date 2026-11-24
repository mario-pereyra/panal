/**
 * Iconos genéricos, dibujados en SVG. Todos son decorativos: el texto que los
 * acompaña es el que nombra las cosas. Los de la marca y la navegación están
 * en `componentes/panal/iconos.jsx`.
 */

export const TRAZO = {
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinejoin: "round",
  strokeLinecap: "round",
};

export function IconoMas(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...TRAZO} strokeWidth="3" {...props}>
      <path d="M12 5 v14 M5 12 h14" />
    </svg>
  );
}

export function IconoCerrar(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...TRAZO} strokeWidth="2.6" {...props}>
      <path d="M6 6 l12 12 M18 6 l-12 12" />
    </svg>
  );
}

export function IconoAcciones(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="5.5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="18.5" cy="12" r="2" />
    </svg>
  );
}

/** Un ojo, tachado si la contraseña está oculta. */
export function IconoOjo({ tachado = false, ...props }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...TRAZO} {...props}>
      <path d="M2.5 12 C5 7 8.5 5 12 5 C15.5 5 19 7 21.5 12 C19 17 15.5 19 12 19 C8.5 19 5 17 2.5 12 Z" />
      <circle cx="12" cy="12" r="3" />
      {tachado && <path d="M4 20 L20 4" />}
    </svg>
  );
}

export function IconoVolver(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...TRAZO} strokeWidth="2.4" {...props}>
      <path d="M19 12 H5 M11 6 l-6 6 l6 6" />
    </svg>
  );
}

export function IconoCopiar(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...TRAZO} {...props}>
      <rect x="8" y="8" width="12" height="12" rx="2.5" />
      <path d="M16 8 V6.5 A2.5 2.5 0 0 0 13.5 4 H6.5 A2.5 2.5 0 0 0 4 6.5 V13.5 A2.5 2.5 0 0 0 6.5 16 H8" />
    </svg>
  );
}

export function IconoCompartir(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...TRAZO} {...props}>
      <path d="M12 3 V15 M7 8 l5 -5 l5 5" />
      <path d="M5 12 V18.5 A2.5 2.5 0 0 0 7.5 21 H16.5 A2.5 2.5 0 0 0 19 18.5 V12" />
    </svg>
  );
}

export function IconoSinRed(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...TRAZO} {...props}>
      <path d="M7 18 H17.5 A4 4 0 0 0 18 10 A6 6 0 0 0 6.6 9 A4.5 4.5 0 0 0 7 18 Z" />
      <path d="M4 4 L20 20" />
    </svg>
  );
}
