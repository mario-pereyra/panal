import { countDoneInWeek, getWeeklyQuota, groupBy } from "./activities.js";
import { addDays, getMonday } from "./day.js";

export function getWeeklyProgress(activity, completions, today) {
  const goal = activity.type === "recurrente" ? getWeeklyQuota(activity.rule) : null;
  if (!goal) return null;
  const done = countDoneInWeek(completions, today);
  return { done, goal, completed: done >= goal };
}

export function getCompletedQuotas(activity, completions) {
  const quota = activity.type === "recurrente" ? getWeeklyQuota(activity.rule) : null;
  if (!quota) return [];
  const byWeek = groupBy(completions, (item) => getMonday(item.day));
  return [...byWeek]
    .flatMap(([monday, weekItems]) => {
      const days = weekItems.map((item) => item.day).sort();
      return days.length >= quota ? [{ monday, day: days[quota - 1] }] : [];
    })
    .sort((a, b) => a.monday.localeCompare(b.monday));
}

export function getQuotaStreaks(completedQuotas) {
  const initial = { current: 0, previous: null, best: 0, reachedAt: {} };
  const final = completedQuotas.reduce((streak, { monday, day }) => {
    const isConsecutive = streak.previous !== null && addDays(streak.previous, 7) === monday;
    const current = isConsecutive ? streak.current + 1 : 1;
    return {
      current,
      previous: monday,
      best: Math.max(streak.best, current),
      reachedAt:
        current in streak.reachedAt ? streak.reachedAt : { ...streak.reachedAt, [current]: day },
    };
  }, initial);
  return { best: final.best, reachedAt: final.reachedAt };
}
