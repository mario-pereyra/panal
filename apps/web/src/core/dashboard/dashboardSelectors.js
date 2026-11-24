import { MAX_HIGH_PRIORITY } from "@panal/contratos";
import {
  advanceFlightDay,
  getActivityOwner,
  getCellDrops,
  getConsistencyGrid,
  getDaySummary,
  getFlightDrops,
  getHiveProgress,
  getLocalHour,
  getRank,
  getTodayStreak,
  getWeeklyProgress,
  getZumMood,
  isDueToday,
  usesHighPrioritySlot,
} from "@panal/motor";
import { createSelector } from "@reduxjs/toolkit";
import { selectActivities, selectDashboard, selectHivesList, selectMe } from "../../store/api.js";
import { selectNow } from "../clock/clockSlice.js";
import { buildCellRow } from "./cellRows.js";

export const selectTodayDashboard = (state) => selectDashboard(state);

const selectSettingsWithHistory = createSelector([selectDashboard], (dashboard) =>
  dashboard ? { ...dashboard.user, history: dashboard.settingsHistory } : null,
);

export const selectTodayCells = createSelector([selectDashboard], (dashboard) => {
  if (!dashboard) return [];
  const { today, user, activities = [], filledCells = [] } = dashboard;
  const filledTodayCells = filledCells.filter((cell) => cell.day === today);

  return activities.flatMap((activity) => {
    const completions = filledCells.filter((cell) => cell.activityId === activity.id);
    const { due, overdue } = isDueToday(activity, activity.rule, completions, today);
    if (!due) return [];
    const cell = filledTodayCells.find((item) => item.activityId === activity.id) ?? null;
    const weeklyProgress =
      activity.type === "recurrente" ? getWeeklyProgress(activity, completions, today) : null;

    return [
      buildCellRow(activity, {
        userId: user?.id,
        today,
        archived: false,
        dueToday: activity.dueDate === today,
        overdue,
        cellId: cell?.id ?? activity.todayCellId ?? null,
        filled: cell !== null,
        drops:
          cell?.drops ??
          getCellDrops({ ...activity, overdue }, { filledBefore: filledTodayCells.length }),
        weeklyProgress,
      }),
    ];
  });
});

export const selectTodaySummary = createSelector(
  [selectDashboard, selectSettingsWithHistory, selectTodayCells],
  (dashboard, settings, todayCells) =>
    dashboard && settings
      ? getDaySummary(
          { cells: dashboard.filledCells ?? [], scheduled: todayCells.length },
          settings,
          dashboard.today,
        )
      : null,
);

const selectTodayFlight = createSelector(
  [selectDashboard, selectTodaySummary],
  (dashboard, summary) =>
    dashboard && summary && dashboard.progress?.flightUntilYesterday
      ? advanceFlightDay(dashboard.progress.flightUntilYesterday, {
          day: dashboard.today,
          filled: summary.filled,
          scheduled: summary.scheduled,
          closed: summary.closed,
          rest: summary.rest,
          finished: false,
        })
      : null,
);

export const selectTodayStreak = createSelector(
  [selectDashboard, selectTodaySummary, selectTodayFlight],
  (dashboard, summary, flight) =>
    flight ? getTodayStreak(flight, dashboard.today, summary.filled > 0) : null,
);

export const selectTodayDrops = createSelector(
  [selectDashboard, selectTodaySummary, selectTodayFlight],
  (dashboard, summary, flight) => {
    if (!dashboard || !summary || !flight) return 0;
    const flightDelta =
      getFlightDrops(flight) - getFlightDrops(dashboard.progress.flightUntilYesterday);
    const bonuses = dashboard.progress.todayBonuses ?? 0;
    return summary.cellDrops + flightDelta + bonuses;
  },
);

export const selectTodayRank = createSelector(
  [selectDashboard, selectTodayDrops],
  (dashboard, todayDrops) =>
    dashboard ? getRank((dashboard.progress?.dropsUntilYesterday ?? 0) + todayDrops) : null,
);

const selectLocalHour = createSelector([selectNow, selectDashboard], (now, dashboard) =>
  dashboard?.user?.timeZone ? getLocalHour(now, dashboard.user.timeZone) : 12,
);

export const selectZumMood = createSelector(
  [selectTodaySummary, selectTodayStreak, selectLocalHour],
  (summary, streak, hour) =>
    summary && streak ? getZumMood(summary, streak, { hour }) : "esperando",
);

export const selectActiveHiveSummary = createSelector([selectDashboard], (dashboard) => {
  const hive = dashboard?.activeHive;
  if (!hive) return null;
  const activities = hive.activities ?? [];
  const progress =
    hive.progress ??
    getHiveProgress(activities.map((activity) => ({ filledBy: activity.filledBy ?? null })));
  const contributionsByUser = new Map(
    (progress.contributions ?? []).map((item) => [item.userId, item.cells]),
  );
  const members = (hive.members ?? []).map((member) => ({
    ...member,
    cellsFilled: member.cellsFilled ?? contributionsByUser.get(member.id) ?? 0,
  }));
  return {
    ...hive,
    progress,
    members,
  };
});

export const selectConsistencyWeeks = createSelector(
  [selectDashboard, selectSettingsWithHistory],
  (dashboard, settings) => {
    if (!dashboard || !settings) return [];
    return getConsistencyGrid(dashboard.filledCells ?? [], settings, dashboard.today);
  },
);

export const selectActiveHives = createSelector([selectHivesList], (response) => {
  const hives = Array.isArray(response) ? response : (response?.hives ?? []);
  return hives.filter((hive) => !hive.archived && !hive.archivedAt && !hive.progress?.closed);
});

export const selectRemainingHighPrioritySlots = (state, excludeActivityId = null) => {
  const dashboard = selectDashboard(state);
  const activeResponse = selectActivities("active")(state);
  const userId = selectMe(state)?.id ?? dashboard?.user?.id ?? null;
  const activities = activeResponse?.activities ?? dashboard?.activities ?? [];
  const filledIds = new Set((dashboard?.filledCells ?? []).map((cell) => cell.activityId));
  const used = activities.filter((activity) => {
    if (excludeActivityId && activity.id === excludeActivityId) return false;
    if (userId && getActivityOwner(activity) !== userId) return false;
    const filled =
      Boolean(activity.completedOn || activity.filledToday) || filledIds.has(activity.id);
    return usesHighPrioritySlot({
      ...activity,
      archived: Boolean(activity.archived || activity.archivedAt),
      filled,
    });
  }).length;
  return Math.max(0, MAX_HIGH_PRIORITY - used);
};
