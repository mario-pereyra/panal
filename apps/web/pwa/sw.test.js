import { runInNewContext } from "node:vm";
import { describe, expect, test, vi } from "vite-plus/test";
import { DATA_CACHE_NAME, UPDATE_MESSAGE } from "./constants.js";
import { buildPrecacheManifest, buildServiceWorkerSource } from "./plugin.js";

const ORIGIN = "https://panal.test";

function createMemoryCaches() {
  const stores = new Map();
  const toKey = (request) =>
    typeof request === "string" ? new URL(request, ORIGIN).href : request.url;
  const getStore = (name) => {
    if (!stores.has(name)) stores.set(name, new Map());
    return stores.get(name);
  };
  return {
    open: async (name) => ({
      addAll: async (paths) => {
        for (const path of paths) {
          getStore(name).set(toKey(path), new Response(`cached ${path}`));
        }
      },
      put: async (request, response) => {
        getStore(name).set(toKey(request), response);
      },
    }),
    keys: async () => [...stores.keys()],
    delete: async (name) => stores.delete(name),
    match: async (request, { cacheName } = {}) => {
      for (const name of cacheName ? [cacheName] : stores.keys()) {
        const cached = stores.get(name)?.get(toKey(request));
        if (cached) return cached.clone();
      }
      return undefined;
    },
  };
}

function loadServiceWorker({
  network = async () => new Response("from network"),
  version = "v2",
  precache = ["/", "/assets/app-abc.js"],
  caches = createMemoryCaches(),
} = {}) {
  const listeners = {};
  const self = {
    location: { origin: ORIGIN },
    addEventListener: (type, listener) => {
      listeners[type] = listener;
    },
    skipWaiting: vi.fn(),
    clients: { claim: vi.fn(async () => {}) },
  };
  const fetch = vi.fn(network);
  const source = buildServiceWorkerSource({ version, precache });
  runInNewContext(source, { self, caches, fetch, URL, Response, Promise });

  const dispatchEvent = async (type, data = {}) => {
    let promise;
    listeners[type]({
      ...data,
      waitUntil: (value) => {
        promise = value;
      },
      respondWith: (value) => {
        promise = value;
      },
    });
    return promise;
  };
  const requestPath = (path, { method = "GET", mode = "cors" } = {}) =>
    dispatchEvent("fetch", { request: { url: new URL(path, ORIGIN).href, method, mode } });

  return { self, caches, fetch, dispatchEvent, requestPath };
}

function createToggleableNetwork(responder) {
  const network = { online: true };
  network.fetch = async () => {
    if (!network.online) throw new TypeError("offline");
    return responder();
  };
  return network;
}

describe("service worker", () => {
  test("a new version deletes old app caches, preserves data cache, and claims clients", async () => {
    const network = createToggleableNetwork(() => Response.json({ today: "2026-11-17" }));
    const oldWorker = loadServiceWorker({
      network: network.fetch,
      version: "v1",
      precache: ["/", "/assets/app-old.js"],
    });
    await oldWorker.dispatchEvent("install");
    await oldWorker.requestPath("/api/dashboard");

    const newWorker = loadServiceWorker({ network: network.fetch, caches: oldWorker.caches });
    await newWorker.dispatchEvent("install");
    await newWorker.dispatchEvent("activate");
    network.online = false;

    await expect(newWorker.requestPath("/assets/app-old.js")).rejects.toThrow("offline");
    expect(await (await newWorker.requestPath("/api/dashboard")).json()).toEqual({
      today: "2026-11-17",
    });
    expect(newWorker.self.clients.claim).toHaveBeenCalled();
  });

  test("api data uses network first and falls back to cached response when offline", async () => {
    const network = createToggleableNetwork(() => Response.json({ today: "2026-11-17" }));
    const sw = loadServiceWorker({ network: network.fetch });
    expect(await (await sw.requestPath("/api/dashboard")).json()).toEqual({ today: "2026-11-17" });
    network.online = false;
    expect(await (await sw.requestPath("/api/dashboard")).json()).toEqual({ today: "2026-11-17" });
    await expect(sw.requestPath("/api/hives")).rejects.toThrow("offline");
  });

  test("a 401 response from /api/* purges panal-datos cache", async () => {
    let status = 200;
    const network = createToggleableNetwork(() =>
      status === 200
        ? Response.json({ today: "2026-11-17" })
        : new Response(JSON.stringify({ error: { code: "unauthorized" } }), { status: 401 }),
    );
    const sw = loadServiceWorker({ network: network.fetch });
    await sw.requestPath("/api/dashboard");
    expect(await sw.caches.keys()).toContain(DATA_CACHE_NAME);

    status = 401;
    const unauthorizedResponse = await sw.requestPath("/api/dashboard");
    expect(unauthorizedResponse.status).toBe(401);
    expect(await sw.caches.keys()).not.toContain(DATA_CACHE_NAME);
  });

  test("offline navigation falls back to cached root and never resolves to undefined", async () => {
    const sw = loadServiceWorker({ network: async () => Promise.reject(new TypeError("offline")) });
    const uncachedPage = await sw.requestPath("/colmenas/abc", { mode: "navigate" });
    expect(uncachedPage).toBeInstanceOf(Response);
    expect(uncachedPage.status).toBe(503);

    await sw.dispatchEvent("install");
    const page = await sw.requestPath("/colmenas/abc", { mode: "navigate" });
    expect(await page.text()).toBe("cached /");
  });

  test("precached assets are served from cache without touching network", async () => {
    const sw = loadServiceWorker();
    await sw.dispatchEvent("install");
    expect(await (await sw.requestPath("/assets/app-abc.js")).text()).toBe(
      "cached /assets/app-abc.js",
    );
    expect(sw.fetch).not.toHaveBeenCalled();
  });

  test("mutations and external origins are ignored", async () => {
    const sw = loadServiceWorker();
    expect(await sw.requestPath("/api/cells/1", { method: "PUT" })).toBeUndefined();
    expect(
      await sw.dispatchEvent("fetch", {
        request: { url: "https://fonts.example/a.woff2", method: "GET", mode: "cors" },
      }),
    ).toBeUndefined();
  });

  test("new version activates only when update message is received", async () => {
    const sw = loadServiceWorker();
    await sw.dispatchEvent("message", { data: "other" });
    expect(sw.self.skipWaiting).not.toHaveBeenCalled();
    await sw.dispatchEvent("message", { data: UPDATE_MESSAGE });
    expect(sw.self.skipWaiting).toHaveBeenCalled();
  });
});

describe("service worker build plugin", () => {
  const bundle = {
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

  test("precaches root, JS, CSS, latin fonts, and linked public assets", () => {
    expect(buildPrecacheManifest(bundle).precache).toEqual([
      "/",
      "/assets/index-abc.js",
      "/assets/index-abc.css",
      "/assets/nunito-latin-wght-normal-x.woff2",
      "/favicon.svg",
      "/manifest.webmanifest",
    ]);
  });

  test("version hash changes when any precached asset changes", () => {
    const updated = { ...bundle, "assets/index-def.js": { type: "chunk" } };
    delete updated["assets/index-abc.js"];
    expect(buildPrecacheManifest(updated).version).not.toBe(buildPrecacheManifest(bundle).version);
  });
});
