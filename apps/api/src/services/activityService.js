import {
  activitySchema,
  getActivityPermissions,
  MAX_HIGH_PRIORITY,
  RECENT_DONE_DAYS,
} from "@panal/contratos";
import { addDays, getActivityOwner, getLogicalDay, usesHighPrioritySlot } from "@panal/motor";
import { throwError, validate } from "../errors.js";
import {
  countPendingHighPriority,
  findActivityById,
  findVisibleActivities,
  saveActivity,
} from "../repositories/activityRepository.js";
import { findHiveById, isHiveMember } from "../repositories/hiveRepository.js";
import { syncHiveClosure } from "./hiveService.js";
import { toIso } from "./profileService.js";

export function formatActivity(row, { userId, timeZone, today }) {
  const archiveTimes = [row.archivedAt, row.hiveArchivedAt]
    .filter(Boolean)
    .map((value) => Date.parse(value));
  const earliestArchiveMs = archiveTimes.length > 0 ? Math.min(...archiveTimes) : null;
  const archived = earliestArchiveMs !== null;
  const archivedAt = earliestArchiveMs !== null ? new Date(earliestArchiveMs).toISOString() : null;
  const archivedDay =
    earliestArchiveMs !== null ? getLogicalDay(earliestArchiveMs, timeZone) : null;
  const createdDay = getLogicalDay(row.createdAt, timeZone);
  const filledToday = Boolean(today && row.latestCellDay === today);
  const todayCellId = filledToday ? row.latestCellId : null;
  const completedOn =
    row.type === "unica" ? (row.firstFilledDay ?? null) : filledToday ? today : null;
  const hive = row.hiveId
    ? {
        id: row.hiveId,
        name: row.hiveName,
        ownerId: row.hiveOwnerId,
        archived: Boolean(row.hiveArchivedAt),
      }
    : null;
  const base = {
    id: row.id,
    title: row.title,
    type: row.type,
    priority: row.priority,
    rule: row.rule,
    dueDate: row.dueDate,
    hiveId: row.hiveId,
    hiveName: row.hiveName,
    assigneeId: row.assigneeId,
    createdBy: row.createdBy,
    createdAt: row.createdAt,
    createdDay,
    archived,
    archivedAt,
    archivedDay,
    firstFilledDay: row.firstFilledDay,
    filledToday,
    todayCellId,
    completedOn,
  };
  return {
    ...base,
    permissions: getActivityPermissions(base, { userId, today, hive }),
  };
}

export async function requireActivityPermission(db, activityRow, { userId, today, action }) {
  if (activityRow.hiveId) {
    if (!(await isHiveMember(db, activityRow.hiveId, userId))) throwError("forbidden");
    if (activityRow.hiveArchivedAt) throwError("hive_closed");
  }
  const permissions = getActivityPermissions(
    {
      type: activityRow.type,
      createdBy: activityRow.createdBy,
      assigneeId: activityRow.assigneeId,
      firstFilledDay: activityRow.firstFilledDay,
    },
    {
      userId,
      today,
      hive: activityRow.hiveId ? { ownerId: activityRow.hiveOwnerId, archived: false } : null,
    },
  );
  if (!permissions[action]) throwError("forbidden");
}

export async function requireTargetHive(db, { hiveId, assigneeId }, userId) {
  if (!hiveId) return;
  const hive = await findHiveById(db, hiveId);
  if (!hive) {
    throwError("invalid_data", { fields: { hiveId: "Esa colmena no existe." } });
  }
  if (!(await isHiveMember(db, hiveId, userId))) throwError("forbidden");
  if (hive.archivedAt) throwError("hive_closed");
  if (assigneeId && !(await isHiveMember(db, hiveId, assigneeId))) {
    throwError("invalid_data", {
      fields: { assigneeId: "Esa abeja no está en la colmena." },
    });
  }
}

export async function requireHighPriorityQuota(db, beforeState, afterState) {
  if (!usesHighPrioritySlot(afterState)) return;
  const owner = getActivityOwner(afterState);
  if (usesHighPrioritySlot(beforeState) && getActivityOwner(beforeState) === owner) return;
  if ((await countPendingHighPriority(db, owner, afterState.id)) >= MAX_HIGH_PRIORITY) {
    throwError("high_priority_full");
  }
}

export function getRowQuotaState(row) {
  return {
    id: row.id,
    type: row.type,
    priority: row.priority,
    hiveId: row.hiveId,
    assigneeId: row.assigneeId,
    createdBy: row.createdBy,
    archived: Boolean(row.archivedAt || row.hiveArchivedAt),
    filled: Boolean(row.firstFilledDay),
  };
}

async function syncAffectedHives(tx, hiveIds, now) {
  for (const hiveId of new Set(hiveIds.filter(Boolean))) {
    await syncHiveClosure(tx, hiveId, now, { canClose: false });
  }
}

