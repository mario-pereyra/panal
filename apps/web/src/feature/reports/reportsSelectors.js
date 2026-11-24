import { addDays, getMonday } from "@panal/motor";
import { createSelector } from "@reduxjs/toolkit";
import { getBeeColor } from "../../core/dashboard/beeColors.js";
import { selectConsistencyWeeks } from "../../core/dashboard/dashboardSelectors.js";
import { formatCount, formatMonthDay, formatShortDate } from "../../lib/formatters.js";
import { selectDashboard, selectReport } from "../../store/api.js";

const PERIOD_LABELS = {
  week: "esta semana",
  month: "los últimos 30 días",
  quarter: "los últimos 90 días",
};

const PREVIOUS_PERIOD_LABELS = {
  week: "la semana pasada",
  month: "los 30 días anteriores",
  quarter: "los 90 días anteriores",
};

const STRIP_STATUS_LABELS = {
  done: "Llena",
  missed: "Pendiente",
  rest: "Descanso",
  off: "No tocaba",
};

export function getReportPeriodRange(today, periodKey = "week") {
  if (!today) return null;
  if (periodKey === "month") return { from: addDays(today, -29), to: today };
  if (periodKey === "quarter") return { from: addDays(today, -89), to: today };
  return { from: getMonday(today), to: today };
}

function readReportData(state, periodRange) {
  if (!periodRange) return null;
  const selectorOrData = selectReport(periodRange);
  return typeof selectorOrData === "function"
    ? selectorOrData(state)
    : selectReport(state, periodRange);
}

export function formatRecurringComplianceRate(item) {
  if (!item.scheduledDays || item.scheduledDays <= 0) return "–";
  const pct = Math.round((item.completedDays * 100) / item.scheduledDays);
  return `${pct} %`;
}

export function formatDailySeriesSummary(dailyView, periodKey) {
  if (!dailyView) return "";
  const { total, previousTotal, days } = dailyView;
  const base = `Llenaste ${formatCount(total, "celda", "celdas")} ${PERIOD_LABELS[periodKey] ?? PERIOD_LABELS.week}`;
  const diff = total - previousTotal;
  let comparison;
  if (previousTotal === 0 && total === 0) comparison = "";
  else if (diff === 0) {
    comparison = `: las mismas que ${PREVIOUS_PERIOD_LABELS[periodKey]}`;
  } else if (diff > 0) {
    comparison = `: ${diff} más que ${PREVIOUS_PERIOD_LABELS[periodKey]}`;
  } else {
    comparison = `: ${-diff} menos que ${PREVIOUS_PERIOD_LABELS[periodKey]}. Cada celda cuenta`;
  }
  const bestDay = days.reduce(
    (max, entry) => (entry.filled > (max?.filled ?? 0) ? entry : max),
    null,
  );
  const bestNote =
    bestDay && periodKey === "week"
      ? ` Tu mejor día fue el ${formatMonthDay(bestDay.day).toLowerCase()}.`
      : "";
  return `${base}${comparison}.${bestNote}`;
}

export const selectConsistencySummary = createSelector([selectConsistencyWeeks], (rawWeeks) => {
  const weeks = Array.isArray(rawWeeks) ? rawWeeks : (rawWeeks?.weeks ?? []);
  const days = weeks.flat().filter((day) => !day.isFuture);
  const activeDays = days.filter((day) => day.filled > 0).length;
  const closedDays = days.filter((day) => day.level === 3).length;
  return {
    weeks,
    days,
    activeDays,
    closedDays,
    tableRows: days.map((day) => [formatMonthDay(day.day), day.filled]),
    description: `En las últimas ${weeks.length || 5} semanas llenaste celdas ${formatCount(activeDays, "día", "días")} y cerraste tu panal ${formatCount(closedDays, "vez", "veces")}.`,
  };
});

export const selectReportView = createSelector(
  [
    selectDashboard,
    (state, periodKey) => {
      const today = selectDashboard(state)?.today;
      return readReportData(state, getReportPeriodRange(today, periodKey));
    },
    (_, periodKey) => periodKey,
  ],
  (dashboard, report, periodKey) => {
    if (!report) return null;
    const createdDay = dashboard?.user?.createdAt
      ? String(dashboard.user.createdAt).slice(0, 10)
      : report.period?.from;
    const rawDaily = report.dailySeries ?? [];
    const filteredDays = createdDay
      ? rawDaily.filter((entry) => entry.day >= createdDay)
      : rawDaily;
    const total =
      report.summary?.filledCells ?? filteredDays.reduce((sum, entry) => sum + entry.filled, 0);
    const previousTotal = report.summary?.previousFilledCells ?? 0;

    const futureDays = [];
    if (periodKey === "week" && filteredDays.length > 0) {
      const sunday = addDays(getMonday(filteredDays[0].day), 6);
      const lastDay = filteredDays[filteredDays.length - 1].day;
      for (let day = addDays(lastDay, 1); day <= sunday; day = addDays(day, 1)) {
        futureDays.push({
          day,
          filled: 0,
          goal: dashboard?.user?.dailyGoal ?? 5,
          closed: false,
          rest: false,
          isFuture: true,
        });
      }
    }

    const dailyView = {
      days: filteredDays,
      chartDays: [...filteredDays, ...futureDays],
      total,
      previousTotal,
      tableRows: filteredDays.map((entry) => [
        periodKey === "week" ? formatMonthDay(entry.day) : formatShortDate(entry.day),
        entry.filled,
      ]),
    };

    const recurringSeries = (report.recurringSeries ?? []).map((item) => ({
      ...item,
      hasScheduledDays: (item.scheduledDays ?? 0) > 0,
      complianceLabel: formatRecurringComplianceRate(item),
    }));

    const recurringTable = {
      dayHeaders: (recurringSeries[0]?.strip ?? []).map((cell) => formatMonthDay(cell.day)),
      rows: recurringSeries.map((item) => [
        item.title,
        ...(item.strip ?? []).map((cell) => STRIP_STATUS_LABELS[cell.status] ?? "No tocaba"),
        item.complianceLabel,
      ]),
    };

    const onceCount = (report.breakdown?.personalOnce ?? 0) + (report.breakdown?.hive ?? 0);
    const recurringCount = report.breakdown?.recurring ?? 0;
    const breakdownTotal = onceCount + recurringCount || 1;
    const breakdownJars = [
      {
        name: "Únicas",
        count: onceCount,
        percentage: Math.round((onceCount * 100) / breakdownTotal),
      },
      {
        name: "Recurrentes",
        count: recurringCount,
        percentage: Math.round((recurringCount * 100) / breakdownTotal),
      },
    ];

    const hives = (report.hives ?? []).map((hive) => {
      const totalContributed = (hive.contributions ?? []).reduce(
        (sum, item) => sum + item.cells,
        0,
      );
      return {
        ...hive,
        totalContributed,
        contributions: (hive.contributions ?? []).map((member, index) => {
          const colorIndex = typeof member.color === "number" ? member.color : index;
          return {
            ...member,
            colorIndex,
            cssColor: getBeeColor(colorIndex),
            percentage:
              totalContributed > 0 ? Math.round((member.cells * 100) / totalContributed) : 0,
          };
        }),
      };
    });

    return {
      dailyView,
      recurringSeries,
      recurringTable,
      breakdownJars,
      hives,
      isEmpty: Boolean(dashboard) && (dashboard.filledCells?.length ?? 0) === 0 && total === 0,
    };
  },
);
