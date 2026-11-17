import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { leerError } from "../../api/errores.js";
import {
  panalApi,
  useCrearCuentaMutation,
  useEntrarMutation,
  useObtenerYoQuery,
  useSalirMutation,
} from "../../api/panalApi.js";
import { selectInvitacionPendiente } from "./sesionSelector.js";

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

/** Entrar al panal. Al responder bien, el perfil queda en caché y la ruta de acceso redirige sola. */
export function useEntrar() {
  const [entrar, estado] = useEntrarMutation();
  return { entrar, enviando: estado.isLoading, error: leerError(estado.error) };
}

/** Crear un panal nuevo. */
export function useCrearCuenta() {
  const [crearCuenta, estado] = useCrearCuentaMutation();
  return { crearCuenta, enviando: estado.isLoading, error: leerError(estado.error) };
}

/** Cerrar la sesión: se borra todo el caché, para que nada de esta cuenta quede a la vista. */
export function useSalir() {
  const [salir, estado] = useSalirMutation();
  const dispatch = useDispatch();
  const navegar = useNavigate();
  const cerrarSesion = async () => {
    await salir();
    dispatch(panalApi.util.resetApiState());
    // Lo que el service worker guardó para ver sin red era de esta cuenta.
    await globalThis.caches?.delete("panal-datos").catch(() => {});
    navegar("/entrar", { replace: true });
  };
  return { cerrarSesion, saliendo: estado.isLoading };
}

/** La invitación abierta antes de entrar, si la hay. */
export const useInvitacionPendiente = () => useSelector(selectInvitacionPendiente);
