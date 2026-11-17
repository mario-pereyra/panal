import { useEffect, useRef } from "react";
import { anunciar } from "../../componentes/anunciar.js";
import { IconoCerrar } from "../../componentes/iconos.jsx";
import estilos from "./Avisos.module.css";
import { useAvisos } from "./useAvisos.js";

const DURACION_MS = 6000;

/**
 * La región de avisos, siempre en el mismo lugar de la página. Cada aviso es un
 * `popover="manual"`: queda sobre todo lo demás y no se cierra al tocar otra
 * parte. Se anuncia sin robar el foco y se va solo a los seis segundos, salvo
 * que el ratón o el foco estén sobre él.
 */
export function Avisos() {
  const { aviso, descartar, ejecutarAccion } = useAvisos();
  const ref = useRef(/** @type {HTMLDivElement | null} */ (null));
  const enUso = useRef(false);

  useEffect(() => {
    if (!aviso) return undefined;
    const elemento = ref.current;
    // Donde no existe la API de popover, el aviso se ve igual: su posición es fija.
    if (
      elemento &&
      typeof elemento.showPopover === "function" &&
      !elemento.matches(":popover-open")
    ) {
      elemento.showPopover();
    }
    anunciar(aviso.accion ? `${aviso.texto}. Acciones disponibles.` : aviso.texto);

    const temporizador = setInterval(() => {
      if (!enUso.current) descartar();
    }, DURACION_MS);
    return () => clearInterval(temporizador);
  }, [aviso, descartar]);

  /** Si el foco estaba en el aviso que se va, vuelve al contenido en lugar de perderse. */
  const cerrar = (accion) => {
    const teniaElFoco = ref.current?.contains(document.activeElement);
    accion();
    if (teniaElFoco) document.getElementById("contenido")?.focus({ preventScroll: true });
  };

  return (
    <section className={estilos.region} aria-label="Avisos">
      {aviso && (
        <div
          key={aviso.id}
          ref={ref}
          className={estilos.aviso}
          data-tono={aviso.tono}
          popover="manual"
          onPointerEnter={() => (enUso.current = true)}
          onPointerLeave={() => (enUso.current = false)}
          onFocus={() => (enUso.current = true)}
          onBlur={() => (enUso.current = false)}
        >
          <p className={estilos.texto}>{aviso.texto}</p>
          {aviso.accion && (
            <button type="button" className={estilos.accion} onClick={() => cerrar(ejecutarAccion)}>
              {aviso.accion.etiqueta}
            </button>
          )}
          <button
            type="button"
            className={estilos.cerrar}
            onClick={() => cerrar(descartar)}
            aria-label="Cerrar el aviso"
          >
            <IconoCerrar />
          </button>
        </div>
      )}
    </section>
  );
}
