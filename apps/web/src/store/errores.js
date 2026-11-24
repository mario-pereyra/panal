// Solo los errores: así la carga inicial no arrastra Zod, que llega con los formularios.
import { ERRORES } from "@panal/contratos/errores";

/**
 * Lo que la pantalla necesita saber de un error de la API, venga del servidor
 * (`{ error: { codigo, mensaje, campos } }`) o de la red. `codigo` es uno de
 * `ERRORES` o `sin_conexion`.
 */

const SIN_CONEXION = {
  codigo: "sin_conexion",
  mensaje: "No hay conexión. Lo que escribiste sigue aquí; vuelve a intentarlo con señal.",
  campos: {},
};

export function leerError(error) {
  if (!error) return null;
  const { status, data } = error;
  if (status === "FETCH_ERROR" || status === "TIMEOUT_ERROR") return SIN_CONEXION;
  const delServidor = data?.error;
  if (delServidor?.codigo) {
    return {
      codigo: delServidor.codigo,
      mensaje:
        delServidor.mensaje ??
        ERRORES[delServidor.codigo]?.mensaje ??
        ERRORES.error_interno.mensaje,
      campos: delServidor.campos ?? {},
      reintentarEn: delServidor.reintentarEn,
    };
  }
  return { codigo: "error_interno", mensaje: ERRORES.error_interno.mensaje, campos: {} };
}

/** Lo que va arriba del formulario: un error de validación ya aparece junto a cada campo. */
export const mensajeGeneral = (error) =>
  error && error.codigo !== "datos_invalidos" ? error.mensaje : null;
