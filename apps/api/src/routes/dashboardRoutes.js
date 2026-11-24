import { Hono } from "hono";
import { getCurrentUser, requireAuth } from "../auth/session.js";
import { getDashboard } from "../services/dashboardService.js";

export function dashboardRoutes({ db, clock }) {
  const routes = new Hono();

  routes.get("/dashboard", requireAuth, async (c) =>
    c.json(await getDashboard(db, getCurrentUser(c), clock())),
  );

  return routes;
}
