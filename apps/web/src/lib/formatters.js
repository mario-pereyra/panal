import { WEEKDAY_NAMES } from "@panal/motor";

export const WEEKDAY_SHORT_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

export const WEEKDAY_FULL_LABELS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export const ZUM_ALT_TEXT = {
  esperando: "Zum, la abeja de Panal, te espera con una sonrisa",
  animando: "Zum, la abeja de Panal, señala la siguiente celda",
  feliz: "Zum, la abeja de Panal, vuela contenta",
  celebrando: "Zum, la abeja de Panal, celebra con los brazos en alto entre gotas de miel",
  preocupada: "Zum, la abeja de Panal, mira con ternura y un poco de preocupación",
  descansando: "Zum, la abeja de Panal, duerme tranquila",
};

const NUMBER_WORDS = ["cero", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete"];

const listFormatter = new Intl.ListFormat("es", { style: "long", type: "conjunction" });

const dateFormatter = new Intl.DateTimeFormat("es", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function numberToWords(value) {
  return NUMBER_WORDS[value] ?? String(value);
}

function getDateParts(day) {
  const parts = {};
  for (const { type, value } of dateFormatter.formatToParts(new Date(`${day}T00:00:00Z`))) {
    parts[type] = value;
  }
  return parts;
}

export function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural;
}

export function formatCount(count, singular, plural) {
  return `${count} ${pluralize(count, singular, plural)}`;
}

export function formatDrops(count) {
  return formatCount(count, "gota", "gotas");
}

export function formatDays(count) {
  return formatCount(count, "día", "días");
}

export function formatCells(count) {
  return formatCount(count, "celda", "celdas");
}

export function formatShortDate(day) {
  if (!day) return "";
  const { day: dayNumber, month } = getDateParts(day);
  return `${dayNumber} de ${month}`;
}

export function formatLongDate(day) {
  if (!day) return "";
  const { weekday, day: dayNumber, month } = getDateParts(day);
  return `${capitalize(weekday)} ${dayNumber} de ${month}`;
}

export function formatMonthDay(day) {
  if (!day) return "";
  const { weekday, day: dayNumber } = getDateParts(day);
  return `${weekday} ${dayNumber}`;
}

export function formatRelativeDue(dueDate, today) {
  if (!dueDate) return "";
  if (!today) return formatShortDate(dueDate);
  const diff = Math.round(
    (Date.parse(`${dueDate}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000,
  );
  if (diff === 0) return "Se entrega hoy";
  if (diff === 1) return "Se entrega mañana";
  if (diff > 1) return `Faltan ${diff} días`;
  return `Se entregó hace ${formatDays(-diff)}`;
}

export function formatRuleLabel(rule) {
  if (!rule) return "";
  const kind = rule.kind ?? rule.clase;
  switch (kind) {
    case "diaria":
      return "diaria";
    case "dias": {
      const days = rule.days ?? rule.dias ?? [];
      if (days.length === 7) return "diaria";
      return listFormatter.format([...days].sort((a, b) => a - b).map((day) => WEEKDAY_NAMES[day]));
    }
    case "veces": {
      const count = rule.count ?? rule.veces ?? 1;
      return `${formatCount(count, "vez", "veces")} por semana`;
    }
    case "mes":
      return `el día ${rule.day ?? rule.dia} de cada mes`;
    default:
      return "";
  }
}

export function formatActivitySubtitle(activity, today) {
  if (!activity) return "";
  if (activity.type === "recurrente") {
    const ruleText = formatRuleLabel(activity.rule);
    return ruleText ? `Recurrente · ${ruleText}` : "Recurrente";
  }
  const parts = ["Única"];
  const dueDate = activity.dueDate;
  const isOverdue = activity.overdue ?? Boolean(dueDate && today && dueDate < today);
  const isDueToday = activity.dueToday ?? Boolean(dueDate && today && dueDate === today);
  if (isOverdue && dueDate) parts.push(`vencía el ${formatShortDate(dueDate)}`);
  else if (isDueToday) parts.push("vence hoy");
  else if (dueDate) parts.push(`vence el ${formatShortDate(dueDate)}`);
  const hiveName = activity.hiveName ?? activity.hive?.name ?? null;
  if (hiveName) parts.push(hiveName);
  return parts.join(" · ");
}

export function formatStreakMessage(streak, summary) {
  if (summary) {
    const {
      filled = 0,
      goal = 5,
      remaining = Math.max(0, goal - filled),
      scheduled = goal,
      closed = false,
      rest = false,
    } = summary;
    const progressText = `Llevas ${filled} de ${goal} celdas llenas.`;

    if (rest) return "Hoy es día sin flores. Zum descansa y tu racha también.";
    if (closed) {
      return `${capitalize(numberToWords(goal))} de ${numberToWords(goal)}. Zum ya selló el panal de hoy.`;
    }
    if (filled > 0 && filled * 2 >= goal) {
      return `${progressText} ${capitalize(numberToWords(remaining))} más y Zum cierra el panal de hoy.`;
    }
    if (filled === 1) return "Ya llenaste la primera. La siguiente está cerca.";
    if (filled > 1) return `${progressText} La siguiente está cerca.`;
    return scheduled === 0
      ? "Tu panal de hoy está por estrenar. ¿Creamos la primera celda?"
      : "Aquí estoy cuando quieras. ¿Qué celda llenamos primero?";
  }

  if (typeof streak === "number") {
    return streak === 0 ? "Tu racha empieza hoy" : `Racha de vuelo: ${formatDays(streak)}`;
  }
  if (!streak) return "";
  if (streak.lostYesterday > 0) {
    return (
      `Tu racha de ${formatDays(streak.lostYesterday)} descansó ayer. ` +
      `Tu mejor racha sigue siendo de ${formatDays(streak.best)}: hoy empieza otra.`
    );
  }
  if (streak.reserveUsedYesterday) {
    return "Ayer usaste una reserva de miel: tu racha sigue intacta.";
  }
  return streak.current === 0
    ? "Tu racha empieza hoy"
    : `Racha de vuelo: ${formatDays(streak.current)}`;
}
