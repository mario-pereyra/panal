import { DROPS } from "./drops.js";

export const CELEBRATION_WEIGHT = {
  "hive-closed": 6,
  rank: 5,
  frame: 4,
  badge: 3,
  streak: 2,
  "daily-close": 1,
};

export function getCelebrationsBetween(before, after) {
  const celebrations = [];

  if (after.today.closed && !before.today.closed) {
    celebrations.push({
      type: "daily-close",
      drops: DROPS.dailyClose,
      streak: after.flight.streak,
    });
  }
  if (after.flight.milestones > before.flight.milestones) {
    celebrations.push({
      type: "streak",
      days: after.flight.streak,
      drops: DROPS.streakMilestone,
    });
  }
  if (after.rank.level > before.rank.level) {
    celebrations.push({
      type: "rank",
      level: after.rank.level,
      name: after.rank.name,
      nextName: after.rank.nextName,
      remainingDrops: after.rank.remainingDrops,
    });
  }

  const earnedBefore = new Set(before.badges.filter((b) => b.earned).map((b) => b.id));
  for (const badge of after.badges) {
    if (badge.earned && !earnedBefore.has(badge.id)) {
      celebrations.push({ type: "badge", id: badge.id, name: badge.name });
    }
  }

  const hivesBefore = new Map(before.hives.map((hive) => [hive.id, hive]));
  for (const hive of after.hives) {
    const previous = hivesBefore.get(hive.id);
    if (!previous) continue;
    if (hive.closed && !previous.closed) {
      celebrations.push({
        type: "hive-closed",
        hiveId: hive.id,
        hiveName: hive.name,
        drops: DROPS.hiveClosed,
      });
    } else if (hive.frame > previous.frame) {
      celebrations.push({
        type: "frame",
        hiveId: hive.id,
        hiveName: hive.name,
        frame: hive.frame,
        drops: DROPS.hiveFrame,
      });
    }
  }

  return celebrations.sort((a, b) => CELEBRATION_WEIGHT[b.type] - CELEBRATION_WEIGHT[a.type]);
}
