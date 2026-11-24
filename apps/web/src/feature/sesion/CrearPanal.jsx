import { nuevaCuenta } from "@panal/contratos";
import { Link } from "react-router";
import { AvisoSinConexion, Boton } from "../../componentes/ui/Controles.jsx";
import { Campo, CampoDeClave, ErrorDelFormulario } from "../../componentes/ui/Formulario.jsx";
import { puntosDeHexagono } from "../../componentes/ui/hexagono.js";
import { useFormulario } from "../../componentes/ui/useFormulario.js";
import { Acceso } from "./Acceso.jsx";
import estilos from "./Acceso.module.css";
import { CREAR_MI_PANAL, YA_TENGO_UN_PANAL } from "../../nucleo/textos.js";
import {
  CLAVE,
  CORREO,
  CORREO_EN_USO,
  CREANDO_TU_PANAL,
  ENTRA_CON_EL,
  fuerzaDeClave,
  LO_QUE_SE_GANA,
  NOMBRE,
  SIN_CONEXION_AL_CREAR,
  teEsperaLaColmena,
} from "./textos.js";
import { useCrearCuenta } from "./useSesion.js";
import { leerError } from "../../store/errores.js";

/** P02. Crear mi panal. */
export function CrearPanal() {
  const {
    crearCuenta,
    enviando,
    mensaje,
    correoEnUso,
    enLinea,
    invitacion: vista,
  } = useCrearCuenta();
  const formulario = useFormulario(nuevaCuenta, { nombre: "", correo: "", clave: "" });
  const fuerza = fuerzaDeClave(formulario.valores.clave);

  const enviar = formulario.alEnviar(async (datos) => {
    const resultado = await crearCuenta(datos);
    if (resultado.error) formulario.mostrarErroresDelServidor(leerError(resultado.error).campos);
  });

  return (
    <Acceso
      titulo={CREAR_MI_PANAL}
      zum="animando"
      lema={
        <ul role="list">
          {LO_QUE_SE_GANA.map((linea) => (
            <li key={linea}>{linea}</li>
          ))}
        </ul>
      }
    >
      {vista && <p className={estilos.aviso}>{teEsperaLaColmena(vista.colmena.nombre)}</p>}
      <form ref={formulario.formulario} className={estilos.campos} onSubmit={enviar} noValidate>
        <ErrorDelFormulario>
          {correoEnUso ? (
            <>
              {CORREO_EN_USO} <Link to="/entrar">{ENTRA_CON_EL}</Link>.
            </>
          ) : (
            mensaje
          )}
        </ErrorDelFormulario>
        <Campo etiqueta={NOMBRE} autoComplete="name" required {...formulario.campo("nombre")} />
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
        <div className={estilos.campos}>
          <CampoDeClave
            etiqueta={CLAVE}
            autoComplete="new-password"
            minLength={8}
            required
            {...formulario.campo("clave")}
          />
          <p className={estilos.fuerza} aria-live="polite">
            <svg
              className={estilos.celdasDeFuerza}
              width="72"
              height="22"
              viewBox="0 0 72 22"
              aria-hidden="true"
            >
              {[0, 1, 2].map((celda) => (
                <g
                  key={celda}
                  data-llena={celda < fuerza.celdas ? "" : undefined}
                  transform={`translate(${12 + celda * 24} 11)`}
                >
                  <polygon points={puntosDeHexagono(9.5)} />
                </g>
              ))}
            </svg>
            <span>{fuerza.texto}</span>
          </p>
        </div>
        <Boton type="submit" className={estilos.enviar} disabled={enviando || !enLinea}>
          {enviando ? CREANDO_TU_PANAL : CREAR_MI_PANAL}
        </Boton>
        {!enLinea && <AvisoSinConexion recuadro>{SIN_CONEXION_AL_CREAR}</AvisoSinConexion>}
      </form>
      <p className={estilos.pie}>
        <Link to="/entrar">{YA_TENGO_UN_PANAL}</Link>
      </p>
    </Acceso>
  );
}
