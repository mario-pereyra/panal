/**
 * Anuncia un texto a los lectores de pantalla sin mover el foco.
 *
 * Usa `document.ariaNotify` donde existe; en los demás navegadores escribe en
 * la región viva `#anuncios`, que está en `index.html` desde la carga (una
 * región creada en el momento no siempre se anuncia).
 *
 * @param {string} texto
 * @param {{ demora?: number }} [opciones] Espera antes de anunciar, para no pisar
 *   lo que el lector dice del control que acaba de recibir el foco.
 */
export function anunciar(texto, { demora = 0 } = {}) {
  if (typeof document === "undefined" || !texto) return;
  clearTimeout(anunciar.temporizador);
  anunciar.temporizador = setTimeout(() => {
    if (typeof document.ariaNotify === "function") {
      document.ariaNotify(texto);
      return;
    }
    const region = document.getElementById("anuncios");
    if (!region) return;
    region.textContent = "";
    // Vaciar y volver a escribir hace que el mismo texto se anuncie dos veces seguidas.
    requestAnimationFrame(() => {
      region.textContent = texto;
    });
  }, demora);
}

/** @type {ReturnType<typeof setTimeout> | undefined} */
anunciar.temporizador = undefined;
