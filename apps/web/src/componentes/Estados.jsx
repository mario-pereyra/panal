import { Component } from "react";
import { Boton } from "./Controles.jsx";
import estilos from "./Estados.module.css";
import { puntosDeHexagono } from "./hexagono.js";
import { IconoCerrar } from "./iconos.jsx";

/**
 * Los estados que toda pantalla resuelve (docs/proyecto/03-pantallas.md,
 * sección 5): vacío, cargando, error al cargar y franjas informativas.
 */

/**
 * Panal sin miel: tres celdas vacías y una flor. Es el dibujo de los estados
 * vacíos; nunca una Zum triste.
 */
export function PanalVacio({ className }) {
  const celda = puntosDeHexagono(26);
  return (
    <svg
      className={[estilos.dibujo, className].filter(Boolean).join(" ")}
      viewBox="0 0 160 110"
      aria-hidden="true"
    >
      <g className={estilos.celdaVacia}>
        <polygon points={celda} transform="translate(52 36)" />
        <polygon points={celda} transform="translate(100 36)" />
        <polygon points={celda} transform="translate(76 77)" />
      </g>
      <g className={estilos.flor} transform="translate(136 88)">
        <path d="M0 18 V2" />
        {[0, 72, 144, 216, 288].map((giro) => (
          <ellipse key={giro} cx="0" cy="-7" rx="4.5" ry="6.5" transform={`rotate(${giro})`} />
        ))}
        <circle r="3.5" />
      </g>
    </svg>
  );
}

/**
 * Vacío: el dibujo, una frase y la acción que lo resuelve.
 *
 * @param {object} props
 * @param {string} props.frase
 * @param {import("react").ReactNode} [props.accion]
 */
export function EstadoVacio({ frase, accion }) {
  return (
    <div className={estilos.vacio}>
      <PanalVacio />
      <p className={estilos.frase}>{frase}</p>
      {accion}
    </div>
  );
}

/**
 * Silueta de una pantalla mientras llega la primera respuesta. Aparece solo si
 * la carga tarda más de 200 ms: una carga rápida no deja ver nada.
 *
 * @param {object} props
 * @param {string} props.etiqueta Lo que oye el lector de pantalla: "Cargando tus celdas".
 * @param {number[]} [props.bloques] Alto de cada bloque, en píxeles.
 */
export function Silueta({ etiqueta, bloques = [180, 320, 320] }) {
  return (
    <div className={estilos.silueta} role="status">
      <span className="solo-lectores">{etiqueta}</span>
      {bloques.map((alto, indice) => (
        <div key={indice} className={estilos.bloque} style={{ minBlockSize: `${alto}px` }} />
      ))}
    </div>
  );
}

/**
 * Error al cargar: una tarjeta con la explicación y "Reintentar". El resto de
 * la pantalla sigue funcionando.
 */
export function ErrorAlCargar({ titulo = "No pudimos traer tus celdas", alReintentar, children }) {
  return (
    <section className={estilos.error} aria-labelledby="error-al-cargar">
      <h2 id="error-al-cargar" className={estilos.tituloDeError}>
        {titulo}
      </h2>
      <p>{children ?? "Tu panal sigue a salvo. Revisa tu conexión y vuelve a intentarlo."}</p>
      {alReintentar && <Boton onClick={alReintentar}>Reintentar</Boton>}
    </section>
  );
}

/**
 * Franja informativa sobre el contenido, como "Ayer usaste una reserva".
 *
 * @param {object} props
 * @param {"cera" | "ala" | "coral"} [props.tono]
 * @param {() => void} [props.alCerrar] Si se puede cerrar.
 * @param {import("react").ReactNode} [props.icono]
 * @param {{ etiqueta: string, alPulsar: () => void }} [props.accion] Un botón al final.
 */
export function FranjaDeEstado({ tono = "cera", alCerrar, icono, accion, children }) {
  return (
    <div className={estilos.franja} data-tono={tono}>
      {icono}
      <p className={estilos.textoDeFranja}>{children}</p>
      {accion && (
        <button type="button" className={estilos.accionDeFranja} onClick={accion.alPulsar}>
          {accion.etiqueta}
        </button>
      )}
      {alCerrar && (
        <button
          type="button"
          className={estilos.cerrarFranja}
          onClick={alCerrar}
          aria-label="Cerrar este aviso"
        >
          <IconoCerrar />
        </button>
      )}
    </div>
  );
}

/**
 * Atrapa el error de una pantalla, como una descarga que no llegó, y pone en
 * su lugar "Reintentar". La cabecera y la navegación siguen en pie. Para
 * reiniciarlo al cambiar de pantalla, se le da otra `key`.
 */
export class LimiteDeError extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <ErrorAlCargar
        titulo="No pudimos abrir esta pantalla"
        alReintentar={() => location.reload()}
      />
    );
  }
}
