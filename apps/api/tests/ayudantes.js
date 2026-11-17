import { crearApp } from "../src/app.js";
import { crearBase } from "../src/datos/base.js";
import { aplicarMigraciones } from "../src/datos/migrar.js";

/**
 * Ayudantes de las pruebas: una base PGlite nueva en memoria, la aplicación con
 * un reloj que se puede mover y clientes que guardan su cookie de sesión.
 */

/** Martes 17 de noviembre de 2026, 11:00 en La Paz. */
export const MARTES = Date.parse("2026-11-17T15:00:00Z");

const HORA_MS = 60 * 60 * 1000;
export const DIA_MS = 24 * HORA_MS;

let correlativo = 0;

/**
 * @param {{ ahora?: number }} [opciones]
 */
export async function crearEntorno({ ahora = MARTES } = {}) {
  const base = await crearBase();
  await aplicarMigraciones(base);
  const reloj = { ahora };
  const app = crearApp({ base, reloj: () => reloj.ahora });

  /**
   * Un cliente de la API, con su cookie si tiene sesión.
   * @param {string} [cookie]
   */
  function cliente(cookie) {
    /**
     * @param {string} metodo
     * @param {string} ruta
     * @param {unknown} [cuerpo]
     */
    async function pedir(metodo, ruta, cuerpo) {
      /** @type {Record<string, string>} */
      const cabeceras = {};
      if (cookie) cabeceras.cookie = cookie;
      if (cuerpo !== undefined) cabeceras["content-type"] = "application/json";
      const respuesta = await app.request(ruta, {
        method: metodo,
        headers: cabeceras,
        body:
          cuerpo === undefined
            ? undefined
            : typeof cuerpo === "string"
              ? cuerpo
              : JSON.stringify(cuerpo),
      });
      const texto = await respuesta.text();
      return { estado: respuesta.status, datos: texto ? JSON.parse(texto) : null, respuesta };
    }
    return {
      cookie,
      get: (ruta) => pedir("GET", ruta),
      post: (ruta, cuerpo) => pedir("POST", ruta, cuerpo),
      put: (ruta, cuerpo) => pedir("PUT", ruta, cuerpo),
      patch: (ruta, cuerpo) => pedir("PATCH", ruta, cuerpo),
      delete: (ruta) => pedir("DELETE", ruta),
    };
  }

  /**
   * La cookie de sesión que dejó una respuesta, lista para mandarla de vuelta.
   * @param {Response} respuesta
   */
  function cookieDe(respuesta) {
    const valor = respuesta.headers.get("set-cookie") ?? "";
    return /panal_sesion=[^;]+/.exec(valor)?.[0];
  }

  /**
   * Registra una abeja nueva y devuelve su cliente con sesión y su perfil.
   * @param {{ nombre?: string, primerVuelo?: boolean }} [opciones]
   */
  async function nuevaAbeja({ nombre = "Abeja", primerVuelo = true } = {}) {
    correlativo += 1;
    const correo = `${nombre.toLowerCase()}${correlativo}@prueba.test`;
    const { estado, datos, respuesta } = await cliente().post("/api/cuenta", {
      nombre,
      correo,
      clave: "panal1234",
    });
    if (estado !== 201) throw new Error(`No se pudo registrar: ${JSON.stringify(datos)}`);
    const abeja = cliente(cookieDe(respuesta));
    if (primerVuelo) await abeja.post("/api/yo/primer-vuelo", { metaDiaria: 3 });
    // Un segundo entre abeja y abeja, para que el orden de llegada no sea un empate.
    reloj.ahora += 1000;
    return { ...abeja, perfil: datos, correo };
  }

  return {
    base,
    app,
    reloj,
    cliente,
    cookieDe,
    nuevaAbeja,
    /** Mueve el reloj hacia adelante. */
    avanzar: (milisegundos) => {
      reloj.ahora += milisegundos;
    },
    cerrar: () => base.cerrar(),
  };
}

/** @returns {string} Un identificador como los que crea el navegador. */
export function nuevoId() {
  return crypto.randomUUID();
}

/**
 * Crea una actividad con `PUT` y devuelve su identificador.
 * @param {{ put: (ruta: string, cuerpo: unknown) => Promise<{ estado: number, datos: any }> }} abeja
 * @param {Record<string, unknown>} datos
 */
export async function crearActividad(abeja, datos) {
  const id = nuevoId();
  const { estado, datos: respuesta } = await abeja.put(`/api/actividades/${id}`, {
    tipo: "unica",
    ...datos,
  });
  if (estado !== 201)
    throw new Error(`No se pudo crear la actividad: ${JSON.stringify(respuesta)}`);
  return id;
}
