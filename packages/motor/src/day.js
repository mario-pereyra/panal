export const DAY_ROLLOVER_HOUR = 3;

export const WEEKDAY_NAMES = [
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
  "domingo",
];

const formatters = new Map();

function getLocalParts(timestamp, timeZone) {
  let formatter = formatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23",
    });
    formatters.set(timeZone, formatter);
  }
  const parts = {};
  for (const { type, value } of formatter.formatToParts(new Date(timestamp))) {
    parts[type] = value;
  }
  return parts;
}

export function getLocalHour(timestamp, timeZone) {
  return Number(getLocalParts(timestamp, timeZone).hour);
}

export function getLogicalDay(timestamp, timeZone) {
  const parts = getLocalParts(timestamp, timeZone);
  const day = `${parts.year}-${parts.month}-${parts.day}`;
  return Number(parts.hour) < DAY_ROLLOVER_HOUR ? addDays(day, -1) : day;
}

export function addDays(day, amount) {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

export function getWeekday(day) {
  return (new Date(`${day}T00:00:00Z`).getUTCDay() + 6) % 7;
}

export function getMonday(day) {
  return addDays(day, -getWeekday(day));
}

export function getSettingsForDay(settings, day) {
  const { history } = settings;
  if (!history?.length) return settings;
  let active = history[0];
  for (const entry of history) {
    if (entry.from > day) break;
    active = entry;
  }
  return { ...settings, dailyGoal: active.dailyGoal, restDay: active.restDay };
}

export function isRestDay(settings, day) {
  const { restDay, pausePeriod } = getSettingsForDay(settings, day);
  if (restDay != null && getWeekday(day) === restDay) return true;
  return Boolean(pausePeriod && day >= pausePeriod.from && day <= pausePeriod.to);
}
