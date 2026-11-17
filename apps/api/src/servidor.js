import { serve } from "@hono/node-server";
import { crearApp } from "./app.js";
import { baseDelEntorno } from "./datos/entorno.js";
import { aplicarMigraciones } from "./datos/migrar.js";
import { baseVacia, sembrar } from "./datos/semilla.js";

/**
 * Arranca el servidor de Panal en Node.
 *
 * Aplica las migraciones pendientes. Sin `DATABASE_URL` usa PGlite en una
 * carpeta local y, la primera vez, carga la semilla de demostración.
 */

const PUERTO = Number(process.env.PORT) || 8787;
const ANFITRION = "127.0.0.1";

const base = await baseDelEntorno();
await aplicarMigraciones(base, { avisar: console.log });
if (base.motor === "pglite" && (await baseVacia(base))) {
  console.log("Base nueva: cargo la semilla de demostración.");
  await sembrar(base, { avisar: console.log });
}

const servidor = serve(
  { fetch: crearApp({ base }).fetch, port: PUERTO, hostname: ANFITRION },
  (info) => {
    console.log(`Panal escucha en http://${ANFITRION}:${info.port}/api (${base.motor}).`);
  },
);

/** Cierra el servidor y la base antes de salir, para que PGlite deje sus archivos en orden. */
async function apagar() {
  servidor.close();
  await base.cerrar();
  process.exit(0);
}
process.on("SIGINT", apagar);
process.on("SIGTERM", apagar);
