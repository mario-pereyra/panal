import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { DATA_CACHE_NAME, SERVICE_WORKER_PATH, UPDATE_MESSAGE } from "./constants.js";

const PRECACHE_PATTERN = /\.(js|css)$|latin-wght/;

function getLinkedPublicAssets(html, bundle) {
  const paths = [...html.matchAll(/<link\b[^>]*\bhref="\/([^"]+)"/g)].map(([, path]) => path);
  return [...new Set(paths)].filter((path) => !(path in bundle));
}

export function buildPrecacheManifest(bundle) {
  const publicAssets = getLinkedPublicAssets(String(bundle["index.html"].source), bundle);
  const compiledAssets = Object.keys(bundle).filter((file) => PRECACHE_PATTERN.test(file));
  const precache = ["/", ...[...compiledAssets, ...publicAssets].map((file) => `/${file}`)];
  const version = createHash("sha256").update(precache.join("\n")).digest("hex").slice(0, 12);
  return { version, precache };
}

export function buildServiceWorkerSource({ version, precache }) {
  const config = {
    version,
    precache,
    dataCacheName: DATA_CACHE_NAME,
    updateMessage: UPDATE_MESSAGE,
  };
  const source = readFileSync(new URL("./sw.js", import.meta.url), "utf8");
  return `self.__PANAL__ = ${JSON.stringify(config)};\n${source}`;
}

export function panalServiceWorkerPlugin() {
  return {
    name: "panal:service-worker",
    apply: "build",
    enforce: "post",
    generateBundle(_options, bundle) {
      this.emitFile({
        type: "asset",
        fileName: SERVICE_WORKER_PATH.slice(1),
        source: buildServiceWorkerSource(buildPrecacheManifest(bundle)),
      });
    },
  };
}
