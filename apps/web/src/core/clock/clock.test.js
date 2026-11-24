import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";
import { panalApi } from "../../store/api.js";
import { createAppStore } from "../../store/index.js";
import { syncClock } from "./clockSlice.js";

const atTime = (time) => Date.parse(`2026-11-17T${time}:00-04:00`);

beforeEach(() => {
  const NativeRequest = globalThis.Request;
  vi.stubGlobal(
    "Request",
    class extends NativeRequest {
      constructor(url, options) {
        super(new URL(url, "http://panal.test"), options);
      }
    },
  );
  vi.stubGlobal("fetch", async () => Response.json({}));
});

afterEach(() => vi.unstubAllGlobals());

async function countDashboardRefetches(fromTimestamp, toTimestamp) {
  const store = createAppStore();
  await store.dispatch(
    panalApi.util.upsertQueryData("getMe", undefined, {
      user: { timeZone: "America/La_Paz" },
    }),
  );
  store.dispatch(syncClock(fromTimestamp));
  const subscription = store.dispatch(panalApi.endpoints.getDashboard.initiate());
  await subscription;
  const getRequestId = () => panalApi.endpoints.getDashboard.select()(store.getState()).requestId;
  const beforeId = getRequestId();
  store.dispatch(syncClock(toTimestamp));
  await new Promise((resolve) => setTimeout(resolve, 0));
  const afterId = getRequestId();
  subscription.unsubscribe();
  return beforeId === afterId ? 0 : 1;
}

describe("clock day rollover", () => {
  test("passing 03:00 invalidates and refetches the dashboard", async () => {
    expect(await countDashboardRefetches(atTime("02:59"), atTime("03:01"))).toBe(1);
  });

  test("staying within the same logical day does not refetch", async () => {
    expect(await countDashboardRefetches(atTime("10:00"), atTime("23:59"))).toBe(0);
  });
});
