const { version, precache, dataCacheName, updateMessage } = self.__PANAL__;
const APP_CACHE_NAME = `panal-app-${version}`;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(APP_CACHE_NAME).then((cache) => cache.addAll(precache)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => name.startsWith("panal-app-") && name !== APP_CACHE_NAME)
          .map((name) => caches.delete(name)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === updateMessage) self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request));
  } else if (request.mode === "navigate") {
    event.respondWith(navigateWithFallback(request));
  } else {
    event.respondWith(cacheFirst(request));
  }
});

async function navigateWithFallback(request) {
  try {
    return await fetch(request);
  } catch {
    const cached = await caches.match("/");
    return cached ?? new Response("Sin conexión", { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.status === 401) {
      await caches.delete(dataCacheName);
    } else if (response.ok) {
      const cache = await caches.open(dataCacheName);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request, { cacheName: dataCacheName });
    if (cached) return cached;
    throw error;
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(APP_CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
}
