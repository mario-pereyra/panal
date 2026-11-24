import { getActivityPermissions } from "@panal/contratos";
import { getCellDrops } from "@panal/motor";
import { formatActivitySubtitle } from "../../lib/formatters.js";

export function buildCellRow(activity, context = {}, extra = {}) {
  const merged = { ...context, ...extra };
  const {
    userId = null,
    today = null,
    hive = activity.hive ?? null,
    filledBefore = 0,
    ...overrides
  } = merged;

  const filled = overrides.filled ?? Boolean(activity.filledToday ?? activity.filled);
  const dueToday = overrides.dueToday ?? Boolean(today && activity.dueDate === today);
  const overdue =
    overrides.overdue ?? Boolean(!filled && today && activity.dueDate && activity.dueDate < today);
  const cellId = overrides.cellId ?? activity.todayCellId ?? activity.cellId ?? null;
  const hiveName =
    overrides.hiveName ?? activity.hiveName ?? activity.hive?.name ?? hive?.name ?? null;
  const archived = overrides.archived ?? Boolean(activity.archived || activity.archivedAt);
  const permissions =
    overrides.permissions ??
    activity.permissions ??
    (userId && today
      ? getActivityPermissions(activity, { userId, today, hive })
      : { canEdit: false, canArchive: false, canChangeType: false });
  const drops =
    "drops" in overrides
      ? overrides.drops
      : getCellDrops({ ...activity, overdue }, { filledBefore });

  const row = {
    id: activity.id,
    title: activity.title,
    type: activity.type,
    priority: activity.priority,
    rule: activity.rule,
    dueDate: activity.dueDate,
    hiveId: activity.hiveId ?? null,
    hiveName,
    assigneeId: activity.assigneeId ?? null,
    createdBy: activity.createdBy ?? null,
    archived,
    dueToday,
    overdue,
    filled,
    cellId,
    drops,
    permissions,
    ...overrides,
  };

  const subtitle = overrides.subtitle ?? formatActivitySubtitle(row, today);

  return {
    ...row,
    subtitle,
    detail: subtitle,
  };
}
