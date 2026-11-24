import { addDays, getMonday } from "@panal/motor";
import { findHivesByUser } from "../repositories/hiveRepository.js";
import { formatFilledCell } from "./cellService.js";
import { findActiveHiveDetail } from "./hiveService.js";
import { formatUserProfile, getDropsByCell, getUserProgressData } from "./profileService.js";

const CONSISTENCY_WEEKS = 5;

export async function getDashboard(db, user, now) {
  const { facts, progress } = await getUserProgressData(db, user, now);
  const { today } = facts;

  const userHives = await findHivesByUser(db, user.id);
  const activeHives = userHives.filter((hive) => !hive.archivedAt);
  const activeHiveIds = new Set(activeHives.map((hive) => hive.id));

  const activities = facts.activities
    .filter(({ activity, inHoneycomb, firstFilledDay }) => {
      if (!inHoneycomb || activity.archived) return false;
      if (activity.hiveId && !activeHiveIds.has(activity.hiveId)) return false;
      return !(activity.type === "unica" && firstFilledDay && firstFilledDay < today);
    })
    .map(({ activity }) => activity);

  const sinceDay = addDays(getMonday(today), -7 * (CONSISTENCY_WEEKS - 1));
  const dropsByCell = getDropsByCell(progress);
  const filledCells = facts.cells
    .filter((cell) => cell.day >= sinceDay)
    .map((cell) => formatFilledCell(cell, user.timeZone, dropsByCell.get(cell.id) ?? 0));

  const activeHive = await findActiveHiveDetail(db, activeHives, user, now);

  return {
    today,
    user: formatUserProfile(user, now),
    settingsHistory: facts.input.settings.history,
    activities,
    filledCells,
    progress: {
      flightUntilYesterday: progress.flightUntilYesterday,
      dropsUntilYesterday: progress.drops.untilYesterday,
      todayBonuses: progress.drops.todayBonuses,
    },
    activeHive,
  };
}
