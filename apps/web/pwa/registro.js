import { CACHE_DE_DATOS, MENSAJE_ACTUALIZAR, RUTA_DEL_SERVICE_WORKER } from "./acuerdos.js";
import { conInstalacionWeb } from "./navegador.js";

/**
 * La PWA vista desde la página: registrar el service worker, avisar de una
 * versión nueva, activarla, ofrecer la instalación y borrar los datos guardados.
 * No sabe de React ni de Redux. Lo que no se puede guardar en el store (el
 * evento de instalación, el service worker en espera) se queda aquí.
 */

// Sin `navigator.install()`, el diálogo de instalación lo abre este evento. Sirve una vez.
let eventoDeInstalacion = null;

let trabajadorEnEspera = null;

// sw.js solo existe en la compilación de producción.
export function registrarServiceWorker({ alHaberVersionNueva }) {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
  const esperar = (trabajador) => {
    trabajadorEnEspera = trabajador;
    alHaberVersionNueva();
  };
  navigator.serviceWorker
    .register(RUTA_DEL_SERVICE_WORKER)
    .then((registro) => {
      // Sin `controller` es la primera instalación: no hay versión vieja que reemplazar.
      if (registro.waiting && navigator.serviceWorker.controller) esperar(registro.waiting);
      registro.addEventListener("updatefound", () => {
        const nuevo = registro.installing;
        nuevo?.addEventListener("statechange", () => {
          if (nuevo.state === "installed" && navigator.serviceWorker.controller) esperar(nuevo);
        });
      });
    })
    .catch((error) => {
      // Pasa en navegación privada de algunos navegadores. Panal funciona igual; solo no abre sin red.
      console.warn("No se pudo registrar el service worker.", error);
    });
}

export function activarVersionNueva() {
  if (!trabajadorEnEspera) return;
  navigator.serviceWorker.addEventListener("controllerchange", () => window.location.reload(), {
    once: true,
  });
  trabajadorEnEspera.postMessage(MENSAJE_ACTUALIZAR);
}

export function escucharInstalacion({ alPoderInstalar, alInstalarse }) {
  const ofrecer = (evento) => {
    // El navegador espera a que Panal ofrezca la instalación desde sus ajustes.
    evento.preventDefault();
    eventoDeInstalacion = evento;
    alPoderInstalar();
  };
  const instalada = () => {
    eventoDeInstalacion = null;
    alInstalarse();
  };
  window.addEventListener("beforeinstallprompt", ofrecer);
  window.addEventListener("appinstalled", instalada);
  return () => {
    window.removeEventListener("beforeinstallprompt", ofrecer);
    window.removeEventListener("appinstalled", instalada);
  };
}

// Se llama directo desde el clic: el navegador exige ese gesto. `alSoltarLaOferta`
// avisa que el evento de instalación ya se usó y el botón debe ocultarse.
export async function instalar({ alSoltarLaOferta }) {
  try {
    if (conInstalacionWeb()) {
      await navigator.install();
      return true;
    }
    if (!eventoDeInstalacion) return false;
    // El evento sirve una sola vez: se suelta antes de esperar la respuesta.
    const evento = eventoDeInstalacion;
    eventoDeInstalacion = null;
    alSoltarLaOferta();
    await evento.prompt();
    const { outcome } = await evento.userChoice;
    return outcome === "accepted";
  } catch (error) {
    // Cancelar es una decisión de la persona; cualquier otra falla se registra.
    if (error?.name !== "AbortError") console.error(error);
    return false;
  }
}

// Lo que el service worker guardó para ver sin red era de la cuenta que sale.
// `caches` no existe fuera de un contexto seguro.
export async function olvidarDatosGuardados() {
  try {
    await globalThis.caches?.delete(CACHE_DE_DATOS);
  } catch (error) {
    console.warn("No se pudieron borrar los datos guardados para ver sin red.", error);
  }
}
