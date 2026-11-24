import { getSettingsForDay, isRestDay } from "./day.js";
import { DROPS } from "./drops.js";

export function getDaySummary(facts, settings, day) {
  const dayCells = facts.cells.filter((cell) => cell.day === day);
  const filled = dayCells.length;
  const { scheduled } = facts;
  const { dailyGoal } = getSettingsForDay(settings, day);
  const goal = scheduled > 0 ? Math.min(dailyGoal, scheduled) : dailyGoal;
  const rest = isRestDay(settings, day);
  const closed = !rest && scheduled > 0 && filled >= goal;
  const cellDrops = dayCells.reduce((sum, cell) => sum + cell.drops, 0);
  const closeBonus = closed ? DROPS.dailyClose : 0;
  return {
    day,
    filled,
    scheduled,
    goal,
    remaining: Math.max(0, goal - filled),
    closed,
    rest,
    cellDrops,
    closeBonus,
    drops: cellDrops + closeBonus,
  };
}
