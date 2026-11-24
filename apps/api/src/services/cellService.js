import {
  calculateProgress,
  getCelebrationsBetween,
  getLocalHour,
  getLogicalDay,
} from "@panal/motor";
import { isUniqueViolation } from "../db/client.js";
import { throwError } from "../errors.js";
import { findActivityById } from "../repositories/activityRepository.js";
import {
  deleteCell,
  findCellById,
  insertCell,
  isActivityFilled,
} from "../repositories/cellRepository.js";
import { isHiveMember } from "../repositories/hiveRepository.js";
import { formatActivity } from "./activityService.js";
import { syncHiveClosure } from "./hiveService.js";
import { getDropsByCell, loadProgressFacts, toIso } from "./profileService.js";

export function formatFilledCell(cell, timeZone, drops) {
  return {
    id: cell.id,
    activityId: cell.activityId,
    userId: cell.userId,
    day: cell.day,
    filledAt: toIso(cell.filledAt),
    localHour: getLocalHour(cell.filledAt, timeZone),
    drops,
  };
}

function appendCellToProgressInput(input, newCell, activityRow, user, today) {
  const knownIds = new Set([
    ...input.activities.map((a) => a.id),
    ...input.otherActivities.map((a) => a.id),
  ]);
  const otherActivities = knownIds.has(activityRow.id)
    ? input.otherActivities
    : [
        ...input.otherActivities,
        formatActivity(activityRow, {
          userId: user.id,
          timeZone: user.timeZone,
          today,
        }),
      ];

  const hives = activityRow.hiveId
    ? input.hives.map((hive) =>
        hive.id === activityRow.hiveId
          ? {
              ...hive,
              filledCells: [
                ...hive.filledCells,
                {
                  userId: user.id,
                  day: newCell.day,
                  filledAt: newCell.filledAt,
                },
              ],
            }
          : hive,
      )
    : input.hives;

  return {
    ...input,
    otherActivities,
    cells: [...input.cells, newCell],
    hives,
  };
}

export async function fillCell(db, user, id, { activityId }, clock) {
  const execute = () =>
    db.transaction(async (tx) => {
      const now = clock();
      const existing = await findCellById(tx, id);
      if (existing) {
        if (existing.userId !== user.id || existing.activityId !== activityId) {
          throwError("cell_already_filled");
        }
        const facts = await loadProgressFacts(tx, user, now);
        const progress = calculateProgress(facts.input);
        return {
          cell: formatFilledCell(existing, user.timeZone, getDropsByCell(progress).get(id) ?? 0),
          celebrations: [],
          todayBonuses: progress.drops.todayBonuses,
        };
      }

      const activity = await findActivityById(tx, activityId);
      if (!activity) throwError("not_found");
      if (activity.hiveId) {
        if (!(await isHiveMember(tx, activity.hiveId, user.id))) throwError("forbidden");
        if (activity.hiveArchivedAt) throwError("hive_closed");
        if (activity.assigneeId && activity.assigneeId !== user.id) {
          throwError("cell_not_assigned");
        }
      } else if (activity.createdBy !== user.id) {
        throwError("forbidden");
      }
      if (activity.archivedAt) throwError("not_found");

      const day = getLogicalDay(now, user.timeZone);
      if (await isActivityFilled(tx, activityId, activity.type === "unica" ? null : day)) {
        throwError("cell_already_filled");
      }

      const facts = await loadProgressFacts(tx, user, now);
      const before = calculateProgress(facts.input);

      const filledAt = toIso(now);
      const newCell = {
        id,
        activityId,
        userId: user.id,
        day,
        filledAt,
        localHour: getLocalHour(filledAt, user.timeZone),
      };

      await insertCell(tx, newCell);
      await syncHiveClosure(tx, activity.hiveId, now, { canClose: true });

      const afterInput = appendCellToProgressInput(facts.input, newCell, activity, user, day);
      const after = calculateProgress(afterInput);

      return {
        cell: formatFilledCell(newCell, user.timeZone, getDropsByCell(after).get(id) ?? 0),
        celebrations: getCelebrationsBetween(before, after),
        todayBonuses: after.drops.todayBonuses,
      };
    });

  try {
    return await execute();
  } catch (error) {
    if (isUniqueViolation(error, "celdas_llenas_pkey")) return execute();
    if (isUniqueViolation(error)) throwError("cell_already_filled");
    throw error;
  }
}

export async function unfillCell(db, user, id, clock) {
  await db.transaction(async (tx) => {
    const cell = await findCellById(tx, id);
    if (!cell) return;
    if (cell.userId !== user.id) throwError("forbidden");
    const activity = await findActivityById(tx, cell.activityId);
    await deleteCell(tx, id);
    await syncHiveClosure(tx, activity?.hiveId ?? null, clock(), { canClose: false });
  });
}
