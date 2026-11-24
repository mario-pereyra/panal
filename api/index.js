import { createApp } from "../apps/api/src/app.js";
import { createDb } from "../apps/api/src/db/client.js";

const url = process.env.DATABASE_URL?.trim();
if (!url) throw new Error("Falta DATABASE_URL: Panal desplegado necesita la base de Neon.");

const app = createApp({ db: await createDb({ url }) });

const handle = (request) => app.fetch(request);

export { handle as DELETE, handle as GET, handle as PATCH, handle as POST, handle as PUT };
