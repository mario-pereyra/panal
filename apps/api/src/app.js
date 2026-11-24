import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { loadSessionMiddleware } from "./auth/session.js";
import { AppError, errorHandler } from "./errors.js";
import { activityRoutes } from "./routes/activityRoutes.js";
import { authRoutes } from "./routes/authRoutes.js";
import { cellRoutes } from "./routes/cellRoutes.js";
import { dashboardRoutes } from "./routes/dashboardRoutes.js";
import { hiveRoutes } from "./routes/hiveRoutes.js";
import { profileRoutes } from "./routes/profileRoutes.js";
import { reportRoutes } from "./routes/reportRoutes.js";

export function createApp({ db, clock = () => Date.now() }) {
  const context = { db, clock };
  const app = new Hono();

  app.use("*", secureHeaders());
  app.use("/api/*", loadSessionMiddleware(context));

  for (const createRoutes of [
    authRoutes,
    profileRoutes,
    dashboardRoutes,
    activityRoutes,
    cellRoutes,
    hiveRoutes,
    reportRoutes,
  ]) {
    app.route("/api", createRoutes(context));
  }

  app.notFound((c) => {
    const error = new AppError("not_found", {
      message: "Esa dirección no existe en el panal.",
    });
    return c.json(error.body, 404);
  });

  app.onError(errorHandler);

  return app;
}
