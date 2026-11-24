import { loginSchema, registerSchema } from "@panal/contratos";
import { Hono } from "hono";
import { closeSession, openSession } from "../auth/session.js";
import { readJsonBody } from "../errors.js";
import { authenticateUser, registerUser } from "../services/authService.js";
import { formatUserProfile } from "../services/profileService.js";

export function authRoutes({ db, clock }) {
  const routes = new Hono();

  routes.post("/account", async (c) => {
    const body = await readJsonBody(c, registerSchema);
    const now = clock();
    const user = await registerUser(db, body, now);
    await openSession(c, db, user.id, now);
    return c.json({ user: formatUserProfile(user, now) }, 201);
  });

  routes.post("/session", async (c) => {
    const body = await readJsonBody(c, loginSchema);
    const now = clock();
    const user = await authenticateUser(db, body, now);
    await openSession(c, db, user.id, now);
    return c.json({ user: formatUserProfile(user, now) });
  });

  routes.delete("/session", async (c) => {
    await closeSession(c, db);
    return c.body(null, 204);
  });

  return routes;
}
