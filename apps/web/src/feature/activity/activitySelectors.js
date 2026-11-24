import { MAX_HIGH_PRIORITY } from "@panal/contratos";
import { getActivityOwner, usesHighPrioritySlot } from "@panal/motor";
import { createSelector } from "@reduxjs/toolkit";
import { selectActivities, selectDashboard, selectMe } from "../../store/api.js";
import { selectDraftByKey } from "./activitySlice.js";

export { selectDraftByKey };

function readActivitiesView(state, view) {
  const selectorOrData = selectActivities(view);
  return typeof selectorOrData === "function"
    ? selectorOrData(state)
    : selectActivities(state, view);
}

const selectActiveActivities = (state) => readActivitiesView(state, "active");
const selectArchivedActivities = (state) => readActivitiesView(state, "archived");
const selectFilledCells = (state) => selectDashboard(state)?.filledCells;

export const selectEditableActivity = createSelector(
  [selectActiveActivities, selectArchivedActivities, (_, id) => id],
  (activeData, archivedData, id) =>
    id
      ? ([...(activeData?.activities ?? []), ...(archivedData?.activities ?? [])].find(
          (activity) => activity.id === id,
        ) ?? null)
      : null,
);

const selectOccupiedHighPrioritySlots = createSelector(
  [selectActiveActivities, selectFilledCells, selectMe, (_, id) => id],
  (activeData, filledCells, me, id) => {
    const filledSet = new Set((filledCells ?? []).map((cell) => cell.activityId));
    return (activeData?.activities ?? []).filter(
      (activity) =>
        activity.id !== id &&
        getActivityOwner(activity) === me?.id &&
        usesHighPrioritySlot({
          ...activity,
          archived: Boolean(activity.archived || activity.archivedAt),
          filled: Boolean(
            activity.filledToday || activity.completedOn || filledSet.has(activity.id),
          ),
        }),
    ).length;
  },
);

export const selectCanMarkHighPriority = (state, id) =>
  selectOccupiedHighPrioritySlots(state, id) < MAX_HIGH_PRIORITY;
