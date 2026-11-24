import { getActivityPermissions, getHivePermissions } from "@panal/contratos";
import { FRAMES_PER_HIVE, getCellDrops, getFrameThreshold, getLogicalDay } from "@panal/motor";
import { createSelector } from "@reduxjs/toolkit";
import { getBeeColor } from "../../core/dashboard/beeColors.js";
import { formatCount, formatShortDate } from "../../lib/formatters.js";
import { selectHiveById, selectHivesList, selectMe } from "../../store/api.js";

const DEPARTED_MEMBER_COLOR = "var(--lino-borde)";
const FRAME_ORDINALS = ["primer", "segundo", "tercer", "cuarto", "quinto"];

function readHivesList(state) {
  const data = selectHivesList(state);
  return data?.hives ?? (Array.isArray(data) ? data : []);
}

function readHiveDetail(state, id) {
  if (!id) return null;
  const selectorOrData = selectHiveById(id);
  const raw =
    typeof selectorOrData === "function" ? selectorOrData(state) : selectHiveById(state, id);
  return raw?.hive ?? raw ?? null;
}

export function formatFrameProgress(progress) {
  if (!progress) return "";
  if (progress.closed) {
    return `Cuadro ${FRAMES_PER_HIVE} de ${FRAMES_PER_HIVE}. Colmena cerrada.`;
  }
  if (progress.total === 0) return "Sin celdas todavía.";
  const remaining = progress.remainingForNextFrame ?? 0;
  const verb = remaining === 1 ? "Falta" : "Faltan";
  const ordinal = FRAME_ORDINALS[progress.frame] ?? `${progress.frame + 1}`;
  return `Cuadro ${progress.frame} de ${FRAMES_PER_HIVE}. ${verb} ${formatCount(remaining, "celda", "celdas")} para el ${ordinal}.`;
}

function formatHiveCellSubtitle({ filled, filledByMember, assignee, isMine, filledDay, dueDate }) {
  let detail;
  if (filled) {
    const author = filledByMember?.name ?? "una abeja que ya salió";
    detail = filledDay
      ? `Llenada por ${author} el ${formatShortDate(filledDay)}`
      : `Llenada por ${author}`;
  } else if (assignee) {
    detail = isMine ? "Asignada a ti" : `Asignada a ${assignee.name}`;
  } else {
    detail = "Libre: la llena quien llegue primero";
  }
  return dueDate && !filled ? `${detail} · vence el ${formatShortDate(dueDate)}` : detail;
}

export const selectClosedHives = createSelector([readHivesList], (hives) =>
  hives.filter((hive) => hive.progress?.closed),
);

export const selectArchivedHives = createSelector([readHivesList], (hives) =>
  hives.filter((hive) => Boolean(hive.archived || hive.archivedAt) && !hive.progress?.closed),
);

export const selectHiveDetailView = createSelector(
  [(state, id) => readHiveDetail(state, id), selectMe],
  (hive, me) => {
    if (!hive) return null;
    const timeZone = me?.timeZone;
    const myUserId = hive.myUserId ?? me?.id ?? null;
    const today = hive.today ?? me?.today;
    const isArchived = Boolean(hive.archived || hive.archivedAt);
    const isClosed = Boolean(hive.progress?.closed || isArchived);
    const activities = hive.activities ?? [];

    const pendingByMember = new Map();
    for (const activity of activities) {
      const isFilled = Boolean(activity.filled || activity.filledBy);
      if (!isFilled && activity.assigneeId) {
        pendingByMember.set(
          activity.assigneeId,
          (pendingByMember.get(activity.assigneeId) ?? 0) + 1,
        );
      }
    }

    const membersById = new Map(
      (hive.members ?? []).map((member, index) => {
        const colorIndex = typeof member.color === "number" ? member.color : index;
        const cssColor =
          typeof member.color === "string" && member.color.startsWith("var(")
            ? member.color
            : getBeeColor(colorIndex);
        return [
          member.id,
          {
            ...member,
            colorIndex,
            cssColor,
            initial: member.name.charAt(0).toUpperCase(),
            joinedDay:
              timeZone && member.joinedAt ? getLogicalDay(member.joinedAt, timeZone) : null,
            pendingCount: pendingByMember.get(member.id) ?? 0,
          },
        ];
      }),
    );

    const rows = activities.map((activity) => {
      const filledByMember = activity.filledBy ? membersById.get(activity.filledBy) : null;
      const assignee = activity.assigneeId ? membersById.get(activity.assigneeId) : null;
      const filled = Boolean(activity.filled || activity.filledBy);
      const isMine = activity.assigneeId === myUserId;
      const isUnassigned = !activity.assigneeId;
      const overdue = Boolean(!filled && activity.dueDate && today && activity.dueDate < today);
      const subtitle = formatHiveCellSubtitle({
        filled,
        filledByMember,
        assignee,
        isMine,
        filledDay: activity.filledDay ?? activity.completedOn,
        dueDate: activity.dueDate,
      });

      return {
        id: activity.id,
        title: activity.title,
        subtitle,
        detail: subtitle,
        type: "unica",
        priority: activity.priority,
        dueDate: activity.dueDate,
        overdue,
        hiveId: hive.id,
        filled,
        cellId: activity.cellId ?? activity.todayCellId ?? null,
        isMine,
        isUnassigned,
        canToggle: !isClosed && (filled ? activity.filledBy === myUserId : isMine || isUnassigned),
        permissions:
          activity.permissions ??
          getActivityPermissions(activity, {
            userId: myUserId,
            today,
            hive: { ownerId: hive.ownerId, archived: isArchived },
          }),
        drops: getCellDrops({
          type: "unica",
          priority: activity.priority,
          overdue,
        }),
        color: filled ? (filledByMember?.cssColor ?? DEPARTED_MEMBER_COLOR) : null,
        initial: filled ? (filledByMember?.initial ?? null) : null,
      };
    });

    const members = [...membersById.values()];
    const permissions =
      hive.permissions ??
      getHivePermissions(
        { ownerId: hive.ownerId, archived: isArchived },
        { userId: myUserId, memberCount: members.length },
      );

    return {
      ...hive,
      today,
      myUserId,
      isClosed,
      permissions,
      needsMembers: members.length === 1 && !isClosed,
      members,
      frames: Array.from({ length: FRAMES_PER_HIVE }, (_, index) =>
        rows
          .slice(getFrameThreshold(index, rows.length), getFrameThreshold(index + 1, rows.length))
          .map(({ id, color, initial }) => ({ id, color, initial })),
      ),
      rows,
    };
  },
);

export function filterHiveRowsByTab(rows, tab) {
  if (!rows) return [];
  switch (tab) {
    case "mine":
      return rows.filter((row) => row.isMine);
    case "unassigned":
      return rows.filter((row) => row.isUnassigned && !row.filled);
    case "filled":
      return rows.filter((row) => row.filled);
    default:
      return rows.filter((row) => !row.filled);
  }
}
