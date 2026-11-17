import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

/**
 * Complemento de Vite que publica `sw.js` al compilar.
 *
 * Se escribe a mano porque `vite-plugin-pwa` no reconoce la versión de Vite que
 * trae Vite+ (riesgo previsto en 04-stack-y-arquitectura.md §8). Toma los
 * archivos de la compilación, elige los que hacen falta para abrir sin red y
 * calcula la versión con sus nombres, que ya llevan la huella del contenido.
 */

/** Lo compilado que se guarda al instalar. Las demás fuentes y las imágenes se guardan al usarse. */
const PRECARGAR = /\.(js|css)$|latin-wght/;

/**
 * Los archivos de `public/` que la página enlaza en su `<head>` (favicon,
 * manifiesto, icono de Apple): también hacen falta sin red. Se leen del
 * `index.html` compilado, así que agregar un enlace no pide tocar este archivo.
 *
 * @param {string} html
 * @param {Record<string, unknown>} paquete Lo compilado, que ya está en la lista.
 */
export function publicosEnlazados(html, paquete) {
  const rutas = [...html.matchAll(/<link\b[^>]*\bhref="\/([^"]+)"/g)].map(([, ruta]) => ruta);
  return [...new Set(rutas)].filter((ruta) => !(ruta in paquete));
}

/**
 * La lista que se guarda al instalar y la versión que la identifica.
 *
 * @param {Record<string, { type: string, source?: string | Uint8Array }>} paquete
 * @returns {{ version: string, precarga: string[] }}
 */
export function precargaDe(paquete) {
  const html = paquete["index.html"];
  const publicos = html ? publicosEnlazados(String(html.source), paquete) : [];
  const compilados = Object.keys(paquete).filter((archivo) => PRECARGAR.test(archivo));
  const precarga = ["/", ...[...compilados, ...publicos].map((archivo) => `/${archivo}`)];
  const version = createHash("sha256").update(precarga.join("\n")).digest("hex").slice(0, 12);
  return { version, precarga };
}

/** @returns {import("vite").Plugin} */
export function serviceWorkerDePanal() {
  return {
    name: "panal:service-worker",
    apply: "build",
    // Después de los complementos de Vite: así `index.html` ya está en el paquete.
    enforce: "post",
    generateBundle(_opciones, paquete) {
      const fuente = readFileSync(new URL("./sw.js", import.meta.url), "utf8");
      this.emitFile({
        type: "asset",
        fileName: "sw.js",
        source: `self.__PANAL__ = ${JSON.stringify(precargaDe(paquete))};\n${fuente}`,
      });
    },
  };
}