export async function listActivities(db, user, view, now) {
  const timeZone = user.timeZone;
  const today = getLogicalDay(now, timeZone);
  const rows = await findVisibleActivities(db, user.id);
  const highPriorityCount = await countPendingHighPriority(db, user.id);
  const doneSince = addDays(today, -RECENT_DONE_DAYS);

  const activities = rows
    .filter((row) => {
      const archived = Boolean(row.archivedAt || row.hiveArchivedAt);
      if (view === "archived") return archived;
      const completedInPast =
        row.type === "unica" && row.firstFilledDay && row.firstFilledDay < today;
      if (view === "done") {
        return !archived && completedInPast && row.firstFilledDay >= doneSince;
      }
      return !archived && !completedInPast;
    })
    .map((row) => formatActivity(row, { userId: user.id, timeZone, today }));

  return { today, activities, highPriorityCount };
}

export async function putActivity(db, user, id, data, now) {
  const timeZone = user.timeZone;
  const today = getLogicalDay(now, timeZone);

  const { row, created } = await db.transaction(async (tx) => {
    const existing = await findActivityById(tx, id);
    if (existing) {
      await requireActivityPermission(tx, existing, {
        userId: user.id,
        today,
        action: "canEdit",
      });
    }
    await requireTargetHive(tx, data, user.id);
    const beforeState = existing ? getRowQuotaState(existing) : null;
    if (
      beforeState?.filled &&
      (beforeState.type !== data.type || beforeState.hiveId !== data.hiveId)
    ) {
      throwError("invalid_data", {
        fields: {
          type: "Esta celda ya tiene días llenos: no cambia de tipo ni de colmena.",
        },
      });
    }
    const createdBy = existing?.createdBy ?? user.id;
    await requireHighPriorityQuota(tx, beforeState, {
      id,
      type: data.type,
      priority: data.priority,
      hiveId: data.hiveId,
      assigneeId: data.assigneeId,
      createdBy,
      archived: beforeState?.archived ?? false,
      filled: beforeState?.filled ?? false,
    });
    await saveActivity(tx, {
      id,
      createdBy,
      hiveId: data.hiveId,
      assigneeId: data.assigneeId,
      title: data.title,
      type: data.type,
      highPriority: data.priority === "high",
      dueDate: data.dueDate,
      rule: data.rule,
      createdAt: existing?.createdAt ?? toIso(now),
      archivedAt: existing?.archivedAt ?? null,
    });
    await syncAffectedHives(tx, [existing?.hiveId, data.hiveId], now);
    return { row: await findActivityById(tx, id), created: !existing };
  });

  return {
    activity: formatActivity(row, { userId: user.id, timeZone, today }),
    created,
  };
}

export async function patchActivity(db, user, id, changes, now) {
  const timeZone = user.timeZone;
  const today = getLogicalDay(now, timeZone);

  const row = await db.transaction(async (tx) => {
    const existing = await findActivityById(tx, id);
    if (!existing) throwError("not_found");

    const archiveOnly = changes.archived !== undefined && Object.keys(changes).length === 1;
    await requireActivityPermission(tx, existing, {
      userId: user.id,
      today,
      action: archiveOnly ? "canArchive" : "canEdit",
    });
    if (!archiveOnly && changes.archived !== undefined) {
      await requireActivityPermission(tx, existing, {
        userId: user.id,
        today,
        action: "canArchive",
      });
    }

    const current = formatActivity(existing, { userId: user.id, timeZone, today });
    const changingHive = changes.hiveId !== undefined && changes.hiveId !== existing.hiveId;

    const merged = validate(activitySchema, {
      title: changes.title ?? current.title,
      type: current.type,
      priority: changes.priority ?? current.priority,
      rule: changes.rule !== undefined ? changes.rule : current.rule,
      dueDate: changes.dueDate !== undefined ? changes.dueDate : current.dueDate,
      hiveId: changes.hiveId !== undefined ? changes.hiveId : current.hiveId,
      assigneeId:
        changes.assigneeId !== undefined
          ? changes.assigneeId
          : changingHive
            ? null
            : current.assigneeId,
    });

    const beforeState = getRowQuotaState(existing);
    if (changingHive && beforeState.filled) {
      throwError("invalid_data", {
        fields: { hiveId: "Esta celda ya tiene días llenos: no cambia de colmena." },
      });
    }
    if (changingHive || merged.assigneeId !== existing.assigneeId) {
      await requireTargetHive(tx, merged, user.id);
    }

    const archived = changes.archived ?? Boolean(existing.archivedAt);
    await requireHighPriorityQuota(tx, beforeState, {
      ...beforeState,
      priority: merged.priority,
      hiveId: merged.hiveId,
      assigneeId: merged.assigneeId,
      archived: archived || Boolean(existing.hiveArchivedAt),
    });

    await saveActivity(tx, {
      id,
      createdBy: existing.createdBy,
      hiveId: merged.hiveId,
      assigneeId: merged.assigneeId,
      title: merged.title,
      type: merged.type,
      highPriority: merged.priority === "high",
      dueDate: merged.dueDate,
      rule: merged.rule,
      createdAt: existing.createdAt,
      archivedAt: archived ? (existing.archivedAt ?? toIso(now)) : null,
    });
    await syncAffectedHives(tx, [existing.hiveId, merged.hiveId], now);
    return findActivityById(tx, id);
  });

  return {
    activity: formatActivity(row, { userId: user.id, timeZone, today }),
  };
}
