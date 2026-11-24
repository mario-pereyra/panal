/**
 * Service worker de Panal (D7 de 04-stack-y-arquitectura.md).
 *
 * No se publica tal cual: al compilar, `complemento.js` le antepone
 * `self.__PANAL__` con la versión, la lista de archivos de esa compilación y
 * los nombres que comparte con la página (`acuerdos.js`).
 *
 * - La aplicación (JS, CSS, fuentes latinas, iconos) se guarda al instalar y se
 *   sirve desde el caché: abre sin red.
 * - Las respuestas `GET /api/*` van primero a la red y se guardan; sin red se
 *   devuelve la última: se ve lo último consultado. Escribir siempre pide red.
 * - Una versión nueva espera a que la persona pulse "Actualizar".
 */

const { version, precarga, cacheDeDatos, mensajeActualizar } = self.__PANAL__;
const CACHE_DE_LA_APP = `panal-app-${version}`;

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

self.addEventListener("message", (evento) => {
  if (evento.data === mensajeActualizar) self.skipWaiting();
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

async function primeroLaRed(peticion) {
  try {
    const respuesta = await fetch(peticion);
    if (respuesta.ok) {
      const cache = await caches.open(cacheDeDatos);
      await cache.put(peticion, respuesta.clone());
    }
    return respuesta;
  } catch (error) {
    const guardada = await caches.match(peticion, { cacheName: cacheDeDatos });
    if (guardada) return guardada;
    throw error;
  }
}

// Los archivos llevan la huella del contenido en el nombre: si está guardado, no cambió.
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
