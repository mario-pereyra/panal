import { onboardingGoalSchema, profileUpdateSchema } from "@panal/contratos";
import { Hono } from "hono";
import { getCurrentUser, requireAuth } from "../auth/session.js";
import { readJsonBody } from "../errors.js";
import {
  cancelPause,
  completeOnboarding,
  formatUserProfile,
  getMyProgress,
  startPause,
  updateProfile,
} from "../services/profileService.js";

export function profileRoutes({ db, clock }) {
  const routes = new Hono();

  routes.get("/me", requireAuth, (c) =>
    c.json({ user: formatUserProfile(getCurrentUser(c), clock()) }),
  );

  routes.patch("/me", requireAuth, async (c) => {
    const changes = await readJsonBody(c, profileUpdateSchema);
    const user = await updateProfile(db, getCurrentUser(c), changes, clock());
    return c.json({ user });
  });

  routes.post("/me/onboarding", requireAuth, async (c) => {
    const body = await readJsonBody(c, onboardingGoalSchema);
    const user = await completeOnboarding(db, getCurrentUser(c), body, clock());
    return c.json({ user });
  });

  routes.post("/me/pause", requireAuth, async (c) => {
    const user = await startPause(db, getCurrentUser(c), clock());
    return c.json({ user });
  });

  routes.delete("/me/pause", requireAuth, async (c) => {
    const user = await cancelPause(db, getCurrentUser(c), clock());
    return c.json({ user });
  });

  routes.get("/me/progress", requireAuth, async (c) =>
    c.json(await getMyProgress(db, getCurrentUser(c), clock())),
  );

  return routes;
}
