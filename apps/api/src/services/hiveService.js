import { randomBytes, randomUUID } from "node:crypto";
import { getHivePermissions } from "@panal/contratos";
import { getHiveProgress, getLogicalDay } from "@panal/motor";
import { throwError, validateUuid } from "../errors.js";
import {
  findHiveActivities,
  unassignPendingActivities,
} from "../repositories/activityRepository.js";
import { findFilledCellsByHive } from "../repositories/cellRepository.js";
import {
  addHiveMember,
  createHive,
  createInvitation,
  findActiveInvitation,
  findHiveById,
  findHiveCells,
  findHiveMembers,
  findHivesByUser,
  findInvitationByCode,
  isHiveMember,
  removeHiveMember,
  revokeInvitations,
  updateHive,
} from "../repositories/hiveRepository.js";
import { formatActivity } from "./activityService.js";
import { toIso } from "./profileService.js";

export const INVITATION_DAYS = 7;

export async function requireMemberHive(db, hiveId, userId) {
  validateUuid(hiveId);
  const hive = await findHiveById(db, hiveId);
  if (!hive) throwError("not_found");
  if (!(await isHiveMember(db, hiveId, userId))) throwError("forbidden");
  return hive;
}

export async function buildHiveSummaries(db, hives, userId) {
  if (hives.length === 0) return [];
  const ids = hives.map((hive) => hive.id);
  const allMembers = await findHiveMembers(db, ids);
  const allCells = await findHiveCells(db, ids);

  return hives.map((hive) => {
    const hiveCells = allCells.filter((cell) => cell.hiveId === hive.id);
    const hiveMembers = allMembers.filter((member) => member.hiveId === hive.id);
    const progress = getHiveProgress(hiveCells);
    const archived = Boolean(hive.archivedAt);
    const permissions = getHivePermissions(
      { ownerId: hive.ownerId, archived },
      { userId, memberCount: hiveMembers.length },
    );
    const members = hiveMembers.map((member) => ({
      id: member.id,
      name: member.name,
      color: member.color,
      joinedAt: member.joinedAt,
      isOwner: member.id === hive.ownerId,
      active: true,
      cellsFilled: hiveCells.filter((cell) => cell.filledBy === member.id).length,
    }));

    return {
      id: hive.id,
      name: hive.name,
      description: hive.description,
      ownerId: hive.ownerId,
      dueDate: hive.dueDate,
      createdAt: hive.createdAt,
      closedAt: hive.closedAt,
      archived,
      archivedAt: hive.archivedAt,
      members,
      progress,
      permissions,
      cells: hiveCells.map((cell) => ({
        activityId: cell.activityId,
        filledBy: cell.filledBy,
      })),
    };
  });
}

export async function buildHiveDetail(db, hive, user, now) {
  const timeZone = user.timeZone;
  const today = getLogicalDay(now, timeZone);
  const [summary] = await buildHiveSummaries(db, [hive], user.id);
  const activityRows = await findHiveActivities(db, hive.id);
  const activities = activityRows.map((row) => ({
    ...formatActivity(row, { userId: user.id, timeZone, today }),
    filled: Boolean(row.cellId),
    cellId: row.cellId ?? null,
    filledBy: row.filledBy ?? null,
    filledDay: row.filledDay ?? null,
  }));
  const filledCells = await findFilledCellsByHive(db, hive.id);

  return {
    ...summary,
    myUserId: user.id,
    today,
    activities,
    filledCells,
  };
}

export async function findActiveHiveDetail(db, activeHives, user, now) {
  if (activeHives.length === 0) return null;
  const cells = await findHiveCells(
    db,
    activeHives.map((hive) => hive.id),
  );
  const getLastFilledMs = (hive) =>
    Math.max(
      0,
      ...cells
        .filter((cell) => cell.hiveId === hive.id && cell.filledAt)
        .map((cell) => Date.parse(cell.filledAt)),
    );
  const chosen = activeHives.reduce((best, current) =>
    getLastFilledMs(current) > getLastFilledMs(best) ? current : best,
  );
  return buildHiveDetail(db, chosen, user, now);
}

export async function syncHiveClosure(db, hiveId, now, { canClose }) {
  if (!hiveId) return;
  const hive = await findHiveById(db, hiveId);
  if (!hive) return;
  const cells = await findHiveCells(db, [hiveId]);
  const { closed } = getHiveProgress(cells);
  if (closed && !hive.closedAt && canClose) {
    await updateHive(db, hiveId, { closedAt: toIso(now) });
  } else if (!closed && hive.closedAt) {
    await updateHive(db, hiveId, { closedAt: null });
  }
}

export async function listHives(db, user, now) {
  const today = getLogicalDay(now, user.timeZone);
  const rows = await findHivesByUser(db, user.id);
  const hives = await buildHiveSummaries(db, rows, user.id);
  return { today, hives };
}

export async function createNewHive(db, user, data, now) {
  const nowIso = toIso(now);
  const id = randomUUID();
  const hive = await db.transaction(async (tx) => {
    await createHive(tx, {
      id,
      name: data.name,
      description: data.description,
      dueDate: data.dueDate,
      ownerId: user.id,
      createdAt: nowIso,
    });
    await addHiveMember(tx, id, user.id, nowIso);
    const created = await findHiveById(tx, id);
    return buildHiveDetail(tx, created, user, now);
  });
  return { hive };
}

export async function getHiveDetail(db, user, hiveId, now) {
  const hive = await requireMemberHive(db, hiveId, user.id);
  return { hive: await buildHiveDetail(db, hive, user, now) };
}

