import { useRef, useState } from "react";
import { useParams } from "react-router";
import { Boton } from "../../componentes/ui/Controles.jsx";
import { ErrorDelFormulario } from "../../componentes/ui/Formulario.jsx";
import { IconoCompartir, IconoCopiar } from "../../componentes/ui/iconos.jsx";
import { useFondo } from "../../componentes/ui/useFondo.js";
import { Ventana } from "../../componentes/ui/Ventana.jsx";
import { Zum } from "../../componentes/panal/Zum.jsx";
import { Abeja, Enjambre } from "./Enjambre.jsx";
import estilos from "./Invitar.module.css";
import {
  ANULAR_Y_CREAR_OTRO,
  COMPARTIR,
  COPIADO,
  COPIAR,
  CREANDO_EL_ENLACE,
  desdeEl,
  ENLACE_DE_INVITACION,
  INVITAR_AL_ENJAMBRE,
  quienAbraElEnlace,
  tituloAlCompartir,
  YA_EN_EL_ENJAMBRE,
} from "./textos.js";
import { useInvitacion } from "./useColmenas.js";

/** P09. Invitar al enjambre: el enlace para unirse, sobre la colmena. */
export function Invitar() {
  const { id } = useParams();
  const { salir: salirDeLaVentana } = useFondo();
  const { invitacion, vencimiento, cargando, error, colmena, crear, creando } = useInvitacion(id);
  const campo = useRef(/** @type {HTMLInputElement | null} */ (null));
  const [copiado, setCopiado] = useState("");

  const salir = () => salirDeLaVentana(`/colmenas/${id}`);

  const enlace = invitacion ? `${window.location.origin}/unirme/${invitacion.codigo}` : "";
  const puedeCompartir = typeof navigator.share === "function";

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(enlace);
      setCopiado(enlace);
    } catch {
      // Sin permiso para el portapapeles, el enlace queda seleccionado para copiarlo a mano.
      campo.current?.select();
    }
  };

  const compartir = () =>
    navigator.share({ title: tituloAlCompartir(colmena?.nombre), url: enlace }).catch((motivo) => {
      // Cerrar la hoja de compartir sin elegir rechaza con AbortError: no es un fallo.
      if (motivo.name !== "AbortError") copiar();
    });

  return (
    <Ventana
      titulo={INVITAR_AL_ENJAMBRE}
      descripcion={colmena ? quienAbraElEnlace(colmena.nombre) : undefined}
      alCerrar={salir}
      cerrarAlTocarFuera
    >
      <div className={estilos.invitacion}>
        <Zum className={estilos.zumChica} estado="feliz" tamanos="96px" />
        <ErrorDelFormulario>{error?.mensaje}</ErrorDelFormulario>
        {cargando || creando || !invitacion ? (
          <p className={estilos.nota} role="status">
            {CREANDO_EL_ENLACE}
          </p>
        ) : (
          <>
            <label className={estilos.enlace}>
              <span className="solo-lectores">{ENLACE_DE_INVITACION}</span>
              <input
                ref={campo}
                value={enlace}
                readOnly
                onFocus={(evento) => evento.target.select()}
              />
            </label>
            <div className={estilos.botones}>
              <Boton onClick={copiar} aria-live="polite">
                <IconoCopiar className={estilos.iconoDeBoton} />
                {copiado === enlace ? COPIADO : COPIAR}
              </Boton>
              {puedeCompartir && (
                <Boton tono="claro" onClick={compartir}>
                  <IconoCompartir className={estilos.iconoDeBoton} />
                  {COMPARTIR}
                </Boton>
              )}
            </div>
            <p className={estilos.vence}>
              {vencimiento && `${vencimiento}. `}
              <button
                type="button"
                className={estilos.enlaceDeTexto}
                onClick={crear}
                disabled={creando}
              >
                {ANULAR_Y_CREAR_OTRO}
              </button>
            </p>
          </>
        )}
        {colmena && (
          <section aria-labelledby="ya-en-el-enjambre">
            <h3 id="ya-en-el-enjambre" className={estilos.subtitulo}>
              {YA_EN_EL_ENJAMBRE}
            </h3>
            <Enjambre>
              {colmena.enjambre.map((abeja) => (
                <Abeja
                  key={abeja.id}
                  abeja={abeja}
                  detalle={abeja.unidaEl && desdeEl(abeja.unidaEl)}
                />
              ))}
            </Enjambre>
          </section>
        )}
      </div>
    </Ventana>
  );
}
