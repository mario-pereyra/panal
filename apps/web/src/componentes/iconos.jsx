import { puntosDeHexagono } from "./hexagono.js";

/**
 * Los iconos de Panal, dibujados en SVG. Todos son decorativos: el texto que
 * los acompaña es el que nombra las cosas.
 */

const TRAZO = {
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinejoin: "round",
  strokeLinecap: "round",
};

/** El hexágono de miel de la marca. */
export function LogoPanal(props) {
  return (
    <svg aria-hidden="true" width="36" height="40" viewBox="-20 -22 40 44" {...props}>
      <polygon
        points={puntosDeHexagono(18)}
        fill="var(--miel)"
        stroke="var(--tinta)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Una gota de miel: la racha y las gotas. */
export function IconoGota(props) {
  return (
    <svg aria-hidden="true" width="18" height="20" viewBox="0 0 16 18" {...props}>
      <path
        d="M8 1.5 C8 1.5 2.5 8 2.5 11.5 A5.5 5.5 0 0 0 13.5 11.5 C13.5 8 8 1.5 8 1.5 Z"
        fill="var(--miel)"
        stroke="var(--tinta)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Un tarro: las reservas de miel. */
export function IconoTarro(props) {
  return (
    <svg aria-hidden="true" width="18" height="20" viewBox="0 0 18 20" {...props}>
      <path
        d="M4.5 6.5 h9 c1.7 0.9 2.7 2.4 2.7 4.3 v4 a3.2 3.2 0 0 1 -3.2 3.2 h-8 a3.2 3.2 0 0 1 -3.2 -3.2 v-4 c0 -1.9 1 -3.4 2.7 -4.3 Z"
        fill="var(--miel)"
        stroke="var(--tinta)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <rect
        x="3.6"
        y="1.8"
        width="10.8"
        height="4.2"
        rx="1.6"
        fill="var(--ala)"
        stroke="var(--tinta)"
        strokeWidth="1.8"
      />
    </svg>
  );
}

/** Hoy: una celda. */
export function IconoHoy(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="var(--relleno, none)" {...TRAZO} {...props}>
      <polygon points={puntosDeHexagono(9.5)} transform="translate(12 12)" />
      <path d="M8 12 l3 3.2 l5 -6" fill="none" />
    </svg>
  );
}

/** Celdas: tres celdas juntas. */
export function IconoCeldas(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="var(--relleno, none)" {...TRAZO} {...props}>
      <polygon points={puntosDeHexagono(4.8)} transform="translate(7.6 7.4)" />
      <polygon points={puntosDeHexagono(4.8)} transform="translate(16.4 7.4)" />
      <polygon points={puntosDeHexagono(4.8)} transform="translate(12 15.6)" />
    </svg>
  );
}

/** Colmenas: una colmena de tres franjas. */
export function IconoColmenas(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="var(--relleno, none)" {...TRAZO} {...props}>
      <rect x="7" y="3" width="10" height="5.5" rx="2.75" />
      <rect x="4" y="8.5" width="16" height="6" rx="3" />
      <rect x="5.5" y="14.5" width="13" height="6.5" rx="3" />
    </svg>
  );
}

/** Reportes: tres columnas. */
export function IconoReportes(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="var(--relleno, none)" {...TRAZO} {...props}>
      <rect x="3.5" y="12" width="4.6" height="8.5" rx="1.6" />
      <rect x="9.7" y="4" width="4.6" height="16.5" rx="1.6" />
      <rect x="15.9" y="8.5" width="4.6" height="12" rx="1.6" />
    </svg>
  );
}

/** Crear: un signo más. */
export function IconoMas(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...TRAZO} strokeWidth="3" {...props}>
      <path d="M12 5 v14 M5 12 h14" />
    </svg>
  );
}

/** Cerrar: una equis. */
export function IconoCerrar(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...TRAZO} strokeWidth="2.6" {...props}>
      <path d="M6 6 l12 12 M18 6 l-12 12" />
    </svg>
  );
}

/** Más acciones: tres puntos. */
export function IconoAcciones(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="5.5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="18.5" cy="12" r="2" />
    </svg>
  );
}

/** Mostrar u ocultar la contraseña: un ojo, tachado si está oculta. */
export function IconoOjo({ tachado = false, ...props }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...TRAZO} {...props}>
      <path d="M2.5 12 C5 7 8.5 5 12 5 C15.5 5 19 7 21.5 12 C19 17 15.5 19 12 19 C8.5 19 5 17 2.5 12 Z" />
      <circle cx="12" cy="12" r="3" />
      {tachado && <path d="M4 20 L20 4" />}
    </svg>
  );
}

/** Volver: una flecha hacia la izquierda. */
export function IconoVolver(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...TRAZO} strokeWidth="2.4" {...props}>
      <path d="M19 12 H5 M11 6 l-6 6 l6 6" />
    </svg>
  );
}

/** Copiar: dos hojas. */
export function IconoCopiar(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...TRAZO} {...props}>
      <rect x="8" y="8" width="12" height="12" rx="2.5" />
      <path d="M16 8 V6.5 A2.5 2.5 0 0 0 13.5 4 H6.5 A2.5 2.5 0 0 0 4 6.5 V13.5 A2.5 2.5 0 0 0 6.5 16 H8" />
    </svg>
  );
}

/** Compartir: una caja con una flecha que sale. */
export function IconoCompartir(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...TRAZO} {...props}>
      <path d="M12 3 V15 M7 8 l5 -5 l5 5" />
      <path d="M5 12 V18.5 A2.5 2.5 0 0 0 7.5 21 H16.5 A2.5 2.5 0 0 0 19 18.5 V12" />
    </svg>
  );
}

/** Sin conexión: una nube tachada. */
export function IconoSinRed(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...TRAZO} {...props}>
      <path d="M7 18 H17.5 A4 4 0 0 0 18 10 A6 6 0 0 0 6.6 9 A4.5 4.5 0 0 0 7 18 Z" />
      <path d="M4 4 L20 20" />
    </svg>
  );
}