export async function updateExistingHive(db, user, hiveId, changes, now) {
  validateUuid(hiveId);
  const hive = await db.transaction(async (tx) => {
    const existing = await requireMemberHive(tx, hiveId, user.id);
    const members = await findHiveMembers(tx, [existing.id]);
    const permissions = getHivePermissions(
      { ownerId: existing.ownerId, archived: Boolean(existing.archivedAt) },
      { userId: user.id, memberCount: members.length },
    );

    const { archived, ownerId, ...editableFields } = changes;
    const isAllowed =
      (Object.keys(editableFields).length === 0 || permissions.canEdit) &&
      (archived === undefined ||
        archived === Boolean(existing.archivedAt) ||
        (archived ? permissions.canArchive : permissions.canRestore)) &&
      (ownerId === undefined || ownerId === existing.ownerId || permissions.canTransfer);

    if (!isAllowed) throwError("forbidden");

    if (ownerId && !members.some((member) => member.id === ownerId)) {
      throwError("invalid_data", {
        fields: { ownerId: "Esa abeja no está en la colmena." },
      });
    }

    const updates = {};
    if (ownerId !== undefined) updates.ownerId = ownerId;
    if (changes.name !== undefined) updates.name = changes.name;
    if (changes.description !== undefined) updates.description = changes.description;
    if (changes.dueDate !== undefined) updates.dueDate = changes.dueDate;
    if (changes.archived !== undefined) {
      updates.archivedAt = changes.archived ? (existing.archivedAt ?? toIso(now)) : null;
    }

    await updateHive(tx, existing.id, updates);
    const updated = await findHiveById(tx, existing.id);
    return buildHiveDetail(tx, updated, user, now);
  });

  return { hive };
}

export async function removeMemberFromHive(db, user, hiveId, targetUserId, now) {
  validateUuid(hiveId);
  validateUuid(targetUserId);
  await db.transaction(async (tx) => {
    const hive = await requireMemberHive(tx, hiveId, user.id);
    const members = await findHiveMembers(tx, [hive.id]);
    const permissions = getHivePermissions(
      { ownerId: hive.ownerId, archived: Boolean(hive.archivedAt) },
      { userId: user.id, memberCount: members.length },
    );

    if (targetUserId === user.id) {
      if (!permissions.canLeave) throwError("owner_cannot_leave");
    } else if (!permissions.canRemoveMember) {
      throwError("forbidden");
    }

    if (!members.some((member) => member.id === targetUserId)) {
      throwError("not_found");
    }

    await removeHiveMember(tx, hive.id, targetUserId, toIso(now));
    await unassignPendingActivities(tx, hive.id, targetUserId);
  });
}

export async function getHiveInvitation(db, user, hiveId, now) {
  const hive = await requireMemberHive(db, hiveId, user.id);
  const active = await findActiveInvitation(db, hive.id, toIso(now));
  return {
    invitation: active ? { code: active.code, expiresAt: active.expiresAt } : null,
  };
}

export async function createHiveInvitation(db, user, hiveId, now) {
  const hive = await requireMemberHive(db, hiveId, user.id);
  if (hive.archivedAt) throwError("hive_closed");
  const invitation = {
    code: randomBytes(16).toString("base64url"),
    expiresAt: toIso(now + INVITATION_DAYS * 24 * 60 * 60 * 1000),
  };
  await db.transaction((tx) =>
    createInvitation(tx, {
      ...invitation,
      hiveId: hive.id,
      createdBy: user.id,
      createdAt: toIso(now),
    }),
  );
  return { invitation };
}

export async function revokeHiveInvitation(db, user, hiveId, now) {
  const hive = await requireMemberHive(db, hiveId, user.id);
  await db.transaction((tx) => revokeInvitations(tx, hive.id, toIso(now)));
}

async function requireOpenInvitation(db, code, now) {
  const invitation = code.length <= 64 ? await findInvitationByCode(db, code) : undefined;
  if (!invitation) throwError("not_found");
  const isClosed =
    invitation.revokedAt || invitation.hiveArchivedAt || Date.parse(invitation.expiresAt) <= now;
  if (isClosed) throwError("invite_expired");
  return invitation;
}

export async function getInvitationByCode(db, currentUser, code, now) {
  const invitation = await requireOpenInvitation(db, code, now);
  const members = await findHiveMembers(db, [invitation.hiveId]);
  const alreadyMember = currentUser
    ? members.some((member) => member.id === currentUser.id)
    : false;

  return {
    invitation: {
      code: invitation.code,
      expiresAt: invitation.expiresAt,
      active: true,
      alreadyMember,
      invitedBy: { name: invitation.invitedByName },
      hive: {
        id: invitation.hiveId,
        name: invitation.hiveName,
        description: invitation.hiveDescription,
        memberCount: members.length,
        members: members.map(({ id, name, color }) => ({ id, name, color })),
      },
    },
  };
}

export async function acceptInvitation(db, user, code, now) {
  const hive = await db.transaction(async (tx) => {
    const invitation = await requireOpenInvitation(tx, code, now);
    if (await isHiveMember(tx, invitation.hiveId, user.id)) {
      throwError("already_member");
    }
    await addHiveMember(tx, invitation.hiveId, user.id, toIso(now));
    const joinedHive = await findHiveById(tx, invitation.hiveId);
    return buildHiveDetail(tx, joinedHive, user, now);
  });

  return { hiveId: hive.id, hive };
}
