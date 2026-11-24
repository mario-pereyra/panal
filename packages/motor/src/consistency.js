import { addDays, getMonday, getSettingsForDay } from "./day.js";

export function getConsistencyLevel(filled, goal) {
  if (filled <= 0) return 0;
  if (filled >= goal) return 3;
  return filled * 2 >= goal ? 2 : 1;
}

export function getConsistencyGrid(cells, settings, today, weeks = 5) {
  const byDay = new Map();
  for (const { day } of cells) byDay.set(day, (byDay.get(day) ?? 0) + 1);

  const firstMonday = addDays(getMonday(today), -7 * (weeks - 1));
  return Array.from({ length: weeks }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, colIndex) => {
      const day = addDays(firstMonday, weekIndex * 7 + colIndex);
      const filled = byDay.get(day) ?? 0;
      return {
        day,
        filled,
        level: getConsistencyLevel(filled, getSettingsForDay(settings, day).dailyGoal),
        isToday: day === today,
        isFuture: day > today,
      };
    }),
  );
}
