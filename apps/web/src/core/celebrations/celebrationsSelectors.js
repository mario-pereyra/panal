import { CELEBRATION_WEIGHT } from "@panal/motor";
import { createSelector } from "@reduxjs/toolkit";

const selectRawQueue = (state) => state.celebrations.queue;

export const selectCelebrationQueue = createSelector([selectRawQueue], (queue) => {
  const unique = new Map();
  for (const item of queue) {
    const key = `${item.type}:${item.id ?? item.hiveId ?? item.level ?? item.days ?? item.frame ?? ""}`;
    unique.set(key, { ...item, key });
  }
  return [...unique.values()].sort(
    (a, b) => (CELEBRATION_WEIGHT[b.type] ?? 0) - (CELEBRATION_WEIGHT[a.type] ?? 0),
  );
});

export const selectCurrentCelebration = createSelector(
  [selectCelebrationQueue],
  (queue) => queue[0] ?? null,
);
