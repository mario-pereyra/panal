import { nuevaCuenta } from "@panal/contratos";
import { Link } from "react-router";
import { Boton } from "../../componentes/Controles.jsx";
import { Campo, CampoDeClave, ErrorDelFormulario } from "../../componentes/Formulario.jsx";
import { puntosDeHexagono } from "../../componentes/hexagono.js";
import { useFormulario } from "../../componentes/useFormulario.js";
import { useVerInvitacionQuery } from "../../api/panalApi.js";
import { useConexion } from "../conexion/useConexion.js";
import { Acceso } from "./Acceso.jsx";
import estilos from "./Acceso.module.css";
import { fuerzaDeClave, LO_QUE_SE_GANA } from "./textos.js";
import { useCrearCuenta, useInvitacionPendiente } from "./useSesion.js";
import { leerError, mensajeGeneral } from "../../api/errores.js";

/** P02. Crear mi panal. */
export function CrearPanal() {
  const { crearCuenta, enviando, error } = useCrearCuenta();
  const { enLinea } = useConexion();
  const invitacion = useInvitacionPendiente();
  const { data: vista } = useVerInvitacionQuery(invitacion, { skip: !invitacion });
  const formulario = useFormulario(nuevaCuenta, { nombre: "", correo: "", clave: "" });
  const fuerza = fuerzaDeClave(formulario.valores.clave);

  const enviar = formulario.alEnviar(async (datos) => {
    // La zona del dispositivo decide desde el primer día cuándo cambia el día de Panal.
    const zonaHoraria = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const resultado = await crearCuenta(zonaHoraria ? { ...datos, zonaHoraria } : datos);
    if (resultado.error) formulario.mostrarErroresDelServidor(leerError(resultado.error).campos);
  });

  return (
    <Acceso
      titulo="Crear mi panal"
      zum="animando"
      lema={
        <ul role="list">
          {LO_QUE_SE_GANA.map((linea) => (
            <li key={linea}>{linea}</li>
          ))}
        </ul>
      }
    >
      {vista && <p className={estilos.aviso}>Te espera la colmena {vista.colmena.nombre}.</p>}
      <form ref={formulario.formulario} className={estilos.campos} onSubmit={enviar} noValidate>
        <ErrorDelFormulario>
          {error?.codigo === "correo_en_uso" ? (
            <>
              Ese correo ya tiene un panal. <Link to="/entrar">Entra con él</Link>.
            </>
          ) : (
            mensajeGeneral(error)
          )}
        </ErrorDelFormulario>
        <Campo etiqueta="Nombre" autoComplete="name" required {...formulario.campo("nombre")} />
        <Campo
          etiqueta="Correo"
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
            etiqueta="Contraseña"
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
          {enviando ? "Creando tu panal…" : "Crear mi panal"}
        </Boton>
        {!enLinea && (
          <p className={estilos.aviso}>Sin conexión. Para crear tu panal hace falta señal.</p>
        )}
      </form>
      <p className={estilos.pie}>
        <Link to="/entrar">Ya tengo un panal</Link>
      </p>
    </Acceso>
  );
}
