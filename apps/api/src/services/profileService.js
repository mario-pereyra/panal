import { addDays, calculateProgress, getLocalHour, getLogicalDay } from "@panal/motor";
import { throwError } from "../errors.js";
import { findActivitiesForProgress } from "../repositories/activityRepository.js";
import { findCellsByUser } from "../repositories/cellRepository.js";
import {
  findHiveFilledCellsForProgress,
  findHivesForProgress,
} from "../repositories/hiveRepository.js";
import {
  findSettingsHistory,
  replaceSettingsHistoryFrom,
  updateUser,
} from "../repositories/userRepository.js";
import { formatActivity } from "./activityService.js";

export function toIso(value) {
  return new Date(value).toISOString();
}

export function toOptionalIso(value) {
  return value == null ? null : new Date(value).toISOString();
}

export function getEffectiveGoals(user, today) {
  const nextTakesEffect = user.nextGoal != null && user.goalChangesOn <= today;
  return nextTakesEffect
    ? { dailyGoal: user.nextGoal, nextGoal: null, goalChangesOn: null }
    : {
        dailyGoal: user.dailyGoal,
        nextGoal: user.nextGoal,
        goalChangesOn: user.goalChangesOn ?? null,
      };
}

export function getSettingsHistoryFromToday(user, today) {
  const { dailyGoal, nextGoal, goalChangesOn } = getEffectiveGoals(user, today);
  const restDay = user.restDay;
  const entries = [{ from: today, dailyGoal, restDay }];
  if (nextGoal != null && goalChangesOn) {
    entries.push({ from: goalChangesOn, dailyGoal: nextGoal, restDay });
  }
  return entries;
}

export function buildUserSettings(user, today, historyEntries = []) {
  return {
    dailyGoal: getEffectiveGoals(user, today).dailyGoal,
    restDay: user.restDay,
    pausePeriod: user.pauseFrom ? { from: user.pauseFrom, to: user.pauseTo } : null,
    history: [
      ...historyEntries
        .filter((entry) => entry.from < today)
        .map((entry) => ({
          from: entry.from,
          dailyGoal: entry.dailyGoal,
          restDay: entry.restDay,
        })),
      ...getSettingsHistoryFromToday(user, today),
    ],
  };
}

export function formatUserProfile(user, now) {
  const timeZone = user.timeZone;
  const today = getLogicalDay(now, timeZone);
  const goals = getEffectiveGoals(user, today);
  const pausePeriod =
    user.pauseFrom && user.pauseTo && user.pauseTo >= today
      ? { from: user.pauseFrom, to: user.pauseTo }
      : null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    ...goals,
    timeZone,
    restDay: user.restDay,
    pausePeriod,
    onboardedAt: toOptionalIso(user.onboardedAt),
    createdAt: toIso(user.createdAt),
    today,
  };
}

export async function syncSettingsHistory(db, user, today) {
  await replaceSettingsHistoryFrom(db, user.id, today, getSettingsHistoryFromToday(user, today));
}

export async function loadProgressFacts(db, user, now) {
  const timeZone = user.timeZone;
  const today = getLogicalDay(now, timeZone);
  const activityRows = await findActivitiesForProgress(db, user.id);
  const cells = await findCellsByUser(db, user.id);
  const hives = await findHivesForProgress(db, user.id);
  const hiveFilledCells = await findHiveFilledCellsForProgress(db, user.id);
  const settingsHistory = await findSettingsHistory(db, user.id);

  const activities = activityRows.map((row) => ({
    activity: formatActivity(row, { userId: user.id, timeZone, today }),
    inHoneycomb: row.inHoneycomb,
    firstFilledDay: row.firstFilledDay,
  }));

  return {
    today,
    timeZone,
    activities,
    cells,
    input: {
      userId: user.id,
      today,
      since: getLogicalDay(user.createdAt, timeZone),
      settings: buildUserSettings(user, today, settingsHistory),
      activities: activities.filter((item) => item.inHoneycomb).map((item) => item.activity),
      otherActivities: activities.filter((item) => !item.inHoneycomb).map((item) => item.activity),
      cells: cells.map((cell) => ({
        id: cell.id,
        activityId: cell.activityId,
        userId: cell.userId,
        day: cell.day,
        filledAt: toIso(cell.filledAt),
        localHour: getLocalHour(cell.filledAt, timeZone),
      })),
      hives: hives.map((hive) => ({
        id: hive.id,
        name: hive.name,
        ownerId: hive.ownerId,
        joinedCount: hive.joinedCount,
        total: hive.total,
        filledCells: hiveFilledCells
          .filter((cell) => cell.hiveId === hive.id)
          .map((cell) => ({
            userId: cell.userId,
            day: cell.day,
            filledAt: toIso(cell.filledAt),
          })),
      })),
    },
  };
}

