import { RECENT_DONE_DAYS } from "@panal/contratos";
import { addDays, doesRuleMatchDay, getWeeklyProgress, groupBy, isAliveOnDay } from "@panal/motor";
import { createSelector } from "@reduxjs/toolkit";
import { buildCellRow } from "../../core/dashboard/cellRows.js";
import { selectTodayCells } from "../../core/dashboard/dashboardSelectors.js";
import { formatLongDate } from "../../lib/formatters.js";
import { selectActivities, selectDashboard } from "../../store/api.js";
import { selectHiveFilter, selectPriorityFilter } from "./cellsSlice.js";

const HORIZON_DAYS = 7;

export const CELL_TABS = ["hoy", "proximas", "recurrentes", "hechas", "archivadas"];

function readActivitiesView(state, view) {
  const selectorOrData = selectActivities(view);
  return typeof selectorOrData === "function"
    ? selectorOrData(state)
    : selectActivities(state, view);
}

const selectActiveActivities = (state) => readActivitiesView(state, "active");
const selectDoneActivities = (state) => readActivitiesView(state, "done");
const selectArchivedActivities = (state) => readActivitiesView(state, "archived");

function formatDayGroupTitle(day, today) {
  if (day === today) return "Hoy";
  if (day === addDays(today, 1)) return "Mañana";
  if (day === addDays(today, -1)) return "Ayer";
  return formatLongDate(day);
}

function matchesCellFilters(item, hiveFilter, priorityFilter) {
  if (priorityFilter === "high" && item.priority !== "high") return false;
  if (hiveFilter === "personal") return !item.hiveId;
  if (hiveFilter !== "all") return item.hiveId === hiveFilter;
  return true;
}

function isScheduledForFutureDay(activity, day) {
  if (activity.type === "unica") return activity.dueDate === day;
  const kind = activity.rule?.kind;
  if (kind !== "dias" && kind !== "mes") return false;
  return isAliveOnDay(activity, day) && doesRuleMatchDay(activity.rule, day);
}

export const selectFilterHives = createSelector([selectActiveActivities], (activeData) => {
  const hivesById = new Map();
  for (const activity of activeData?.activities ?? []) {
    if (activity.hiveId && activity.hiveName) {
      hivesById.set(activity.hiveId, activity.hiveName);
    }
  }
  return [...hivesById].map(([id, name]) => ({ id, name }));
});

export const selectCellsByTab = createSelector(
  [
    selectTodayCells,
    selectActiveActivities,
    selectDoneActivities,
    selectArchivedActivities,
    selectDashboard,
    selectHiveFilter,
    selectPriorityFilter,
  ],
  (todayRows, activeData, doneData, archivedData, dashboard, hiveFilter, priorityFilter) => {
    const today = dashboard?.today ?? activeData?.today;
    const context = { userId: dashboard?.user?.id, today };
    const filteredActive = (activeData?.activities ?? []).filter((activity) =>
      matchesCellFilters(activity, hiveFilter, priorityFilter),
    );
    const completionsByActivity = groupBy(dashboard?.filledCells ?? [], (cell) => cell.activityId);

    const todayFiltered = (todayRows ?? []).filter((row) =>
      matchesCellFilters(row, hiveFilter, priorityFilter),
    );

    const upcomingGroups = [];
    if (today) {
      for (let offset = 1; offset <= HORIZON_DAYS; offset += 1) {
        const day = addDays(today, offset);
        const rows = filteredActive
          .filter((activity) => isScheduledForFutureDay(activity, day))
          .map((activity) => buildCellRow(activity, context));
        if (rows.length > 0) {
          upcomingGroups.push({
            day,
            title: formatDayGroupTitle(day, today),
            rows,
          });
        }
      }
      const laterRows = filteredActive
        .filter(
          (activity) =>
            activity.type === "unica" &&
            activity.dueDate &&
            activity.dueDate > addDays(today, HORIZON_DAYS),
        )
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
        .map((activity) => buildCellRow(activity, context));
      if (laterRows.length > 0) {
        upcomingGroups.push({
          day: "later",
          title: "Más adelante",
          rows: laterRows,
        });
      }
    }

    const recurringRows = filteredActive
      .filter((activity) => activity.type === "recurrente")
      .map((activity) => {
        const weeklyProgress = today
          ? getWeeklyProgress(activity, completionsByActivity.get(activity.id) ?? [], today)
          : null;
        return {
          ...buildCellRow(activity, context),
          weeklyProgress,
        };
      });

    const activitiesById = new Map(
      [...(activeData?.activities ?? []), ...(doneData?.activities ?? [])].map((activity) => [
        activity.id,
        activity,
      ]),
    );
    const doneGroups = [];
    if (today) {
      const fromDay = addDays(today, -RECENT_DONE_DAYS);
      const recentFilled = (dashboard?.filledCells ?? []).filter(
        (cell) => cell.day >= fromDay && cell.day < today,
      );
      const byDay = [...groupBy(recentFilled, (cell) => cell.day)].sort(([a], [b]) =>
        b.localeCompare(a),
      );
      for (const [day, dayCells] of byDay) {
        const rows = dayCells.flatMap((cell) => {
          const activity = activitiesById.get(cell.activityId);
          if (!activity || !matchesCellFilters(activity, hiveFilter, priorityFilter)) {
            return [];
          }
          return [
            {
              ...buildCellRow(activity, context),
              filled: true,
              cellId: cell.id,
              drops: cell.drops,
            },
          ];
        });
        if (rows.length > 0) {
          doneGroups.push({
            day,
            title: formatDayGroupTitle(day, today),
            rows,
          });
        }
      }
    }

    const archivedRows = (archivedData?.activities ?? [])
      .filter((activity) => matchesCellFilters(activity, hiveFilter, priorityFilter))
      .map((activity) => ({
        ...buildCellRow(activity, context),
        archived: true,
        drops: null,
      }));

    return {
      groups: {
        hoy: [{ rows: todayFiltered }],
        proximas: upcomingGroups,
        recurrentes: [{ rows: recurringRows }],
        hechas: doneGroups,
        archivadas: [{ rows: archivedRows }],
      },
      counts: {
        hoy: todayFiltered.length,
        proximas: upcomingGroups.reduce((sum, group) => sum + group.rows.length, 0),
        recurrentes: recurringRows.length,
        hechas: doneData ? doneGroups.reduce((sum, group) => sum + group.rows.length, 0) : null,
        archivadas: archivedData ? archivedRows.length : null,
      },
    };
  },
);
