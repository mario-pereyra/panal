/**
 * Anuncia un texto a los lectores de pantalla sin mover el foco.
 *
 * Usa `document.ariaNotify` donde existe; en los demás navegadores agrega el
 * texto a la región viva `#anuncios` de `index.html`. La región está desde la
 * carga porque una creada en el momento no siempre se anuncia. Cada anuncio es
 * un párrafo nuevo: dos anuncios seguidos no se pisan y el mismo texto se
 * repite si hace falta.
 *
 * @param {string} texto
 * @param {{ demora?: number }} [opciones] Espera antes de anunciar, para no pisar
 *   lo que el lector dice del control que acaba de recibir el foco.
 */
export function anunciar(texto, { demora = 0 } = {}) {
  if (typeof document === "undefined" || !texto) return;
  setTimeout(() => {
    if (typeof document.ariaNotify === "function") {
      document.ariaNotify(texto);
      return;
    }
    const region = document.getElementById("anuncios");
    if (!region) return;
    const parrafo = document.createElement("p");
    parrafo.textContent = texto;
    region.append(parrafo);
    setTimeout(() => parrafo.remove(), 10_000);
  }, demora);
}
