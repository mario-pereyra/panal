/**
 * La PWA vista desde la página: registrar el service worker, avisar de una
 * versión nueva, activarla y ofrecer la instalación.
 *
 * No sabe de React ni de Redux. `feature/conexion/useConexion.js` conecta estos
 * avisos con el slice `conexion`. Lo que no se puede guardar en el store (el
 * evento de instalación, el service worker en espera) se queda aquí.
 */

/** El evento que abre el diálogo de instalación cuando no hay `navigator.install()`. Sirve una vez. */
let eventoDeInstalacion = null;

/** El service worker de la versión nueva, esperando a que la persona actualice. */
let trabajadorEnEspera = null;

/** El registro se hace una vez por página, aunque el efecto corra dos veces en desarrollo. */
let registrado = false;

/** Abierta como aplicación instalada, no en una pestaña. */
export const abiertaInstalada = () =>
  typeof window !== "undefined" &&
  Boolean(window.matchMedia?.("(display-mode: standalone)").matches);

/** El navegador sabe instalar desde la página con `navigator.install()`. */
export const conInstalacionWeb = () =>
  typeof Navigator !== "undefined" && typeof Navigator.prototype.install === "function";

/**
 * Registra `/sw.js`, que solo existe en la compilación de producción, y avisa
 * cuando una versión nueva quedó instalada y espera.
 *
 * @param {{ alHaberVersionNueva: () => void }} avisos
 */
export function registrarServiceWorker({ alHaberVersionNueva }) {
  if (registrado || !import.meta.env.PROD || !("serviceWorker" in navigator)) return;
  registrado = true;
  const esperar = (trabajador) => {
    trabajadorEnEspera = trabajador;
    alHaberVersionNueva();
  };
  navigator.serviceWorker
    .register("/sw.js")
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
    .catch(() => {
      // Sin service worker Panal funciona igual; solo no abre sin red.
    });
}

/** Activa la versión nueva y recarga la página cuando ya la controla. */
export function activarVersionNueva() {
  if (!trabajadorEnEspera) return;
  navigator.serviceWorker.addEventListener("controllerchange", () => window.location.reload(), {
    once: true,
  });
  trabajadorEnEspera.postMessage("actualizar");
}

/**
 * Escucha la oferta de instalación del navegador y el aviso de que quedó instalada.
 *
 * @param {{ alPoderInstalar: () => void, alInstalarse: () => void }} avisos
 * @returns {() => void} Deja de escuchar.
 */
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

/**
 * Abre el diálogo de instalación. Se llama directo desde el clic: el navegador
 * exige ese gesto.
 *
 * @param {{ alSoltarLaOferta?: () => void }} [avisos] Cuando el evento de
 *   instalación ya se usó y el botón debe ocultarse.
 * @returns {Promise<boolean>} Si Panal quedó instalada.
 */
export async function instalar({ alSoltarLaOferta } = {}) {
  try {
    if (conInstalacionWeb()) {
      await navigator.install();
      return true;
    }
    if (!eventoDeInstalacion) return false;
    // El evento sirve una sola vez: se suelta antes de esperar la respuesta.
    const evento = eventoDeInstalacion;
    eventoDeInstalacion = null;
    alSoltarLaOferta?.();
    await evento.prompt();
    const { outcome } = await evento.userChoice;
    return outcome === "accepted";
  } catch (error) {
    // Cancelar es una decisión de la persona; cualquier otra falla se registra.
    if (error?.name !== "AbortError") console.error(error);
    return false;
  }
}
