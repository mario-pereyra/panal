import { fillCellSchema } from "@panal/contratos";
import { Hono } from "hono";
import { getCurrentUser, requireAuth } from "../auth/session.js";
import { readJsonBody, validateUuid } from "../errors.js";
import { fillCell, unfillCell } from "../services/cellService.js";

export function cellRoutes({ db, clock }) {
  const routes = new Hono();

  routes.put("/cells/:id", requireAuth, async (c) => {
    const id = validateUuid(c.req.param("id"), {
      onInvalid: "invalid_data",
      field: "id",
    });
    const body = await readJsonBody(c, fillCellSchema);
    return c.json(await fillCell(db, getCurrentUser(c), id, body, clock));
  });

  routes.delete("/cells/:id", requireAuth, async (c) => {
    const id = validateUuid(c.req.param("id"));
    await unfillCell(db, getCurrentUser(c), id, clock);
    return c.body(null, 204);
  });

  return routes;
}
