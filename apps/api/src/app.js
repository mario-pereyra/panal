import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { ErrorDePanal, falla } from "./errores.js";
import { rutasDeActividades } from "./rutas/actividades.js";
import { rutasDeCeldas } from "./rutas/celdas.js";
import { rutasDeColmenas, rutasDeInvitaciones } from "./rutas/colmenas.js";
import { rutasDeCuenta } from "./rutas/cuenta.js";
import { rutasDePanal } from "./rutas/panal.js";
import { rutasDeReportes } from "./rutas/reportes.js";
import { rutasDeYo } from "./rutas/yo.js";
import { cargarSesion } from "./seguridad/sesion.js";

/**
 * La aplicación de Hono: una función que recibe una petición estándar y
 * devuelve una respuesta estándar. Se prueba con `app.request()` sin levantar
 * ningún servidor.
 *
 * @typedef {object} Contexto Lo que comparten todas las rutas.
 * @property {import("./datos/base.js").Base} base
 * @property {() => number} reloj Instante actual en milisegundos. Se inyecta para
 *   probar con cualquier fecha; el motor nunca lee el reloj por su cuenta.
 */

/**
 * @param {{ base: import("./datos/base.js").Base, reloj?: () => number }} opciones
 */
export function crearApp({ base, reloj = () => Date.now() }) {
  /** @type {Contexto} */
  const contexto = { base, reloj };
  const app = new Hono();

  app.use("*", secureHeaders());
  app.use("/api/*", cargarSesion(contexto));

  for (const rutas of [
    rutasDeCuenta,
    rutasDeYo,
    rutasDePanal,
    rutasDeActividades,
    rutasDeCeldas,
    rutasDeColmenas,
    rutasDeInvitaciones,
    rutasDeReportes,
  ]) {
    app.route("/api", rutas(contexto));
  }

  app.notFound((c) => {
    const error = falla("no_existe", { mensaje: "Esa dirección no existe en el panal." });
    return c.json(error.cuerpo, 404);
  });

  app.onError((error, c) => {
    if (error instanceof ErrorDePanal) {
      if (typeof error.extra.reintentarEn === "number") {
        c.header("Retry-After", String(error.extra.reintentarEn));
      }
      return c.json(error.cuerpo, /** @type {any} */ (error.estado));
    }
    console.error(error);
    return c.json(falla("error_interno").cuerpo, 500);
  });

  return app;
}
