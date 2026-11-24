import { useEffect, useRef } from "react";
import { anunciar } from "../../lib/anunciar.js";
import { IconoCerrar } from "../../componentes/ui/iconos.jsx";
import estilos from "./Avisos.module.css";
import { CERRAR_AVISO } from "../../componentes/ui/textos.js";
import { anuncioDe, AVISOS } from "./textos.js";
import { useAvisos } from "./useAvisos.js";

const DURACION_MS = 6000;

/**
 * La región de avisos, siempre en el mismo lugar de la página. Cada aviso es un
 * `popover="manual"`: queda sobre todo lo demás y no se cierra al tocar otra
 * parte. Se anuncia sin robar el foco y se va solo a los seis segundos, salvo
 * que el ratón o el foco estén sobre él; cuando se van, vuelve a contar los
 * seis segundos.
 */
export function Avisos() {
  const { aviso, descartar, ejecutarAccion } = useAvisos();
  const ref = useRef(/** @type {HTMLDivElement | null} */ (null));
  const temporizador = useRef(0);

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
    anunciar(anuncioDe(aviso));

    temporizador.current = setTimeout(descartar, DURACION_MS);
    return () => clearTimeout(temporizador.current);
  }, [aviso, descartar]);

  const pausar = () => clearTimeout(temporizador.current);

  const reanudar = () => {
    pausar();
    // El ratón se fue, pero el foco sigue dentro: el aviso espera.
    if (ref.current?.contains(document.activeElement)) return;
    temporizador.current = setTimeout(descartar, DURACION_MS);
  };

  /** Si el foco estaba en el aviso que se va, vuelve al contenido en lugar de perderse. */
  const cerrar = (accion) => {
    const teniaElFoco = ref.current?.contains(document.activeElement);
    accion();
    if (teniaElFoco) document.getElementById("contenido")?.focus({ preventScroll: true });
  };

  return (
    <section aria-label={AVISOS}>
      {aviso && (
        <div
          key={aviso.id}
          ref={ref}
          className={estilos.aviso}
          data-tono={aviso.tono}
          popover="manual"
          onPointerEnter={pausar}
          onPointerLeave={reanudar}
          onFocus={pausar}
          onBlur={reanudar}
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
            aria-label={CERRAR_AVISO}
          >
            <IconoCerrar />
          </button>
        </div>
      )}
    </section>
  );
}
