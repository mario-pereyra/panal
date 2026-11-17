import { Navigate, useParams } from "react-router";
import { Boton } from "../../componentes/Controles.jsx";
import { ErrorDelFormulario } from "../../componentes/Formulario.jsx";
import { cuenta } from "../../componentes/textos.js";
import { Zum } from "../../componentes/Zum.jsx";
import estilos from "./Colmenas.module.css";
import { INVITACION_VENCIDA, textoDeInvitacion } from "./textos.js";
import { useUnirme } from "./useColmenas.js";

/** P13. Unirme a una colmena con un enlace. No pide sesión: sin ella, guarda el código y sigue después. */
export function Unirme() {
  const { codigo } = useParams();
  const { yo, cargando, error, invitacion, yaSoyIntegrante, unirme, uniendo, errorAlUnirme } =
    useUnirme(codigo);

  if (yaSoyIntegrante) return <Navigate to={`/colmenas/${invitacion.colmena.id}`} replace />;

  let contenido;
  if (cargando) {
    contenido = <p role="status">Comprobando el enlace…</p>;
  } else if (error) {
    contenido = (
      <>
        <h1 className={estilos.tituloDeUnirme}>Invitación no disponible</h1>
        <p>{error.codigo === "sin_conexion" ? error.mensaje : INVITACION_VENCIDA}</p>
        <Boton a={yo ? "/" : "/entrar"} tono="claro">
          {yo ? "Ir a Hoy" : "Entrar al panal"}
        </Boton>
      </>
    );
  } else {
    const { colmena } = invitacion;
    contenido = (
      <>
        <h1 className={estilos.tituloDeUnirme}>{textoDeInvitacion(invitacion)}</h1>
        <p>{`Ya ${colmena.abejas === 1 ? "hay" : "son"} ${cuenta(colmena.abejas, "abeja", "abejas")} en el enjambre.`}</p>
        <ErrorDelFormulario>{errorAlUnirme?.mensaje}</ErrorDelFormulario>
        {yo ? (
          <Boton onClick={unirme} disabled={uniendo}>
            {uniendo ? "Uniéndote…" : "Unirme"}
          </Boton>
        ) : (
          <div className={estilos.botones}>
            <Boton a="/crear">Crear mi panal</Boton>
            <Boton a="/entrar" tono="claro">
              Ya tengo un panal
            </Boton>
          </div>
        )}
      </>
    );
  }

  return (
    <main id="contenido" className={estilos.unirme}>
      <title>Unirme a una colmena · Panal</title>
      <div className={estilos.tarjetaDeUnirme}>
        <Zum className={estilos.zumMediana} estado="feliz" principal tamanos="160px" />
        {contenido}
      </div>
    </main>
  );
}
