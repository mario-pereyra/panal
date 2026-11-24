import { countScheduledForDay, groupBy } from "./activities.js";
import { getBadges } from "./badges.js";
import { addDays } from "./day.js";
import { DROPS, scoreDayCells } from "./drops.js";
import { FRAMES_PER_HIVE, getHiveFrames } from "./hive.js";
import { getCompletedQuotas, getQuotaStreaks } from "./quotas.js";
import { getRank } from "./ranks.js";
import { advanceFlightDay, getFlightDrops, getTodayStreak, runFlight } from "./streak.js";
import { getDaySummary } from "./summary.js";

export const EARLY_BIRD_HOUR = 7;

export function* daysBetween(from, to) {
  for (let day = from; day <= to; day = addDays(day, 1)) yield day;
}

export function calculateProgress(input) {
  const { userId, today, settings, activities, otherActivities = [], cells, hives = [] } = input;
  const activitiesById = new Map(
    [...otherActivities, ...activities].map((activity) => [activity.id, activity]),
  );

  const byDay = groupBy(cells, (cell) => cell.day);
  const scoredCells = [...byDay.values()].flatMap((dayCells) =>
    scoreDayCells(dayCells, activitiesById),
  );
  const scoredByDay = groupBy(scoredCells, (cell) => cell.day);

  const completionsByActivity = groupBy(cells, (cell) => cell.activityId);
  const firstDay = [input.since ?? today, ...byDay.keys()].reduce((min, day) =>
    day < min ? day : min,
  );
  const dayEntries = [...daysBetween(firstDay, today)].map((day) => {
    const scheduled = countScheduledForDay(activities, completionsByActivity, day);
    const summary = getDaySummary({ cells: scoredByDay.get(day) ?? [], scheduled }, settings, day);
    return {
      day,
      filled: summary.filled,
      scheduled,
      closed: summary.closed,
      rest: summary.rest,
      finished: day < today,
      summary,
    };
  });
  const todayEntry = dayEntries[dayEntries.length - 1];
  const flightUntilYesterday = runFlight(dayEntries.slice(0, -1));
  const flight = advanceFlightDay(flightUntilYesterday, todayEntry);

  const recurringActivities = activities.filter((activity) => activity.type === "recurrente");
  const quotasPerActivity = recurringActivities.map((activity) =>
    getCompletedQuotas(activity, completionsByActivity.get(activity.id) ?? []),
  );
  const allCompletedQuotas = quotasPerActivity.flat();
  const quotaStreaks = quotasPerActivity.map(getQuotaStreaks);
  const bestQuotaStreak = quotaStreaks.reduce(
    (best, current) => (current.best > best.best ? current : best),
    { best: 0, reachedAt: {} },
  );

  const hiveResults = hives.map((hive) => {
    const { frames, bonuses } = getHiveFrames(hive.filledCells, hive.total);
    const filled = Math.min(hive.filledCells.length, hive.total);
    return {
      hive,
      frames,
      bonuses: bonuses.filter((bonus) => bonus.userId === userId),
      frame: hive.total > 0 ? Math.floor((filled * FRAMES_PER_HIVE) / hive.total) : 0,
      closed: hive.total > 0 && filled >= hive.total,
      contributed: hive.filledCells.some((cell) => cell.userId === userId),
    };
  });
  const contributedHives = hiveResults.filter((result) => result.contributed);
  const hiveBonuses = hiveResults.flatMap((result) => result.bonuses);

  const sumBy = (list, getVal) => list.reduce((total, item) => total + getVal(item), 0);
  const breakdown = {
    cells: sumBy(scoredCells, (cell) => cell.drops),
    closures: flight.closedDays * DROPS.dailyClose,
    milestones: flight.milestones * DROPS.streakMilestone,
    quotas: allCompletedQuotas.length * DROPS.weeklyQuota,
    hives: sumBy(hiveBonuses, (bonus) => bonus.drops),
  };
  const totalDrops = Object.values(breakdown).reduce((a, b) => a + b, 0);

  const todayBonuses =
    allCompletedQuotas.filter((quota) => quota.day === today).length * DROPS.weeklyQuota +
    sumBy(
      hiveBonuses.filter((bonus) => bonus.day === today),
      (bonus) => bonus.drops,
    );
  const todayDrops =
    todayEntry.summary.cellDrops +
    getFlightDrops(flight) -
    getFlightDrops(flightUntilYesterday) +
    todayBonuses;

  const dueOnceCells = scoredCells.filter((cell) => {
    const activity = activitiesById.get(cell.activityId);
    return activity?.type === "unica" && activity.dueDate;
  });
  const onTimeDays = dueOnceCells
    .filter((cell) => cell.day <= activitiesById.get(cell.activityId).dueDate)
    .map((cell) => cell.day)
    .sort();
  const overdueFilledDays = dueOnceCells
    .filter((cell) => cell.day > activitiesById.get(cell.activityId).dueDate)
    .map((cell) => cell.day)
    .sort();
  const overduePendingCount = activities.filter(
    (activity) =>
      activity.type === "unica" &&
      !activity.archivedDay &&
      activity.dueDate &&
      activity.dueDate < today &&
      !(completionsByActivity.get(activity.id) ?? []).length,
  ).length;
  const earlyBirdDays = [
    ...new Set(
      cells
        .filter((cell) => cell.localHour != null && cell.localHour < EARLY_BIRD_HOUR)
        .map((cell) => cell.day),
    ),
  ].sort();
  const firstFrameDays = contributedHives
    .flatMap((result) => result.frames)
    .map((frame) => frame.day)
    .sort();
  const closedHiveDays = contributedHives
    .flatMap((result) => result.frames.filter((frame) => frame.frame === FRAMES_PER_HIVE))
    .map((frame) => frame.day)
    .sort();
  const foundedHives = hives.filter((hive) => hive.ownerId === userId);

  const badges = getBadges({
    flight,
    cells: cells.length,
    onTimeOnce: { count: onTimeDays.length, tenthOn: onTimeDays[9] ?? null },
    quotas: { best: bestQuotaStreak.best, fourthOn: bestQuotaStreak.reachedAt[4] ?? null },
    overdue: {
      filled: overdueFilledDays.length,
      pending: overduePendingCount,
      lastOn: overdueFilledDays[overdueFilledDays.length - 1] ?? null,
    },
    hives: {
      foundedWithTeam: foundedHives.filter((hive) => hive.joinedCount > 0).length,
      joinedCount: sumBy(foundedHives, (hive) => hive.joinedCount),
      bestFrame: Math.max(0, ...contributedHives.map((result) => result.frame)),
      firstFrameOn: firstFrameDays[0] ?? null,
      closedCount: contributedHives.filter((result) => result.closed).length,
      closedOn: closedHiveDays[0] ?? null,
    },
    earlyMornings: { days: earlyBirdDays.length, fifthOn: earlyBirdDays[4] ?? null },
  });

  return {
    today: todayEntry.summary,
    flight,
    flightUntilYesterday,
    streak: getTodayStreak(flight, today, todayEntry.filled > 0),
    cells: scoredCells,
    drops: {
      total: totalDrops,
      untilYesterday: totalDrops - todayDrops,
      today: todayDrops,
      todayBonuses,
      breakdown,
    },
    rank: getRank(totalDrops),
    badges,
    hives: hiveResults.map(({ hive, frame, closed }) => ({
      id: hive.id,
      name: hive.name,
      frame,
      closed,
    })),
  };
}
