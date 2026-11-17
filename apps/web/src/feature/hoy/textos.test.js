import { describe, expect, test } from "vite-plus/test";
import {
  descripcionDelPanal,
  fraseDeZum,
  saludoDeHoy,
  textoDeFranja,
  textoDeRacha,
  textoDeReservas,
} from "./textos.js";

const resumen = (llenas, meta = 5) => ({
  llenas,
  meta,
  faltan: Math.max(0, meta - llenas),
  programadas: meta,
  cerrado: llenas >= meta,
});

describe("textos de Hoy", () => {
  test("el saludo cambia al cerrar el panal y al descansar", () => {
    expect(saludoDeHoy("feliz", "Ana")).toBe("¡Buen vuelo, Ana!");
    expect(saludoDeHoy("celebrando", "Ana")).toBe("¡Panal cerrado, Ana!");
    expect(saludoDeHoy("descansando", "Ana")).toBe("Buen descanso, Ana");
  });

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

  test("Zum nunca reprocha: preocupada habla de lo que todavía se puede", () => {
    expect(fraseDeZum("preocupada", resumen(0))).toBe(
      "Todavía hay luz. Con una celda basta para seguir el vuelo.",
    );
  });

  test("racha y reservas, con sus singulares y sus ceros", () => {
    expect(textoDeRacha({ actual: 12 })).toBe("Racha de vuelo: 12 días");
    expect(textoDeRacha({ actual: 1 })).toBe("Racha de vuelo: 1 día");
    expect(textoDeRacha({ actual: 0 })).toBe("Tu racha empieza hoy");
    expect(textoDeReservas(2)).toBe("2 reservas de miel");
    expect(textoDeReservas(1)).toBe("1 reserva de miel");
    expect(textoDeReservas(0)).toBe("Sin reservas de miel");
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
