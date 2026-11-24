import { describe, expect, test } from "vite-plus/test";
import { descripcionDelPanal, fraseDeZum, textoDeFranja } from "./textos.js";

const resumen = (llenas, meta = 5) => ({
  llenas,
  meta,
  faltan: Math.max(0, meta - llenas),
  programadas: meta,
  cerrado: llenas >= meta,
});

describe("textos de Hoy", () => {
  test("la frase de Zum cuenta lo que falta, en singular y en plural", () => {
    expect(fraseDeZum("feliz", resumen(3))).toBe(
      "Llevas 3 de 5 celdas llenas. Dos más y Zum cierra el panal de hoy.",
    );
    expect(fraseDeZum("feliz", resumen(4))).toBe(
      "Llevas 4 de 5 celdas llenas. Una más y Zum cierra el panal de hoy.",
    );
    expect(fraseDeZum("celebrando", resumen(5))).toBe(
      "Cinco de cinco. Zum ya selló el panal de hoy.",
    );
  });

  test("las franjas hablan de la racha sin culpa", () => {
    expect(textoDeFranja({ perdidaAyer: 0, reservaUsadaAyer: true, mejor: 9 })).toBe(
      "Ayer usaste una reserva de miel: tu racha sigue intacta.",
    );
    expect(textoDeFranja({ perdidaAyer: 6, reservaUsadaAyer: false, mejor: 9 })).toBe(
      "Tu racha de 6 días descansó ayer. Tu mejor racha sigue siendo de 9 días: hoy empieza otra.",
    );
    expect(textoDeFranja({ perdidaAyer: 0, reservaUsadaAyer: false, mejor: 9 })).toBeNull();
  });

  test("el panal de hoy se describe para quien no lo ve", () => {
    expect(descripcionDelPanal(resumen(3))).toBe("Panal de hoy: 3 celdas llenas y 2 vacías");
    expect(descripcionDelPanal(resumen(1))).toBe("Panal de hoy: 1 celda llena y 4 vacías");
    expect(descripcionDelPanal(resumen(5))).toBe("Panal de hoy cerrado: 5 de 5 celdas llenas");
  });
});
