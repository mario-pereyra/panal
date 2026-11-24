import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { olvidarDatosGuardados } from "../../../pwa/registro.js";
import { panalApi, useObtenerYoQuery, useSalirMutation } from "../../store/api.js";
import { leerError } from "../../store/errores.js";
import { guardarInvitacion, olvidarInvitacion } from "./cuentaSlice.js";
import { selectInvitacionPendiente } from "./cuentaSelector.js";

/**
 * Quién tiene la sesión. `sinSesion` es verdadero solo cuando el servidor dijo
 * que no hay sesión (401); un fallo de red es `sinConexion`.
 */
export function useYo() {
  const consulta = useObtenerYoQuery();
  const error = leerError(consulta.error);
  return {
    yo: consulta.data,
    // Solo la primera respuesta. Sin sesión no hay datos, y al volver a la
    // pestaña la consulta se repite: con `isLoading` solo, la guardia cambiaba
    // el formulario por la silueta y se perdía lo escrito.
    cargando: consulta.isLoading && !consulta.error,
    sinSesion: consulta.error?.status === 401,
    sinConexion: !consulta.data && error?.codigo === "sin_conexion",
    reintentar: consulta.refetch,
  };
}

/** Cerrar la sesión: se borra todo el caché, para que nada de esta cuenta quede a la vista. */
export function useSalir() {
  const [salir, estado] = useSalirMutation();
  const dispatch = useDispatch();
  const navegar = useNavigate();
  const cerrarSesion = async () => {
    await salir();
    dispatch(panalApi.util.resetApiState());
    await olvidarDatosGuardados();
    navegar("/entrar", { replace: true });
  };
  return { cerrarSesion, saliendo: estado.isLoading };
}

/** La invitación abierta antes de entrar: se recuerda hasta que la persona entra y la acepta. */
export function useInvitacionPendiente() {
  const dispatch = useDispatch();
  return {
    invitacion: useSelector(selectInvitacionPendiente),
    guardarInvitacion: useCallback((codigo) => dispatch(guardarInvitacion(codigo)), [dispatch]),
    olvidarInvitacion: useCallback(() => dispatch(olvidarInvitacion()), [dispatch]),
  };
}
