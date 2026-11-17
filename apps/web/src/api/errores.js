// Solo los errores: así la carga inicial no arrastra Zod, que llega con los formularios.
import { ERRORES } from "@panal/contratos/errores";

/**
 * Lo que la pantalla necesita saber de un error de la API, venga del servidor
 * (`{ error: { codigo, mensaje, campos } }`) o de la red.
 *
 * @typedef {object} ErrorDePanal
 * @property {string} codigo Uno de `ERRORES`, o `sin_conexion`.
 * @property {string} mensaje Listo para mostrar.
 * @property {Record<string, string>} campos Mensaje por campo, en los errores de validación.
 * @property {number} [reintentarEn] Segundos de espera, en `demasiados_intentos`.
 */

const SIN_CONEXION = {
  codigo: "sin_conexion",
  mensaje: "No hay conexión. Lo que escribiste sigue aquí; vuelve a intentarlo con señal.",
  campos: {},
};

/**
 * @param {unknown} error El `error` de una consulta o mutación de RTK Query.
 * @returns {ErrorDePanal | null}
 */
export function leerError(error) {
  if (!error) return null;
  const { status, data } = /** @type {{ status: number | string, data?: any }} */ (error);
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

/**
 * Lo que va arriba del formulario. Un error de validación ya aparece junto a
 * cada campo, así que arriba no se repite.
 *
 * @param {ErrorDePanal | null} error
 * @returns {string | null}
 */
export const mensajeGeneral = (error) =>
  error && error.codigo !== "datos_invalidos" ? error.mensaje : null;
