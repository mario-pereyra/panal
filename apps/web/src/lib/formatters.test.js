import { ZUM_MOODS } from "@panal/motor";
import { describe, expect, test } from "vite-plus/test";
import {
  formatActivitySubtitle,
  formatCells,
  formatDays,
  formatDrops,
  formatLongDate,
  formatMonthDay,
  formatRelativeDue,
  formatRuleLabel,
  formatShortDate,
  formatStreakMessage,
  ZUM_ALT_TEXT,
} from "./formatters.js";

describe("shared formatters", () => {
  test("every Zum mood has an accessible description", () => {
    expect(Object.keys(ZUM_ALT_TEXT).sort()).toEqual([...ZUM_MOODS].sort());
  });

  test("dates are formatted in Spanish", () => {
    expect(formatLongDate("2026-11-13")).toBe("Viernes 13 de noviembre");
    expect(formatShortDate("2026-11-13")).toBe("13 de noviembre");
    expect(formatMonthDay("2026-11-16")).toBe("lunes 16");
  });

  test("rules are formatted in words", () => {
    expect(formatRuleLabel({ kind: "diaria" })).toBe("diaria");
    expect(formatRuleLabel({ kind: "dias", days: [0, 2, 4] })).toBe("lunes, miércoles y viernes");
    expect(formatRuleLabel({ kind: "dias", days: [3, 0] })).toBe("lunes y jueves");
    expect(formatRuleLabel({ kind: "veces", count: 1 })).toBe("1 vez por semana");
    expect(formatRuleLabel({ kind: "veces", count: 3 })).toBe("3 veces por semana");
    expect(formatRuleLabel({ kind: "mes", day: 10 })).toBe("el día 10 de cada mes");
  });

  test("activity subtitles include type, rule, due date, and hive", () => {
    expect(
      formatActivitySubtitle({ type: "recurrente", rule: { kind: "diaria" } }, "2026-11-17"),
    ).toBe("Recurrente · diaria");
    expect(formatActivitySubtitle({ type: "unica", dueDate: "2026-11-17" }, "2026-11-17")).toBe(
      "Única · vence hoy",
    );
    expect(
      formatActivitySubtitle({ type: "unica", hiveName: "Proyecto final" }, "2026-11-17"),
    ).toBe("Única · Proyecto final");
    expect(
      formatActivitySubtitle({ type: "unica", overdue: true, dueDate: "2026-11-10" }, "2026-11-17"),
    ).toBe("Única · vencía el 10 de noviembre");
  });

  test("counts and relative due dates handle singular and plural forms", () => {
    expect(formatDrops(1)).toBe("1 gota");
    expect(formatDrops(25)).toBe("25 gotas");
    expect(formatDays(1)).toBe("1 día");
    expect(formatDays(12)).toBe("12 días");
    expect(formatCells(1)).toBe("1 celda");
    expect(formatCells(5)).toBe("5 celdas");
    expect(formatRelativeDue("2026-11-26", "2026-11-17")).toBe("Faltan 9 días");
    expect(formatRelativeDue("2026-11-17", "2026-11-17")).toBe("Se entrega hoy");
    expect(formatRelativeDue("2026-11-15", "2026-11-17")).toBe("Se entregó hace 2 días");
  });

  test("streak message formats Zum progress phrase", () => {
    expect(
      formatStreakMessage(
        { current: 3 },
        { filled: 3, goal: 5, remaining: 2, scheduled: 5, closed: false, rest: false },
      ),
    ).toBe("Llevas 3 de 5 celdas llenas. Dos más y Zum cierra el panal de hoy.");
    expect(
      formatStreakMessage(
        { current: 5 },
        { filled: 5, goal: 5, remaining: 0, scheduled: 5, closed: true, rest: false },
      ),
    ).toBe("Cinco de cinco. Zum ya selló el panal de hoy.");
  });
});
