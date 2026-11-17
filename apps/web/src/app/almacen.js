/**
 * Leer y guardar en el almacenamiento del navegador sin que un fallo rompa la
 * aplicación. En una ventana privada estricta, con el almacenamiento lleno o
 * fuera del navegador, estas funciones no lanzan: lo guardado vive en memoria
 * hasta recargar, y nada más se pierde.
 *
 * `"local"` es `localStorage`: queda en este dispositivo. `"sesion"` es
 * `sessionStorage`: dura lo que la pestaña.
 *
 * @typedef {"local" | "sesion"} Donde
 */

/** @param {Donde} donde */
const almacen = (donde) => (donde === "sesion" ? sessionStorage : localStorage);

/**
 * @param {string} clave
 * @param {Donde} [donde]
 * @returns {string | null}
 */
export function leer(clave, donde = "local") {
  try {
    return almacen(donde).getItem(clave);
  } catch {
    return null;
  }
}

/**
 * @param {string} clave
 * @param {string} valor
 * @param {Donde} [donde]
 */
export function guardar(clave, valor, donde = "local") {
  try {
    almacen(donde).setItem(clave, valor);
  } catch {
    // Sin almacenamiento, el valor dura hasta recargar.
  }
}

/**
 * @param {string} clave
 * @param {Donde} [donde]
 */
export function borrar(clave, donde = "local") {
  try {
    almacen(donde).removeItem(clave);
  } catch {
    // Sin almacenamiento no había nada que borrar.
  }
}
