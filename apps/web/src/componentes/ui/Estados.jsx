import { Component, useId } from "react";
import { Boton } from "./Controles.jsx";
import estilos from "./Estados.module.css";
import { IconoCerrar } from "./iconos.jsx";
import { CERRAR_AVISO, PANTALLA_CON_ERROR, REINTENTAR, REVISA_LA_CONEXION } from "./textos.js";

/**
 * Los estados que toda pantalla resuelve (docs/proyecto/03-pantallas.md,
 * sección 5): cargando, error al cargar y franjas informativas. El vacío, con
 * su dibujo, está en `componentes/panal/EstadoVacio.jsx`.
 */

/**
 * Silueta de una pantalla mientras llega la primera respuesta. Aparece solo si
 * la carga tarda más de 200 ms: una carga rápida no deja ver nada.
 *
 * @param {object} props
 * @param {string} props.etiqueta Lo que oye el lector de pantalla: "Cargando tus celdas".
 * @param {number[]} props.bloques Alto de cada bloque, en píxeles.
 */
export function Silueta({ etiqueta, bloques }) {
  return (
    <div className={estilos.silueta} role="status">
      <span className="solo-lectores">{etiqueta}</span>
      {bloques.map((alto, indice) => (
        <div key={indice} className={estilos.bloque} style={{ minBlockSize: `${alto}px` }} />
      ))}
    </div>
  );
}

/** Una tarjeta con la explicación y "Reintentar". El resto de la pantalla sigue funcionando. */
export function ErrorAlCargar({ titulo, alReintentar, children }) {
  const idDelTitulo = useId();
  return (
    <section className={estilos.error} aria-labelledby={idDelTitulo}>
      <h2 id={idDelTitulo} className={estilos.tituloDeError}>
        {titulo}
      </h2>
      <p>{children ?? REVISA_LA_CONEXION}</p>
      {alReintentar && <Boton onClick={alReintentar}>{REINTENTAR}</Boton>}
    </section>
  );
}

/**
 * Franja informativa sobre el contenido, como "Ayer usaste una reserva".
 *
 * @param {object} props
 * @param {"cera" | "ala"} [props.tono]
 * @param {() => void} [props.alCerrar] Si se puede cerrar.
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
          aria-label={CERRAR_AVISO}
        >
          <IconoCerrar />
        </button>
      )}
    </div>
  );
}

/**
 * Atrapa el error de una pantalla, como una descarga que no llegó, y pone en
 * su lugar "Reintentar", que recarga la página. La cabecera y la navegación
 * siguen en pie. Una vez atrapado, el error se queda: para empezar de cero al
 * cambiar de pantalla, quien lo usa le da otra `key` (Estructura usa la ruta).
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
    return <ErrorAlCargar titulo={PANTALLA_CON_ERROR} alReintentar={() => location.reload()} />;
  }
}
