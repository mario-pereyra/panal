import { describe, expect, test } from "vite-plus/test";
import { cumplimiento, fraseDeRondas } from "./textos.js";

const dia = (tocaba, llena = false) => ({ dia: "2026-11-17", tocaba, llena });

describe("cumplimiento de una recurrente", () => {
  test("con días que tocaban, el porcentaje", () => {
    expect(cumplimiento({ porcentaje: 50, dias: [dia(true, true), dia(true)] })).toBe("50 %");
  });

  test("si no le tocaba ningún día, una raya y no un cero", () => {
    expect(cumplimiento({ porcentaje: 0, dias: [dia(false), dia(false)] })).toBe("–");
  });
});

describe("frase de las recurrentes", () => {
  test("nombra cada una con su cumplimiento", () => {
    const rondas = [
      { titulo: "Leer", porcentaje: 86, dias: [dia(true, true)] },
      { titulo: "Pagar el internet", porcentaje: 0, dias: [dia(false)] },
    ];
    expect(fraseDeRondas(rondas)).toBe(
      "Tus recurrentes en los últimos siete días: Leer, 86 %; Pagar el internet, no tocaba.",
    );
  });

  test("sin recurrentes, lo dice", () => {
    expect(fraseDeRondas([])).toBe("Todavía no tienes celdas recurrentes.");
  });
});
