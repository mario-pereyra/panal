import { DROPS } from "./drops.js";

export const FRAMES_PER_HIVE = 5;

export function getHiveProgress(cells) {
  const total = cells.length;
  const byUser = new Map();
  for (const { filledBy } of cells) {
    if (filledBy) byUser.set(filledBy, (byUser.get(filledBy) ?? 0) + 1);
  }
  const filled = cells.filter((cell) => cell.filledBy).length;
  const frame = total > 0 ? Math.floor((filled * FRAMES_PER_HIVE) / total) : 0;
  const nextFrameTarget = Math.ceil(((frame + 1) * total) / FRAMES_PER_HIVE);

  return {
    total,
    filled,
    percentage: total > 0 ? Math.round((filled * 100) / total) : 0,
    frame,
    remainingForNextFrame: frame >= FRAMES_PER_HIVE ? 0 : nextFrameTarget - filled,
    closed: total > 0 && filled >= total,
    contributions: [...byUser]
      .map(([userId, count]) => ({ userId, cells: count }))
      .sort((a, b) => b.cells - a.cells),
  };
}

export function getFrameThreshold(frame, total) {
  return Math.ceil((frame * total) / FRAMES_PER_HIVE);
}

export function getHiveFrames(filledCells, total) {
  const sorted = [...filledCells].sort((a, b) =>
    (a.filledAt ?? a.day).localeCompare(b.filledAt ?? b.day),
  );
  const frames = [];
  const bonuses = [];
  if (total <= 0) return { frames, bonuses };

  let nextFrame = 1;
  let segmentStart = 0;
  sorted.forEach((cell, index) => {
    const count = index + 1;
    while (nextFrame <= FRAMES_PER_HIVE && count >= getFrameThreshold(nextFrame, total)) {
      const segment = sorted.slice(segmentStart, count);
      const users = [...new Set(segment.map((item) => item.userId))];
      frames.push({ frame: nextFrame, day: cell.day, users });
      for (const userId of users) {
        bonuses.push({ userId, day: cell.day, drops: DROPS.hiveFrame, reason: "frame" });
      }
      if (nextFrame === FRAMES_PER_HIVE) {
        const allContributors = [...new Set(sorted.slice(0, count).map((item) => item.userId))];
        for (const userId of allContributors) {
          bonuses.push({
            userId,
            day: cell.day,
            drops: DROPS.hiveClosed,
            reason: "hive-closed",
          });
        }
      }
      segmentStart = count;
      nextFrame += 1;
    }
  });
  return { frames, bonuses };
}
