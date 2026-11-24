import { serve } from "@hono/node-server";
import { createApp } from "./app.js";
import { createDbFromEnv } from "./db/env.js";
import { runMigrations } from "./db/migrate.js";
import { isDatabaseEmpty, seedDatabase } from "./db/seed.js";

const PORT = Number(process.env.PORT) || 8787;
const HOSTNAME = "127.0.0.1";

const db = await createDbFromEnv();
await runMigrations(db, { log: console.log });
if (db.engine === "pglite" && (await isDatabaseEmpty(db))) {
  console.log("Base nueva: cargo la semilla de demostración.");
  await seedDatabase(db, { log: console.log });
}

const server = serve({ fetch: createApp({ db }).fetch, port: PORT, hostname: HOSTNAME }, (info) => {
  console.log(`Panal escucha en http://${HOSTNAME}:${info.port}/api (${db.engine}).`);
});

let shuttingDown = false;

async function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  server.close();
  await db.close();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
