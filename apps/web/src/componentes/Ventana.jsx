import { createContext, use, useEffect, useEffectEvent, useId, useRef } from "react";
import { IconoCerrar } from "./iconos.jsx";
import estilos from "./Ventana.module.css";

/**
 * Ventana sobre la pantalla: el elemento nativo `dialog`, abierto como modal.
 *
 * El navegador vuelve inerte el resto de la página, encierra el foco, cierra
 * con Escape o con el gesto Atrás y devuelve el foco al control que la abrió.
 * Aquí solo se elige el aspecto: centrada desde tableta, hoja que sube desde
 * abajo en teléfono (o la pantalla entera, con `tamano="completa"`).
 *
 * Cerrar siempre pasa por `dialog.close()`, así el foco vuelve a su lugar; el
 * evento `close` avisa con `alCerrar`.
 *
 * @param {object} props
 * @param {string} props.titulo
 * @param {() => void} props.alCerrar Se llama al cerrarse, por cualquier vía.
 * @param {(evento: Event) => void} [props.antesDeCerrar] Escape, Atrás o tocar fuera.
 *   Puede llamar a `evento.preventDefault()` para que la ventana siga abierta.
 * @param {boolean} [props.cerrarAlTocarFuera]
 * @param {"normal" | "completa"} [props.tamano]
 * @param {string} [props.descripcion] Línea bajo el título.
 * @param {import("react").ReactNode} [props.pie] Botones al pie, siempre a la vista.
 */
export function Ventana({
  titulo,
  alCerrar,
  antesDeCerrar,
  cerrarAlTocarFuera = false,
  tamano = "normal",
  descripcion,
  pie,
  children,
}) {
  const ref = useRef(/** @type {HTMLDialogElement | null} */ (null));
  const idDelTitulo = useId();
  const idDeLaDescripcion = useId();
  const cerrar = () => ref.current?.close();

  useEffect(() => {
    const dialogo = ref.current;
    if (dialogo && !dialogo.open) dialogo.showModal();
  }, []);

  // Tocar fuera cierra con `closedby="any"`. Safari todavía no lo entiende:
  // ahí se mide si el toque empezó y terminó fuera del recuadro de la ventana.
  const fuera = (evento) => {
    const recuadro = ref.current.getBoundingClientRect();
    return (
      evento.clientX < recuadro.left ||
      evento.clientX > recuadro.right ||
      evento.clientY < recuadro.top ||
      evento.clientY > recuadro.bottom
    );
  };
  const empezoFuera = useRef(false);
  const sinClosedBy =
    typeof HTMLDialogElement !== "undefined" && !("closedBy" in HTMLDialogElement.prototype);
  const alPresionar = (evento) => {
    empezoFuera.current = fuera(evento);
  };
  const alSoltar = (evento) => {
    if (!empezoFuera.current || !fuera(evento)) return;
    const dialogo = ref.current;
    if (typeof dialogo.requestClose === "function") dialogo.requestClose();
    else {
      const cancelar = new Event("cancel", { cancelable: true });
      dialogo.dispatchEvent(cancelar);
      if (!cancelar.defaultPrevented) dialogo.close();
    }
  };

  const avisarCierre = useEffectEvent(() => alCerrar());

  return (
    <dialog
      ref={ref}
      className={estilos.ventana}
      data-tamano={tamano}
      aria-labelledby={idDelTitulo}
      aria-describedby={descripcion ? idDeLaDescripcion : undefined}
      {...{ closedby: cerrarAlTocarFuera ? "any" : "closerequest" }}
      onCancel={(evento) => antesDeCerrar?.(evento.nativeEvent)}
      onClose={() => avisarCierre()}
      onPointerDown={cerrarAlTocarFuera && sinClosedBy ? alPresionar : undefined}
      onPointerUp={cerrarAlTocarFuera && sinClosedBy ? alSoltar : undefined}
    >
      <ContextoDeVentana value={cerrar}>
        <header className={estilos.cabeza}>
          <div className={estilos.titulos}>
            <h2 id={idDelTitulo} className={estilos.titulo}>
              {titulo}
            </h2>
            {descripcion && (
              <p id={idDeLaDescripcion} className={estilos.descripcion}>
                {descripcion}
              </p>
            )}
          </div>
          <button type="button" className={estilos.cerrar} onClick={cerrar} aria-label="Cerrar">
            <IconoCerrar />
          </button>
        </header>
        <div className={estilos.cuerpo}>{children}</div>
        {pie && <footer className={estilos.pie}>{pie}</footer>}
      </ContextoDeVentana>
    </dialog>
  );
}

const ContextoDeVentana = createContext(() => {});

/** Desde dentro de una ventana: la función que la cierra. */
export const useCerrarVentana = () => use(ContextoDeVentana);
