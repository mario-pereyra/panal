import { activitySchema, activityUpdateSchema, activityViewSchema } from "@panal/contratos";
import { Hono } from "hono";
import { getCurrentUser, requireAuth } from "../auth/session.js";
import { readJsonBody, validate, validateUuid } from "../errors.js";
import { listActivities, patchActivity, putActivity } from "../services/activityService.js";

export function activityRoutes({ db, clock }) {
  const routes = new Hono();

  routes.get("/activities", requireAuth, async (c) => {
    const view = validate(activityViewSchema, c.req.query("view"), { field: "view" });
    return c.json(await listActivities(db, getCurrentUser(c), view, clock()));
  });

  routes.put("/activities/:id", requireAuth, async (c) => {
    const id = validateUuid(c.req.param("id"), {
      onInvalid: "invalid_data",
      field: "id",
    });
    const data = await readJsonBody(c, activitySchema);
    const { activity, created } = await putActivity(db, getCurrentUser(c), id, data, clock());
    return c.json({ activity }, created ? 201 : 200);
  });

  routes.patch("/activities/:id", requireAuth, async (c) => {
    const id = validateUuid(c.req.param("id"));
    const changes = await readJsonBody(c, activityUpdateSchema);
    return c.json(await patchActivity(db, getCurrentUser(c), id, changes, clock()));
  });

  return routes;
}
