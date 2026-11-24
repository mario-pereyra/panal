import { DATA_CACHE_NAME, SERVICE_WORKER_PATH, UPDATE_MESSAGE } from "./constants.js";
import { supportsWebInstall } from "./browser.js";

let deferredInstallPrompt = null;
let waitingWorker = null;

export function registerServiceWorker({ onUpdateAvailable } = {}) {
  if (
    !import.meta.env.PROD ||
    typeof navigator === "undefined" ||
    !("serviceWorker" in navigator)
  ) {
    return;
  }
  const notifyWaiting = (worker) => {
    waitingWorker = worker;
    onUpdateAvailable?.();
  };
  navigator.serviceWorker
    .register(SERVICE_WORKER_PATH)
    .then((registration) => {
      if (registration.waiting && navigator.serviceWorker.controller) {
        notifyWaiting(registration.waiting);
      }
      registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        installing?.addEventListener("statechange", () => {
          if (installing.state === "installed" && navigator.serviceWorker.controller) {
            notifyWaiting(installing);
          }
        });
      });
    })
    .catch((error) => {
      console.warn("No se pudo registrar el service worker.", error);
    });
}

export function activateServiceWorkerUpdate() {
  if (!waitingWorker) return;
  navigator.serviceWorker.addEventListener("controllerchange", () => window.location.reload(), {
    once: true,
  });
  waitingWorker.postMessage(UPDATE_MESSAGE);
}

export function listenForInstallPrompt({ onCanInstall, onInstalled } = {}) {
  if (typeof window === "undefined") return () => {};
  const handleBeforeInstallPrompt = (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    onCanInstall?.();
  };
  const handleAppInstalled = () => {
    deferredInstallPrompt = null;
    onInstalled?.();
  };
  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  window.addEventListener("appinstalled", handleAppInstalled);
  return () => {
    window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.removeEventListener("appinstalled", handleAppInstalled);
  };
}

export async function promptAppInstall({ onPromptConsumed } = {}) {
  try {
    if (supportsWebInstall()) {
      await navigator.install();
      return true;
    }
    if (!deferredInstallPrompt) return false;
    const promptEvent = deferredInstallPrompt;
    deferredInstallPrompt = null;
    onPromptConsumed?.();
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    return outcome === "accepted";
  } catch (error) {
    if (error?.name !== "AbortError") console.error(error);
    return false;
  }
}

export async function clearCachedData() {
  try {
    await globalThis.caches?.delete(DATA_CACHE_NAME);
  } catch (error) {
    console.warn("No se pudieron borrar los datos guardados para ver sin red.", error);
  }
}
