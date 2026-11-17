import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { Boton } from "../../componentes/Controles.jsx";
import { ErrorDelFormulario } from "../../componentes/Formulario.jsx";
import { IconoCompartir, IconoCopiar } from "../../componentes/iconos.jsx";
import { fechaCorta } from "../../componentes/textos.js";
import { useFondo } from "../../componentes/useFondo.js";
import { Ventana } from "../../componentes/Ventana.jsx";
import { Zum } from "../../componentes/Zum.jsx";
import estilos from "./Colmenas.module.css";
import { useInvitacion } from "./useColmenas.js";

/** P09. Invitar al enjambre: el enlace para unirse, sobre la colmena. */
export function Invitar() {
  const { id } = useParams();
  const { salir: salirDeLaVentana } = useFondo();
  const { invitacion, vencimiento, cargando, sinEnlace, error, colmena, crear, creando } =
    useInvitacion(id);
  const [copiado, setCopiado] = useState(false);

  // La primera vez no hay enlace: se crea al abrir la ventana.
  const pedido = useRef(false);
  useEffect(() => {
    if (sinEnlace && !pedido.current) {
      pedido.current = true;
      crear();
    }
  }, [sinEnlace, crear]);

  useEffect(() => {
    if (!copiado) return undefined;
    const temporizador = setTimeout(() => setCopiado(false), 2000);
    return () => clearTimeout(temporizador);
  }, [copiado]);

  const salir = () => salirDeLaVentana(`/colmenas/${id}`);

  const enlace = invitacion ? `${window.location.origin}/unirme/${invitacion.codigo}` : "";
  const puedeCompartir = typeof navigator.share === "function";

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(enlace);
      setCopiado(true);
    } catch {
      // Sin permiso para el portapapeles, el enlace queda seleccionado para copiarlo a mano.
      document.getElementById("enlace-de-invitacion")?.select();
    }
  };

  const compartir = () =>
    navigator
      .share({ title: `Únete a ${colmena?.nombre ?? "mi colmena"} en Panal`, url: enlace })
      .catch(() => {});

  return (
    <Ventana
      titulo="Invitar al enjambre"
      descripcion={colmena ? `Quien abra este enlace podrá unirse a ${colmena.nombre}.` : undefined}
      alCerrar={salir}
      cerrarAlTocarFuera
    >
      <div className={estilos.invitacion}>
        <Zum className={estilos.zumChica} estado="feliz" tamanos="96px" />
        <ErrorDelFormulario>{error?.mensaje}</ErrorDelFormulario>
        {cargando || creando || !invitacion ? (
          <p className={estilos.nota} role="status">
            Creando el enlace…
          </p>
        ) : (
          <>
            <div className={estilos.enlace}>
              <label htmlFor="enlace-de-invitacion" className="solo-lectores">
                Enlace de invitación
              </label>
              <input
                id="enlace-de-invitacion"
                value={enlace}
                readOnly
                onFocus={(evento) => evento.target.select()}
              />
            </div>
            <div className={estilos.botones}>
              <Boton onClick={copiar} aria-live="polite">
                <IconoCopiar className={estilos.iconoDeBoton} />
                {copiado ? "Copiado" : "Copiar"}
              </Boton>
              {puedeCompartir && (
                <Boton tono="claro" onClick={compartir}>
                  <IconoCompartir className={estilos.iconoDeBoton} />
                  Compartir
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
                Anular y crear otro
              </button>
            </p>
          </>
        )}
        {colmena && (
          <section aria-labelledby="ya-en-el-enjambre">
            <h3 id="ya-en-el-enjambre" className={estilos.subtitulo}>
              Ya en el enjambre
            </h3>
            <ul className={estilos.enjambre} role="list">
              {colmena.enjambre.map((abeja) => (
                <li key={abeja.id} className={estilos.abeja}>
                  <span
                    className={estilos.avatar}
                    style={{ background: abeja.color }}
                    aria-hidden="true"
                  >
                    {abeja.inicial}
                  </span>
                  <span className={estilos.nombre}>{abeja.nombre}</span>
                  <span className={estilos.aporte}>
                    {abeja.unidaEl && `desde el ${fechaCorta(abeja.unidaEl)}`}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Ventana>
  );
}
