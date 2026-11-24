import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useInvitacionPendiente, useYo } from "../../nucleo/cuenta/useCuenta.js";
import { useAceptarInvitacionMutation, useVerInvitacionQuery } from "../../store/api.js";
import { leerError } from "../../store/errores.js";

/** P13. Sin sesión, guarda el código para seguir después de entrar o de crear el panal. */
export function useUnirme(codigo) {
  const navegar = useNavigate();
  const { yo, cargando: cargandoYo } = useYo();
  const { guardarInvitacion, olvidarInvitacion } = useInvitacionPendiente();
  const vista = useVerInvitacionQuery(codigo);
  const [aceptar, aceptacion] = useAceptarInvitacionMutation();
  const sinSesion = !cargandoYo && !yo;
  const yaSoyIntegrante = Boolean(vista.data?.yaSoyIntegrante);

  useEffect(() => {
    if (sinSesion && vista.data) guardarInvitacion(codigo);
  }, [sinSesion, vista.data, codigo, guardarInvitacion]);

  // Quien ya pertenece no necesita la invitación pendiente.
  useEffect(() => {
    if (yaSoyIntegrante) olvidarInvitacion();
  }, [yaSoyIntegrante, olvidarInvitacion]);

  const unirme = async () => {
    const resultado = await aceptar(codigo);
    // Aceptar dos veces (otra pestaña, un doble toque) no es un error: ya está dentro.
    if (resultado.error && leerError(resultado.error).codigo !== "ya_eres_integrante") return;
    olvidarInvitacion();
    navegar(`/colmenas/${vista.data.colmena.id}`, { replace: true });
  };

  return {
    yo,
    cargando: vista.isLoading || cargandoYo,
    error: leerError(vista.error),
    invitacion: vista.data,
    yaSoyIntegrante,
    unirme,
    uniendo: aceptacion.isLoading,
    errorAlUnirme: leerError(aceptacion.error),
  };
}
