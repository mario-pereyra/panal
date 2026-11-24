import { describe, expect, test } from "vite-plus/test";
import { cumplimiento, fraseDeRondas } from "./textos.js";

describe("cumplimiento de una recurrente", () => {
  test("con días que tocaban, el porcentaje", () => {
    expect(cumplimiento({ porcentaje: 50, tocabaAlgunDia: true })).toBe("50 %");
  });

  test("si no le tocaba ningún día, una raya y no un cero", () => {
    expect(cumplimiento({ porcentaje: 0, tocabaAlgunDia: false })).toBe("–");
  });
});

describe("frase de las recurrentes", () => {
  test("nombra cada una con su cumplimiento", () => {
    const rondas = [
      { titulo: "Leer", porcentaje: 86, tocabaAlgunDia: true },
      { titulo: "Pagar el internet", porcentaje: 0, tocabaAlgunDia: false },
    ];
    expect(fraseDeRondas(rondas)).toBe(
      "Tus recurrentes en los últimos siete días: Leer, 86 %; Pagar el internet, no tocaba.",
    );
  });
});
