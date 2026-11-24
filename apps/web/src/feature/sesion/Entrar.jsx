import { credenciales } from "@panal/contratos";
import { Link } from "react-router";
import { AvisoSinConexion, Boton } from "../../componentes/ui/Controles.jsx";
import { Campo, CampoDeClave, ErrorDelFormulario } from "../../componentes/ui/Formulario.jsx";
import { useFormulario } from "../../componentes/ui/useFormulario.js";
import { Acceso } from "./Acceso.jsx";
import estilos from "./Acceso.module.css";
import { ENTRAR_AL_PANAL } from "../../nucleo/textos.js";
import {
  CLAVE,
  CORREO,
  CREA_EL_TUYO,
  ENTRANDO,
  ENTRAR,
  NO_TIENES_PANAL,
  PROMESA,
  SIN_CONEXION_AL_ENTRAR,
} from "./textos.js";
import { useEntrar } from "./useSesion.js";
import { leerError } from "../../store/errores.js";

/** P01. Entrar al panal. */
export function Entrar() {
  const { entrar, enviando, mensaje, espera, enLinea } = useEntrar();
  const formulario = useFormulario(credenciales, { correo: "", clave: "" });

  const enviar = formulario.alEnviar(async (datos) => {
    const resultado = await entrar(datos);
    if (resultado.error) formulario.mostrarErroresDelServidor(leerError(resultado.error).campos);
  });

  return (
    <Acceso titulo={ENTRAR_AL_PANAL} zum="esperando" lema={<p>{PROMESA}</p>}>
      <form ref={formulario.formulario} className={estilos.campos} onSubmit={enviar} noValidate>
        <ErrorDelFormulario>{mensaje}</ErrorDelFormulario>
        <Campo
          etiqueta={CORREO}
          type="email"
          autoComplete="username"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          {...formulario.campo("correo")}
        />
        <CampoDeClave
          etiqueta={CLAVE}
          autoComplete="current-password"
          required
          {...formulario.campo("clave")}
        />
        <Boton
          type="submit"
          className={estilos.enviar}
          disabled={enviando || espera > 0 || !enLinea}
        >
          {enviando ? ENTRANDO : ENTRAR}
        </Boton>
        {!enLinea && <AvisoSinConexion recuadro>{SIN_CONEXION_AL_ENTRAR}</AvisoSinConexion>}
      </form>
      <p className={estilos.pie}>
        {NO_TIENES_PANAL} <Link to="/crear">{CREA_EL_TUYO}</Link>
      </p>
    </Acceso>
  );
}
