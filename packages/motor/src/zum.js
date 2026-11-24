import { DAY_ROLLOVER_HOUR } from "./day.js";

export const ZUM_MOODS = [
  "descansando",
  "celebrando",
  "feliz",
  "animando",
  "preocupada",
  "esperando",
];

export const WORRY_HOUR = 18;

export function getZumMood(summary, streak, now) {
  if (summary.rest) return "descansando";
  if (summary.closed) return "celebrando";
  if (summary.filled > 0) return summary.filled * 2 >= summary.goal ? "feliz" : "animando";
  const isLate = now.hour >= WORRY_HOUR || now.hour < DAY_ROLLOVER_HOUR;
  if (isLate && summary.scheduled > 0 && streak.current > 0) return "preocupada";
  return "esperando";
}
