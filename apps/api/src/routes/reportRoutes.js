import { Hono } from "hono";
import { getCurrentUser, requireAuth } from "../auth/session.js";
import { getReport } from "../services/reportService.js";

export function reportRoutes({ db, clock }) {
  const routes = new Hono();

  routes.get("/reports", requireAuth, async (c) =>
    c.json(await getReport(db, getCurrentUser(c), c.req.query(), clock())),
  );

  return routes;
}
