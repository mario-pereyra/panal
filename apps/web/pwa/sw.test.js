import { readFileSync } from "node:fs";
import { describe, expect, test, vi } from "vite-plus/test";
import { precargaDe, publicosEnlazados } from "./complemento.js";

/**
 * El service worker se prueba sin navegador: se evalúa `sw.js` con un `self`,
 * un `caches` y un `fetch` de mentira, y se le despachan eventos. Así un cambio
 * de estrategia se comprueba en milisegundos, sin compilar ni abrir DevTools.
 */

const ORIGEN = "https://panal.test";
const FUENTE = readFileSync(new URL("./sw.js", import.meta.url), "utf8");

/** Un `CacheStorage` en memoria: lo justo que usa `sw.js`. */
function cachesEnMemoria() {
  /** @type {Map<string, Map<string, Response>>} */
  const almacenes = new Map();
  const clave = (peticion) =>
    typeof peticion === "string" ? new URL(peticion, ORIGEN).href : peticion.url;
  const almacen = (nombre) => {
    if (!almacenes.has(nombre)) almacenes.set(nombre, new Map());
    return almacenes.get(nombre);
  };
  return {
    almacenes,
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

/**
 * Carga `sw.js` como lo haría el navegador y devuelve cómo despacharle eventos.
 * @param {{ red?: (peticion: { url: string }) => Promise<Response> }} [opciones]
 */
function cargarServiceWorker({ red = async () => new Response("de la red") } = {}) {
  const oyentes = {};
  const self = {
    __PANAL__: { version: "v2", precarga: ["/", "/assets/app-abc.js"] },
    location: { origin: ORIGEN },
    addEventListener: (tipo, oyente) => {
      oyentes[tipo] = oyente;
    },
    skipWaiting: vi.fn(),
    clients: { claim: vi.fn(async () => {}) },
  };
  const caches = cachesEnMemoria();
  const fetch = vi.fn(red);
  // oxlint-disable-next-line no-new-func -- evaluar el archivo tal como se publica es la prueba
  new Function("self", "caches", "fetch", FUENTE)(self, caches, fetch);

  /** Despacha un evento y espera lo que el service worker prometió, si prometió algo. */
  const despachar = async (tipo, datos = {}) => {
    let promesa;
    oyentes[tipo]({
      ...datos,
      waitUntil: (valor) => (promesa = valor),
      respondWith: (valor) => (promesa = valor),
    });
    return promesa;
  };
  /** Una petición GET del mismo origen, como las que pasan por el evento `fetch`. */
  const pedir = (ruta, { method = "GET", mode = "cors" } = {}) =>
    despachar("fetch", { request: { url: new URL(ruta, ORIGEN).href, method, mode } });

  return { self, caches, fetch, despachar, pedir };
}

describe("service worker", () => {
  test("al instalarse guarda la aplicación en el caché de su versión", async () => {
    const { caches, despachar } = cargarServiceWorker();
    await despachar("install");
    expect([...caches.almacenes.get("panal-app-v2").keys()]).toEqual([
      `${ORIGEN}/`,
      `${ORIGEN}/assets/app-abc.js`,
    ]);
  });

  test("al activarse borra las versiones viejas, conserva los datos y toma la página", async () => {
    const { caches, despachar, self } = cargarServiceWorker();
    for (const nombre of ["panal-app-v1", "panal-app-v2", "panal-datos"]) await caches.open(nombre);
    await caches.open("panal-app-v1").then((cache) => cache.addAll(["/viejo.js"]));
    await despachar("activate");
    expect(await caches.keys()).not.toContain("panal-app-v1");
    expect(self.clients.claim).toHaveBeenCalled();
  });

  test("los datos van primero a la red y, sin señal, sale lo último guardado", async () => {
    let conRed = true;
    const sw = cargarServiceWorker({
      red: async () => {
        if (!conRed) throw new TypeError("Failed to fetch");
        return Response.json({ hoy: "2026-11-17" });
      },
    });
    expect(await (await sw.pedir("/api/panal")).json()).toEqual({ hoy: "2026-11-17" });
    conRed = false;
    expect(await (await sw.pedir("/api/panal")).json()).toEqual({ hoy: "2026-11-17" });
    await expect(sw.pedir("/api/colmenas")).rejects.toThrow("Failed to fetch");
  });

  test("sin red, cualquier dirección de la aplicación abre la página guardada", async () => {
    const sw = cargarServiceWorker({ red: async () => Promise.reject(new TypeError("sin red")) });
    await sw.despachar("install");
    const pagina = await sw.pedir("/colmenas/abc", { mode: "navigate" });
    expect(await pagina.text()).toBe("guardado /");
  });

  test("los archivos con huella salen del caché sin tocar la red", async () => {
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
    await sw.despachar("message", { data: "actualizar" });
    expect(sw.self.skipWaiting).toHaveBeenCalled();
  });
});

describe("complemento que publica sw.js", () => {
  const paquete = {
    "assets/index-abc.js": { type: "chunk" },
    "assets/index-abc.css": { type: "asset" },
    "assets/nunito-latin-wght-normal-x.woff2": { type: "asset" },
    "assets/nunito-cyrillic-wght-normal-x.woff2": { type: "asset" },
    "assets/zum-feliz-360.webp": { type: "asset" },
    "index.html": {
      type: "asset",
      source: `<link rel="icon" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="stylesheet" href="/assets/index-abc.css" />`,
    },
  };

  test("los públicos salen de los enlaces del HTML, sin repetir lo compilado", () => {
    expect(publicosEnlazados(paquete["index.html"].source, paquete)).toEqual([
      "favicon.svg",
      "manifest.webmanifest",
    ]);
  });

  test("precarga la página, el código, los estilos y solo las fuentes latinas", () => {
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
