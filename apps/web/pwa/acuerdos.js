// Los nombres que la página y el service worker tienen que compartir. sw.js no
// pasa por el empaquetador: complemento.js se los entrega en `self.__PANAL__`.

export const RUTA_DEL_SERVICE_WORKER = "/sw.js";

export const CACHE_DE_DATOS = "panal-datos";

export const MENSAJE_ACTUALIZAR = "actualizar";
