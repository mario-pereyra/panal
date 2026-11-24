import { dateSchema, reportPeriodSchema } from "@panal/contratos";
import {
  addDays,
  countScheduledForDay,
  daysBetween,
  getDaySummary,
  getHiveProgress,
  groupBy,
  isAliveOnDay,
  isDueToday,
  isRestDay,
  scoreDayCells,
} from "@panal/motor";
import { validate } from "../errors.js";
import {
  findHiveCells,
  findHiveContributionsInPeriod,
  findHiveMembers,
  findHivesByUser,
} from "../repositories/hiveRepository.js";
import { loadProgressFacts } from "./profileService.js";

const STRIP_DAYS = 7;

export async function getReport(db, user, query, now) {
  const facts = await loadProgressFacts(db, user, now);
  const { today } = facts;

  const to = query.to === undefined ? today : validate(dateSchema, query.to, { field: "to" });
  const { from } = validate(reportPeriodSchema, {
    from: query.from ?? addDays(to, -(STRIP_DAYS - 1)),
    to,
  });

  const endDay = to < today ? to : today;
  const { activities, otherActivities, cells, settings } = facts.input;
  const activitiesById = new Map(
    [...otherActivities, ...activities].map((activity) => [activity.id, activity]),
  );

  const cellsByDay = groupBy(cells, (cell) => cell.day);
  const scoredCells = [...cellsByDay.values()].flatMap((dayCells) =>
    scoreDayCells(dayCells, activitiesById),
  );
  const scoredByDay = groupBy(scoredCells, (cell) => cell.day);
  const completionsByActivity = groupBy(cells, (cell) => cell.activityId);

  let earnedDrops = 0;
  const dailySeries = [...daysBetween(from, endDay)].map((day) => {
    const scheduled = countScheduledForDay(activities, completionsByActivity, day);
    const daySummary = getDaySummary(
      { cells: scoredByDay.get(day) ?? [], scheduled },
      settings,
      day,
    );
    earnedDrops += daySummary.drops;
    return {
      day,
      filled: daySummary.filled,
      goal: daySummary.goal,
      closed: daySummary.closed,
      rest: daySummary.rest,
    };
  });

  const daysCount = [...daysBetween(from, to)].length;
  const periodCells = cells.filter((cell) => cell.day >= from && cell.day <= to);
  const prevFrom = addDays(from, -daysCount);
  const prevTo = addDays(from, -1);
  const previousFilledCells = cells.filter(
    (cell) => cell.day >= prevFrom && cell.day <= prevTo,
  ).length;
  const activeDays = dailySeries.filter((entry) => entry.filled > 0).length;
  const closedDays = dailySeries.filter((entry) => entry.closed).length;

  const stripStart = addDays(endDay, -(STRIP_DAYS - 1));
  const stripDays = [...daysBetween(stripStart, endDay)];
  const recurringSeries = facts.activities
    .filter(
      ({ activity, inHoneycomb }) =>
        inHoneycomb && activity.type === "recurrente" && !activity.archived,
    )
    .map(({ activity }) => {
      const completions = completionsByActivity.get(activity.id) ?? [];
      let scheduledDays = 0;
      let completedDays = 0;
      const strip = stripDays.map((day) => {
        const done = completions.some((item) => item.day === day);
        const scheduled =
          isAliveOnDay(activity, day) && isDueToday(activity, activity.rule, completions, day).due;
        const rest = isRestDay(settings, day);
        if (scheduled) scheduledDays += 1;
        if (done) completedDays += 1;
        let status = "off";
        if (done) status = "done";
        else if (scheduled) status = rest ? "rest" : "missed";
        return { day, status };
      });
      return {
        id: activity.id,
        title: activity.title,
        rule: activity.rule,
        scheduledDays,
        completedDays,
        strip,
      };
    });

  let personalOnce = 0;
  let recurring = 0;
  let hiveCount = 0;
  for (const cell of periodCells) {
    const activity = activitiesById.get(cell.activityId);
    if (activity?.hiveId) hiveCount += 1;
    else if (activity?.type === "unica") personalOnce += 1;
    else recurring += 1;
  }

  const activeHives = (await findHivesByUser(db, user.id)).filter((hive) => !hive.archivedAt);
  const hiveIds = activeHives.map((hive) => hive.id);
  const members = await findHiveMembers(db, hiveIds);
  const hiveCells = await findHiveCells(db, hiveIds);
  const periodContributions = await findHiveContributionsInPeriod(db, hiveIds, from, to);
  const getMemberCells = (hiveId, memberId) =>
    periodContributions.find((entry) => entry.hiveId === hiveId && entry.userId === memberId)
      ?.cells ?? 0;

  const hives = activeHives.map((hive) => {
    const progress = getHiveProgress(hiveCells.filter((cell) => cell.hiveId === hive.id));
    const contributions = members
      .filter((member) => member.hiveId === hive.id)
      .map((member) => ({
        userId: member.id,
        name: member.name,
        color: member.color,
        cells: getMemberCells(hive.id, member.id),
      }))
      .sort((a, b) => b.cells - a.cells);
    return {
      id: hive.id,
      name: hive.name,
      total: progress.total,
      filled: progress.filled,
      percentage: progress.percentage,
      closed: progress.closed,
      myCells: getMemberCells(hive.id, user.id),
      contributions,
    };
  });

  return {
    today,
    period: { from, to, daysCount },
    summary: {
      filledCells: periodCells.length,
      previousFilledCells,
      activeDays,
      closedDays,
      earnedDrops,
    },
    dailySeries,
    recurringSeries,
    breakdown: {
      personalOnce,
      recurring,
      hive: hiveCount,
    },
    hives,
  };
}
