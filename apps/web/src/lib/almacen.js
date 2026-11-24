/**
 * Leer y guardar en el almacenamiento del navegador sin que un fallo rompa la
 * aplicación. En una ventana privada estricta, con el almacenamiento lleno o
 * fuera del navegador, estas funciones no lanzan: lo guardado vive en memoria
 * hasta recargar, y nada más se pierde.
 *
 * `"local"` es `localStorage`: queda en este dispositivo. `"sesion"` es
 * `sessionStorage`: dura lo que la pestaña.
 */

const almacen = (donde) => (donde === "sesion" ? sessionStorage : localStorage);

export function leer(clave, donde = "local") {
  try {
    return almacen(donde).getItem(clave);
  } catch {
    return null;
  }
}

export function guardar(clave, valor, donde = "local") {
  try {
    almacen(donde).setItem(clave, valor);
  } catch {
    // Sin almacenamiento, el valor dura hasta recargar.
  }
}

export function borrar(clave, donde = "local") {
  try {
    almacen(donde).removeItem(clave);
  } catch {
    // Sin almacenamiento no había nada que borrar.
  }
}

/**
 * Un dato del store que sobrevive a la recarga. El slice lo lee al iniciar con
 * `leido()`; el store guarda lo que devuelve `de(estado)` cuando cambia, y lo
 * borra cuando es `null`.
 */
export const recuerdo = (clave, de, donde = "local") => ({
  clave,
  de,
  donde,
  leido: () => leer(clave, donde),
});

export function recordarEnElNavegador(store, recuerdos) {
  const ultimos = recuerdos.map((uno) => uno.de(store.getState()));
  store.subscribe(() => {
    const estado = store.getState();
    recuerdos.forEach((uno, indice) => {
      const valor = uno.de(estado);
      if (valor === ultimos[indice]) return;
      ultimos[indice] = valor;
      if (valor === null) borrar(uno.clave, uno.donde);
      else guardar(uno.clave, valor, uno.donde);
    });
  });
}
