import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { CACHE_DE_DATOS, MENSAJE_ACTUALIZAR, RUTA_DEL_SERVICE_WORKER } from "./acuerdos.js";

// Complemento de Vite que publica sw.js al compilar. Se escribe a mano porque
// `vite-plugin-pwa` no reconoce la versión de Vite que trae Vite+ (riesgo
// previsto en 04-stack-y-arquitectura.md §8).

// Lo compilado que se guarda al instalar; las demás fuentes y las imágenes se
// guardan al usarse. Las fuentes latinas se reconocen por cómo @fontsource
// nombra sus archivos: `nunito-latin-wght-normal-<huella>.woff2`.
const PRECARGAR = /\.(js|css)$|latin-wght/;

// Los archivos de `public/` que el `<head>` enlaza (favicon, manifiesto, icono
// de Apple) también hacen falta sin red: se leen del `index.html` compilado.
function publicosEnlazados(html, paquete) {
  const rutas = [...html.matchAll(/<link\b[^>]*\bhref="\/([^"]+)"/g)].map(([, ruta]) => ruta);
  return [...new Set(rutas)].filter((ruta) => !(ruta in paquete));
}

// Los nombres de lo compilado ya llevan la huella del contenido: la versión sale de ellos.
export function precargaDe(paquete) {
  const publicos = publicosEnlazados(String(paquete["index.html"].source), paquete);
  const compilados = Object.keys(paquete).filter((archivo) => PRECARGAR.test(archivo));
  const precarga = ["/", ...[...compilados, ...publicos].map((archivo) => `/${archivo}`)];
  const version = createHash("sha256").update(precarga.join("\n")).digest("hex").slice(0, 12);
  return { version, precarga };
}

export function fuenteDelServiceWorker({ version, precarga }) {
  const acuerdo = {
    version,
    precarga,
    cacheDeDatos: CACHE_DE_DATOS,
    mensajeActualizar: MENSAJE_ACTUALIZAR,
  };
  const fuente = readFileSync(new URL("./sw.js", import.meta.url), "utf8");
  return `self.__PANAL__ = ${JSON.stringify(acuerdo)};\n${fuente}`;
}

/** @returns {import("vite").Plugin} */
export function serviceWorkerDePanal() {
  return {
    name: "panal:service-worker",
    apply: "build",
    // Después de los complementos de Vite: así `index.html` ya está en el paquete.
    enforce: "post",
    generateBundle(_opciones, paquete) {
      this.emitFile({
        type: "asset",
        fileName: RUTA_DEL_SERVICE_WORKER.slice(1),
        source: fuenteDelServiceWorker(precargaDe(paquete)),
      });
    },
  };
}
