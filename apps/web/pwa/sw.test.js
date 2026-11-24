import { describe, expect, test, vi } from "vite-plus/test";
import { MENSAJE_ACTUALIZAR } from "./acuerdos.js";
import { fuenteDelServiceWorker, precargaDe } from "./complemento.js";

// El service worker se prueba sin navegador: se evalúa el `sw.js` que publica el
// complemento con un `self`, un `caches` y un `fetch` de mentira, y se le
// despachan eventos. Un cambio de estrategia se comprueba sin compilar ni abrir DevTools.

const ORIGEN = "https://panal.test";

function cachesEnMemoria() {
  const almacenes = new Map();
  const clave = (peticion) =>
    typeof peticion === "string" ? new URL(peticion, ORIGEN).href : peticion.url;
  const almacen = (nombre) => {
    if (!almacenes.has(nombre)) almacenes.set(nombre, new Map());
    return almacenes.get(nombre);
  };
  return {
    open: async (nombre) => ({
      addAll: async (rutas) => {
        for (const ruta of rutas)
          almacen(nombre).set(clave(ruta), new Response(`guardado ${ruta}`));
      },
      put: async (peticion, respuesta) => {
        almacen(nombre).set(clave(peticion), respuesta);
      },
    }),
    keys: async () => [...almacenes.keys()],
    delete: async (nombre) => almacenes.delete(nombre),
    match: async (peticion, { cacheName } = {}) => {
      for (const nombre of cacheName ? [cacheName] : almacenes.keys()) {
        const guardada = almacenes.get(nombre)?.get(clave(peticion));
        if (guardada) return guardada.clone();
      }
      return undefined;
    },
  };
}

function cargarServiceWorker({
  red = async () => new Response("de la red"),
  version = "v2",
  precarga = ["/", "/assets/app-abc.js"],
  caches = cachesEnMemoria(),
} = {}) {
  const oyentes = {};
  const self = {
    location: { origin: ORIGEN },
    addEventListener: (tipo, oyente) => {
      oyentes[tipo] = oyente;
    },
    skipWaiting: vi.fn(),
    clients: { claim: vi.fn(async () => {}) },
  };
  const fetch = vi.fn(red);
  const fuente = fuenteDelServiceWorker({ version, precarga });
  // oxlint-disable-next-line no-new-func -- evaluar el archivo tal como se publica es la prueba
  new Function("self", "caches", "fetch", fuente)(self, caches, fetch);

  const despachar = async (tipo, datos = {}) => {
    let promesa;
    oyentes[tipo]({
      ...datos,
      waitUntil: (valor) => (promesa = valor),
      respondWith: (valor) => (promesa = valor),
    });
    return promesa;
  };
  const pedir = (ruta, { method = "GET", mode = "cors" } = {}) =>
    despachar("fetch", { request: { url: new URL(ruta, ORIGEN).href, method, mode } });

  return { self, caches, fetch, despachar, pedir };
}

function redCortable(respuesta) {
  const red = { hay: true };
  red.pedir = async () => {
    if (!red.hay) throw new TypeError("sin red");
    return respuesta();
  };
  return red;
}

describe("service worker", () => {
  test("una versión nueva borra los archivos de la vieja, conserva los datos y toma la página", async () => {
    const red = redCortable(() => Response.json({ hoy: "2026-11-17" }));
    const vieja = cargarServiceWorker({
      red: red.pedir,
      version: "v1",
      precarga: ["/", "/assets/app-viejo.js"],
    });
    await vieja.despachar("install");
    await vieja.pedir("/api/panal");

    const nueva = cargarServiceWorker({ red: red.pedir, caches: vieja.caches });
    await nueva.despachar("install");
    await nueva.despachar("activate");
    red.hay = false;

    await expect(nueva.pedir("/assets/app-viejo.js")).rejects.toThrow("sin red");
    expect(await (await nueva.pedir("/api/panal")).json()).toEqual({ hoy: "2026-11-17" });
    expect(nueva.self.clients.claim).toHaveBeenCalled();
  });

  test("los datos van primero a la red y, sin señal, sale lo último guardado", async () => {
    const red = redCortable(() => Response.json({ hoy: "2026-11-17" }));
    const sw = cargarServiceWorker({ red: red.pedir });
    expect(await (await sw.pedir("/api/panal")).json()).toEqual({ hoy: "2026-11-17" });
    red.hay = false;
    expect(await (await sw.pedir("/api/panal")).json()).toEqual({ hoy: "2026-11-17" });
    await expect(sw.pedir("/api/colmenas")).rejects.toThrow("sin red");
  });

  test("sin red, cualquier dirección de la aplicación abre la página guardada", async () => {
    const sw = cargarServiceWorker({ red: async () => Promise.reject(new TypeError("sin red")) });
    await sw.despachar("install");
    const pagina = await sw.pedir("/colmenas/abc", { mode: "navigate" });
    expect(await pagina.text()).toBe("guardado /");
  });

  test("lo instalado sale del caché sin tocar la red", async () => {
    const sw = cargarServiceWorker();
    await sw.despachar("install");
    expect(await (await sw.pedir("/assets/app-abc.js")).text()).toBe("guardado /assets/app-abc.js");
    expect(sw.fetch).not.toHaveBeenCalled();
  });

  test("las escrituras y otros orígenes pasan de largo", async () => {
    const sw = cargarServiceWorker();
    expect(await sw.pedir("/api/celdas/1", { method: "PUT" })).toBeUndefined();
    expect(
      await sw.despachar("fetch", {
        request: { url: "https://fonts.example/a.woff2", method: "GET", mode: "cors" },
      }),
    ).toBeUndefined();
  });

  test("la versión nueva se activa solo cuando la página lo pide", async () => {
    const sw = cargarServiceWorker();
    await sw.despachar("message", { data: "otra cosa" });
    expect(sw.self.skipWaiting).not.toHaveBeenCalled();
    await sw.despachar("message", { data: MENSAJE_ACTUALIZAR });
    expect(sw.self.skipWaiting).toHaveBeenCalled();
  });
});

describe("complemento que publica sw.js", () => {
  const paquete = {
    "assets/index-abc.js": { type: "chunk" },
    "assets/index-abc.css": { type: "asset" },
    "assets/nunito-latin-wght-normal-x.woff2": { type: "asset" },
    "assets/nunito-latin-ext-wght-normal-x.woff2": { type: "asset" },
    "assets/nunito-cyrillic-wght-normal-x.woff2": { type: "asset" },
    "assets/zum-feliz-360.webp": { type: "asset" },
    "index.html": {
      type: "asset",
      source: `<link rel="icon" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="stylesheet" href="/assets/index-abc.css" />`,
    },
  };

  test("precarga la página, el código, los estilos, las fuentes latinas y lo que enlaza el HTML", () => {
    expect(precargaDe(paquete).precarga).toEqual([
      "/",
      "/assets/index-abc.js",
      "/assets/index-abc.css",
      "/assets/nunito-latin-wght-normal-x.woff2",
      "/favicon.svg",
      "/manifest.webmanifest",
    ]);
  });

  test("la versión cambia cuando cambia algún archivo", () => {
    const otra = { ...paquete, "assets/index-def.js": { type: "chunk" } };
    delete otra["assets/index-abc.js"];
    expect(precargaDe(otra).version).not.toBe(precargaDe(paquete).version);
  });
});