export async function getUserProgressData(db, user, now) {
  const facts = await loadProgressFacts(db, user, now);
  return { facts, progress: calculateProgress(facts.input) };
}

export function getDropsByCell(progress) {
  return new Map(progress.cells.map((cell) => [cell.id, cell.drops]));
}

function buildNextPauseColumns(user, pausePeriod, today) {
  const startedBeforeToday = user.pauseFrom != null && user.pauseFrom < today;
  if (pausePeriod === null) {
    if (!startedBeforeToday) return { pauseFrom: null, pauseTo: null };
    const yesterday = addDays(today, -1);
    return {
      pauseFrom: user.pauseFrom,
      pauseTo: user.pauseTo < yesterday ? user.pauseTo : yesterday,
    };
  }
  if (pausePeriod.from < today && pausePeriod.from !== user.pauseFrom) {
    throwError("invalid_data", {
      fields: { pausePeriod: "La invernada empieza hoy o más adelante." },
    });
  }
  return { pauseFrom: pausePeriod.from, pauseTo: pausePeriod.to };
}

export async function updateProfile(db, user, changes, now) {
  const today = getLogicalDay(now, user.timeZone);
  const updates = {};

  if (changes.name !== undefined) updates.name = changes.name;
  if (changes.timeZone !== undefined) updates.timeZone = changes.timeZone;
  if (changes.restDay !== undefined) updates.restDay = changes.restDay;
  if (changes.pausePeriod !== undefined) {
    Object.assign(updates, buildNextPauseColumns(user, changes.pausePeriod, today));
  }

  if (changes.dailyGoal !== undefined) {
    const activeGoal = getEffectiveGoals(user, today).dailyGoal;
    const applyImmediately = !user.onboardedAt || changes.dailyGoal === activeGoal;
    Object.assign(updates, {
      dailyGoal: user.onboardedAt ? activeGoal : changes.dailyGoal,
      nextGoal: applyImmediately ? null : changes.dailyGoal,
      goalChangesOn: applyImmediately ? null : addDays(today, 1),
    });
  }

  const settingsChanged = changes.dailyGoal !== undefined || changes.restDay !== undefined;
  const updated = await db.transaction(async (tx) => {
    const row = await updateUser(tx, user.id, updates);
    if (settingsChanged) await syncSettingsHistory(tx, row, today);
    return row;
  });
  return formatUserProfile(updated, now);
}

export async function completeOnboarding(db, user, { dailyGoal }, now) {
  const updated = await db.transaction(async (tx) => {
    const row = await updateUser(tx, user.id, {
      dailyGoal,
      nextGoal: null,
      goalChangesOn: null,
      onboardedAt: user.onboardedAt ?? toIso(now),
    });
    await syncSettingsHistory(tx, row, getLogicalDay(now, row.timeZone));
    return row;
  });
  return formatUserProfile(updated, now);
}

export async function startPause(db, user, now) {
  const today = getLogicalDay(now, user.timeZone);
  const updated = await updateUser(db, user.id, {
    pauseFrom: today,
    pauseTo: addDays(today, 6),
  });
  return formatUserProfile(updated, now);
}

export async function cancelPause(db, user, now) {
  const today = getLogicalDay(now, user.timeZone);
  const pauseColumns = buildNextPauseColumns(user, null, today);
  const updated = await updateUser(db, user.id, pauseColumns);
  return formatUserProfile(updated, now);
}

export async function getMyProgress(db, user, now) {
  const { facts, progress } = await getUserProgressData(db, user, now);
  return {
    today: facts.today,
    rank: progress.rank,
    drops: progress.drops,
    streak: progress.streak,
    flight: progress.flight,
    badges: progress.badges,
  };
}
