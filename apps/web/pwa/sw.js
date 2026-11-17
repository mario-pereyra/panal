/**
 * Service worker de Panal (D7 de 04-stack-y-arquitectura.md).
 *
 * No se publica tal cual: al compilar, `complemento.js` le antepone
 * `self.__PANAL__` con la versión y la lista de archivos de esa compilación.
 *
 * - La aplicación (JS, CSS, fuentes latinas, iconos) se guarda al instalar y se
 *   sirve desde el caché: abre sin red.
 * - Las respuestas `GET /api/*` van primero a la red y se guardan; sin red se
 *   devuelve la última: se ve lo último consultado. Escribir siempre pide red.
 * - Una versión nueva espera a que la persona pulse "Actualizar".
 */

const { version, precarga } = self.__PANAL__;
const CACHE_DE_LA_APP = `panal-app-${version}`;
const CACHE_DE_DATOS = "panal-datos";

self.addEventListener("install", (evento) => {
  evento.waitUntil(caches.open(CACHE_DE_LA_APP).then((cache) => cache.addAll(precarga)));
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    (async () => {
      const nombres = await caches.keys();
      await Promise.all(
        nombres
          .filter((nombre) => nombre.startsWith("panal-app-") && nombre !== CACHE_DE_LA_APP)
          .map((nombre) => caches.delete(nombre)),
      );
      await self.clients.claim();
    })(),
  );
});

// La página pide activar la versión nueva cuando la persona pulsa "Actualizar".
self.addEventListener("message", (evento) => {
  if (evento.data === "actualizar") self.skipWaiting();
});

self.addEventListener("fetch", (evento) => {
  const peticion = evento.request;
  const url = new URL(peticion.url);
  if (peticion.method !== "GET" || url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/api/")) {
    evento.respondWith(primeroLaRed(peticion));
  } else if (peticion.mode === "navigate") {
    // Cualquier dirección de la aplicación abre la misma página; sin red, la guardada.
    evento.respondWith(fetch(peticion).catch(() => caches.match("/")));
  } else {
    evento.respondWith(primeroLoGuardado(peticion));
  }
});

/** Datos: la red manda; el caché solo cubre la falta de señal. */
async function primeroLaRed(peticion) {
  try {
    const respuesta = await fetch(peticion);
    if (respuesta.ok) {
      const cache = await caches.open(CACHE_DE_DATOS);
      await cache.put(peticion, respuesta.clone());
    }
    return respuesta;
  } catch (error) {
    const guardada = await caches.match(peticion, { cacheName: CACHE_DE_DATOS });
    if (guardada) return guardada;
    throw error;
  }
}

/** Archivos con huella en el nombre: si está guardado, no cambia. */
async function primeroLoGuardado(peticion) {
  const guardada = await caches.match(peticion);
  if (guardada) return guardada;
  const respuesta = await fetch(peticion);
  if (respuesta.ok) {
    const cache = await caches.open(CACHE_DE_LA_APP);
    await cache.put(peticion, respuesta.clone());
  }
  return respuesta;
}
