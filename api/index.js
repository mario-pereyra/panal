import { crearApp } from "../apps/api/src/app.js";
import { crearBase } from "../apps/api/src/datos/base.js";

/**
 * La API de Panal desplegada en Vercel: una función que recibe todo `/api/*`
 * (la regla está en `vercel.json`) y lo pasa a la misma aplicación Hono que
 * corre en tu máquina. La base se abre una vez por instancia y se reutiliza
 * entre peticiones. Las migraciones se aplican al compilar, no aquí.
 */

const url = process.env.DATABASE_URL?.trim();
if (!url) throw new Error("Falta DATABASE_URL: Panal desplegado necesita la base de Neon.");

const app = crearApp({ base: await crearBase({ url }) });

/** @param {Request} peticion */
const responder = (peticion) => app.fetch(peticion);

export {
  responder as DELETE,
  responder as GET,
  responder as PATCH,
  responder as POST,
  responder as PUT,
};
