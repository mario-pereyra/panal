import { Navigate, useParams } from "react-router";
import { PantallaConZum } from "../../componentes/panal/PantallaConZum.jsx";
import { Boton } from "../../componentes/ui/Controles.jsx";
import { ErrorDelFormulario } from "../../componentes/ui/Formulario.jsx";
import {
  CREAR_MI_PANAL,
  ENTRAR_AL_PANAL,
  IR_A_HOY,
  YA_TENGO_UN_PANAL,
} from "../../nucleo/textos.js";
import {
  abejasEnElEnjambre,
  COMPROBANDO_EL_ENLACE,
  INVITACION_NO_DISPONIBLE,
  porQueNoEstaDisponible,
  textoDeInvitacion,
  UNIENDOTE,
  UNIRME,
  UNIRME_A_UNA_COLMENA,
} from "./textos.js";
import estilos from "./Unirme.module.css";
import { useUnirme } from "./useUnirme.js";

/** P13. Unirme a una colmena con un enlace. No pide sesión: sin ella, guarda el código y sigue después. */
export function Unirme() {
  const { codigo } = useParams();
  const { yo, cargando, error, invitacion, yaSoyIntegrante, unirme, uniendo, errorAlUnirme } =
    useUnirme(codigo);

  if (yaSoyIntegrante) return <Navigate to={`/colmenas/${invitacion.colmena.id}`} replace />;

  const marco = { pestana: UNIRME_A_UNA_COLMENA, zum: "feliz", className: estilos.unirme };

  if (cargando) {
    return (
      <PantallaConZum {...marco}>
        <p role="status">{COMPROBANDO_EL_ENLACE}</p>
      </PantallaConZum>
    );
  }

  if (error) {
    return (
      <PantallaConZum
        {...marco}
        titulo={INVITACION_NO_DISPONIBLE}
        texto={porQueNoEstaDisponible(error)}
      >
        <Boton a={yo ? "/" : "/entrar"} tono="claro">
          {yo ? IR_A_HOY : ENTRAR_AL_PANAL}
        </Boton>
      </PantallaConZum>
    );
  }

  return (
    <PantallaConZum
      {...marco}
      titulo={textoDeInvitacion(invitacion)}
      texto={abejasEnElEnjambre(invitacion.colmena.abejas)}
    >
      <ErrorDelFormulario>{errorAlUnirme?.mensaje}</ErrorDelFormulario>
      {yo ? (
        <Boton onClick={unirme} disabled={uniendo}>
          {uniendo ? UNIENDOTE : UNIRME}
        </Boton>
      ) : (
        <div className={estilos.botones}>
          <Boton a="/crear">{CREAR_MI_PANAL}</Boton>
          <Boton a="/entrar" tono="claro">
            {YA_TENGO_UN_PANAL}
          </Boton>
        </div>
      )}
    </PantallaConZum>
  );
}
