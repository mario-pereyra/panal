import { createHiveSchema, hiveUpdateSchema } from "@panal/contratos";
import { Hono } from "hono";
import { getCurrentUser, requireAuth } from "../auth/session.js";
import { readJsonBody, validateUuid } from "../errors.js";
import {
  acceptInvitation,
  createHiveInvitation,
  createNewHive,
  getHiveDetail,
  getHiveInvitation,
  getInvitationByCode,
  listHives,
  removeMemberFromHive,
  revokeHiveInvitation,
  updateExistingHive,
} from "../services/hiveService.js";

export function hiveRoutes({ db, clock }) {
  const routes = new Hono();

  routes.get("/hives", requireAuth, async (c) =>
    c.json(await listHives(db, getCurrentUser(c), clock())),
  );

  routes.post("/hives", requireAuth, async (c) => {
    const body = await readJsonBody(c, createHiveSchema);
    return c.json(await createNewHive(db, getCurrentUser(c), body, clock()), 201);
  });

  routes.get("/hives/:id", requireAuth, async (c) => {
    const id = validateUuid(c.req.param("id"));
    return c.json(await getHiveDetail(db, getCurrentUser(c), id, clock()));
  });

  routes.patch("/hives/:id", requireAuth, async (c) => {
    const id = validateUuid(c.req.param("id"));
    const changes = await readJsonBody(c, hiveUpdateSchema);
    return c.json(await updateExistingHive(db, getCurrentUser(c), id, changes, clock()));
  });

  routes.delete("/hives/:id/members/:userId", requireAuth, async (c) => {
    const id = validateUuid(c.req.param("id"));
    const userId = validateUuid(c.req.param("userId"));
    await removeMemberFromHive(db, getCurrentUser(c), id, userId, clock());
    return c.body(null, 204);
  });

  routes.get("/hives/:id/invitation", requireAuth, async (c) => {
    const id = validateUuid(c.req.param("id"));
    return c.json(await getHiveInvitation(db, getCurrentUser(c), id, clock()));
  });

  routes.post("/hives/:id/invitation", requireAuth, async (c) => {
    const id = validateUuid(c.req.param("id"));
    return c.json(await createHiveInvitation(db, getCurrentUser(c), id, clock()), 201);
  });

  routes.delete("/hives/:id/invitation", requireAuth, async (c) => {
    const id = validateUuid(c.req.param("id"));
    await revokeHiveInvitation(db, getCurrentUser(c), id, clock());
    return c.body(null, 204);
  });

  routes.get("/invitations/:code", async (c) =>
    c.json(await getInvitationByCode(db, getCurrentUser(c), c.req.param("code"), clock())),
  );

  routes.post("/invitations/:code/accept", requireAuth, async (c) =>
    c.json(await acceptInvitation(db, getCurrentUser(c), c.req.param("code"), clock())),
  );

  return routes;
}
