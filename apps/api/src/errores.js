import { ERRORES, erroresPorCampo } from "@panal/contratos";

/**
 * Errores de la API. Toda respuesta de error tiene la forma de `@panal/contratos`:
 *
 *     { "error": { "codigo": "celda_ya_llena", "mensaje": "Esa celda ya estaba llena." } }
 *
 * Las rutas lanzan un `ErrorDePanal` y el manejador de errores de la aplicación
 * lo convierte en respuesta, con el estado que le corresponde según `ERRORES`.
 */

/** @typedef {keyof typeof ERRORES} CodigoDeError */

export class ErrorDePanal extends Error {
  /**
   * @param {CodigoDeError} codigo
   * @param {{ mensaje?: string, campos?: Record<string, string>, [dato: string]: unknown }} [detalle]
   *   `campos` acompaña a los errores de validación; cualquier otro dato viaja dentro de `error`.
   */
  constructor(codigo, { mensaje, campos, ...extra } = {}) {
    super(mensaje ?? ERRORES[codigo].mensaje);
    this.codigo = codigo;
    this.estado = ERRORES[codigo].estado;
    this.campos = campos;
    this.extra = extra;
  }

  /** El cuerpo de la respuesta. */
  get cuerpo() {
    return {
      error: {
        codigo: this.codigo,
        mensaje: this.message,
        ...(this.campos ? { campos: this.campos } : {}),
        ...this.extra,
      },
    };
  }
}

/**
 * Atajo para lanzar un error: `throw falla("no_existe")`.
 * @param {CodigoDeError} codigo
 * @param {ConstructorParameters<typeof ErrorDePanal>[1]} [detalle]
 */
export function falla(codigo, detalle) {
  return new ErrorDePanal(codigo, detalle);
}

/**
 * Valida un dato con un esquema de los contratos. Si no es válido, lanza
 * `datos_invalidos` con el mensaje de cada campo.
 * @template T
 * @param {import("zod").ZodType<T>} esquema
 * @param {unknown} dato
 * @param {{ campo?: string }} [opciones] Para un dato suelto, como un parámetro de la
 *   dirección: el nombre con el que se informa el error.
 * @returns {T}
 */
export function validar(esquema, dato, { campo } = {}) {
  const resultado = esquema.safeParse(dato);
  if (resultado.success) return resultado.data;
  const campos = erroresPorCampo(resultado.error);
  throw falla("datos_invalidos", {
    campos: campo ? { [campo]: Object.values(campos)[0] } : campos,
  });
}

/**
 * Lee el cuerpo JSON de una petición y lo valida.
 * @template T
 * @param {import("hono").Context} c
 * @param {import("zod").ZodType<T>} esquema
 * @returns {Promise<T>}
 */
export async function leerCuerpo(c, esquema) {
  let dato;
  try {
    dato = await c.req.json();
  } catch {
    throw falla("datos_invalidos", { campos: { formulario: "Envía los datos en formato JSON." } });
  }
  return validar(esquema, dato);
}
