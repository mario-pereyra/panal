const NO_PERMISSIONS = { canEdit: false, canArchive: false, canChangeType: false };

export function getActivityPermissions(activity, { userId, today, hive }) {
  const completedInPast =
    activity.type === "unica" &&
    activity.firstFilledDay !== null &&
    activity.firstFilledDay < today;
  if (completedInPast || hive?.archived) return NO_PERMISSIONS;

  const isCreator = activity.createdBy === userId;
  if (!hive) {
    return {
      canEdit: isCreator,
      canArchive: isCreator,
      canChangeType: isCreator && !activity.firstFilledDay,
    };
  }

  const isOwner = hive.ownerId === userId;
  const canEdit = isOwner || isCreator || activity.assigneeId === userId;
  return {
    canEdit,
    canArchive: activity.firstFilledDay ? isOwner : canEdit,
    canChangeType: false,
  };
}

export function getHivePermissions({ ownerId, archived }, { userId, memberCount }) {
  const isOwner = ownerId === userId;
  return {
    canEdit: isOwner && !archived,
    canArchive: isOwner && !archived,
    canRestore: isOwner && archived,
    canRemoveMember: isOwner && !archived,
    canTransfer: isOwner && !archived && memberCount > 1,
    canLeave: !isOwner || memberCount === 1,
  };
}
