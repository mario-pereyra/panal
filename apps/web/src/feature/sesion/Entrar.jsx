import { credenciales } from "@panal/contratos";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Boton } from "../../componentes/Controles.jsx";
import { Campo, CampoDeClave, ErrorDelFormulario } from "../../componentes/Formulario.jsx";
import { useFormulario } from "../../componentes/useFormulario.js";
import { useConexion } from "../conexion/useConexion.js";
import { Acceso } from "./Acceso.jsx";
import estilos from "./Acceso.module.css";
import { esperaEnTexto, PROMESA } from "./textos.js";
import { useEntrar } from "./useSesion.js";
import { leerError, mensajeGeneral } from "../../api/errores.js";

/** P01. Entrar al panal. */
export function Entrar() {
  const { entrar, enviando, error } = useEntrar();
  const { enLinea } = useConexion();
  const formulario = useFormulario(credenciales, { correo: "", clave: "" });
  const espera = useCuentaAtras(
    error?.codigo === "demasiados_intentos" ? (error.reintentarEn ?? 300) : 0,
  );

  const enviar = formulario.alEnviar(async (datos) => {
    const resultado = await entrar(datos);
    if (resultado.error) formulario.mostrarErroresDelServidor(leerError(resultado.error).campos);
  });

  const mensaje =
    error?.codigo === "demasiados_intentos"
      ? espera > 0
        ? `Demasiados intentos. Podrás volver a probar en ${esperaEnTexto(espera)}.`
        : null
      : mensajeGeneral(error);

  return (
    <Acceso titulo="Entrar al panal" zum="esperando" lema={<p>{PROMESA}</p>}>
      <form ref={formulario.formulario} className={estilos.campos} onSubmit={enviar} noValidate>
        <ErrorDelFormulario>{mensaje}</ErrorDelFormulario>
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
        <CampoDeClave
          etiqueta="Contraseña"
          autoComplete="current-password"
          required
          {...formulario.campo("clave")}
        />
        <Boton
          type="submit"
          className={estilos.enviar}
          disabled={enviando || espera > 0 || !enLinea}
        >
          {enviando ? "Entrando…" : "Entrar"}
        </Boton>
        {!enLinea && <p className={estilos.aviso}>Sin conexión. Para entrar hace falta señal.</p>}
      </form>
      <p className={estilos.pie}>
        ¿No tienes panal? <Link to="/crear">Crea el tuyo</Link>
      </p>
    </Acceso>
  );
}

/** Segundos que faltan, contando hacia atrás desde `inicio` cada vez que cambia. */
function useCuentaAtras(inicio) {
  const [restantes, setRestantes] = useState(inicio);
  useEffect(() => {
    setRestantes(inicio);
    if (inicio <= 0) return undefined;
    const intervalo = setInterval(() => setRestantes((antes) => Math.max(0, antes - 1)), 1000);
    return () => clearInterval(intervalo);
  }, [inicio]);
  return restantes;
}
