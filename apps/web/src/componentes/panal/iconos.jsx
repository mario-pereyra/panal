import { puntosDeHexagono } from "../ui/hexagono.js";
import { TRAZO } from "../ui/iconos.jsx";

/**
 * Los iconos de la marca y de la navegación. Los de navegación se rellenan de
 * miel (`lleno`) en la sección en la que se está.
 */

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

export function IconoHoy({ lleno = false, ...props }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={lleno ? "var(--miel)" : "none"}
      {...TRAZO}
      {...props}
    >
      <polygon points={puntosDeHexagono(9.5)} transform="translate(12 12)" />
      <path d="M8 12 l3 3.2 l5 -6" fill="none" />
    </svg>
  );
}

export function IconoCeldas({ lleno = false, ...props }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={lleno ? "var(--miel)" : "none"}
      {...TRAZO}
      {...props}
    >
      <polygon points={puntosDeHexagono(4.8)} transform="translate(7.6 7.4)" />
      <polygon points={puntosDeHexagono(4.8)} transform="translate(16.4 7.4)" />
      <polygon points={puntosDeHexagono(4.8)} transform="translate(12 15.6)" />
    </svg>
  );
}

export function IconoColmenas({ lleno = false, ...props }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={lleno ? "var(--miel)" : "none"}
      {...TRAZO}
      {...props}
    >
      <rect x="7" y="3" width="10" height="5.5" rx="2.75" />
      <rect x="4" y="8.5" width="16" height="6" rx="3" />
      <rect x="5.5" y="14.5" width="13" height="6.5" rx="3" />
    </svg>
  );
}

export function IconoReportes({ lleno = false, ...props }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={lleno ? "var(--miel)" : "none"}
      {...TRAZO}
      {...props}
    >
      <rect x="3.5" y="12" width="4.6" height="8.5" rx="1.6" />
      <rect x="9.7" y="4" width="4.6" height="16.5" rx="1.6" />
      <rect x="15.9" y="8.5" width="4.6" height="12" rx="1.6" />
    </svg>
  );
}
