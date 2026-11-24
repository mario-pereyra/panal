import { addDays, getMonday, getWeekday } from "./day.js";

export const RULE_KINDS = ["diaria", "dias", "veces", "mes"];

export function getActivityOwner(activity) {
  return activity.hiveId ? (activity.assigneeId ?? null) : activity.createdBy;
}

export function usesHighPrioritySlot(activity) {
  return Boolean(
    activity &&
    activity.type === "unica" &&
    activity.priority === "high" &&
    !activity.archived &&
    !activity.filled &&
    getActivityOwner(activity),
  );
}

function getDaysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function doesRuleMatchDay(rule, day) {
  if (!rule || rule.kind === "diaria" || rule.kind === "veces") return true;
  if (rule.kind === "dias") return rule.days.includes(getWeekday(day));
  if (rule.kind === "mes") {
    const [year, month, dayOfMonth] = day.split("-").map(Number);
    return dayOfMonth === Math.min(rule.day, getDaysInMonth(year, month));
  }
  return false;
}

export function* getOccurrences(rule, fromDay) {
  let day = fromDay;
  while (true) {
    if (doesRuleMatchDay(rule, day)) yield day;
    day = addDays(day, 1);
  }
}

export function take(iterable, count) {
  const result = [];
  if (count <= 0) return result;
  for (const item of iterable) {
    result.push(item);
    if (result.length >= count) break;
  }
  return result;
}

export function getWeeklyQuota(rule) {
  if (!rule) return null;
  if (rule.kind === "diaria") return 7;
  if (rule.kind === "dias") return rule.days.length;
  if (rule.kind === "veces") return rule.count;
  return null;
}

export function countDoneInWeek(completions, day) {
  const monday = getMonday(day);
  return completions.filter((item) => item.day >= monday && item.day <= day).length;
}

export function isAliveOnDay(activity, day) {
  if (activity.createdDay && activity.createdDay > day) return false;
  return !(activity.archivedDay && activity.archivedDay <= day);
}

export function isDueToday(activity, rule, completions, today) {
  if (activity.type === "unica") {
    const doneBefore = completions.some((item) => item.day < today);
    const overdue = Boolean(activity.dueDate && activity.dueDate < today);
    return { due: !doneBefore, overdue: !doneBefore && overdue };
  }
  if (rule?.kind === "veces") {
    const filledToday = completions.some((item) => item.day === today);
    const doneBeforeToday = countDoneInWeek(completions, today) - (filledToday ? 1 : 0);
    return { due: filledToday || doneBeforeToday < rule.count, overdue: false };
  }
  return { due: doesRuleMatchDay(rule, today), overdue: false };
}

export function countScheduledForDay(activities, completionsByActivity, day) {
  return activities.filter(
    (activity) =>
      isAliveOnDay(activity, day) &&
      isDueToday(activity, activity.rule, completionsByActivity.get(activity.id) ?? [], day).due,
  ).length;
}

export function groupBy(list, getKey) {
  const groups = new Map();
  for (const item of list) {
    const key = getKey(item);
    const group = groups.get(key);
    if (group) group.push(item);
    else groups.set(key, [item]);
  }
  return groups;
}
