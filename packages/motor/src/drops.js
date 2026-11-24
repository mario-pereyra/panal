export const DROPS = {
  recurring: 10,
  once: 25,
  onceHigh: 35,
  onceOverdue: 15,
  dailyClose: 20,
  afterCap: 2,
  weeklyQuota: 15,
  streakMilestone: 50,
  hiveFrame: 30,
  hiveClosed: 100,
};

export const DAILY_SOFT_CAP = 10;
export const HIGH_PRIORITY_PER_DAY = 2;
export const QUICK_CELLS_PER_DAY = 3;
export const QUICK_CELL_SECONDS = 60;

export function getCellDrops(cell, context = {}) {
  const { filledBefore = 0, highBefore = 0, quickBefore = 0 } = context;
  if (filledBefore >= DAILY_SOFT_CAP) return DROPS.afterCap;

  let drops = DROPS.recurring;
  if (cell.type === "unica") {
    if (cell.overdue) drops = DROPS.onceOverdue;
    else if (cell.priority === "high" && highBefore < HIGH_PRIORITY_PER_DAY) drops = DROPS.onceHigh;
    else drops = DROPS.once;
  }
  if (cell.quick) {
    return quickBefore < QUICK_CELLS_PER_DAY ? Math.floor(drops / 2) : 0;
  }
  return drops;
}

export function isQuickCell(activity, cell) {
  if (!activity.createdAt || !cell.filledAt) return false;
  const seconds = (Date.parse(cell.filledAt) - Date.parse(activity.createdAt)) / 1000;
  return seconds >= 0 && seconds < QUICK_CELL_SECONDS;
}

export function scoreDayCells(dayCells, activitiesById) {
  const sorted = [...dayCells].sort((a, b) => (a.filledAt ?? "").localeCompare(b.filledAt ?? ""));
  const initial = { scored: [], highCount: 0, quickCount: 0 };
  return sorted.reduce((acc, cell) => {
    const activity = activitiesById.get(cell.activityId) ?? { type: "recurrente" };
    const overdue = Boolean(
      activity.type === "unica" && activity.dueDate && activity.dueDate < cell.day,
    );
    const quick = isQuickCell(activity, cell);
    const drops = getCellDrops(
      { type: activity.type, priority: activity.priority, overdue, quick },
      {
        filledBefore: acc.scored.length,
        highBefore: acc.highCount,
        quickBefore: acc.quickCount,
      },
    );
    const isHigh = activity.type === "unica" && activity.priority === "high" && !overdue;
    return {
      scored: [...acc.scored, { ...cell, drops }],
      highCount: acc.highCount + (isHigh ? 1 : 0),
      quickCount: acc.quickCount + (quick ? 1 : 0),
    };
  }, initial).scored;
}
