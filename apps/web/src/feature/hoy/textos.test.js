import { describe, expect, test } from "vite-plus/test";
import {
  descripcionDelPanal,
  detalleDeActividad,
  fechaLarga,
  fraseDeZum,
  saludoDeHoy,
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
  test("la fecha se escribe como en el diseño", () => {
    expect(fechaLarga("2026-11-13")).toBe("Viernes 13 de noviembre");
  });

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

  test("el detalle de cada actividad", () => {
    const recurrente = { tipo: "recurrente" };
    expect(detalleDeActividad({ ...recurrente, regla: { clase: "diaria" } })).toBe(
      "Recurrente · diaria",
    );
    expect(
      detalleDeActividad({ ...recurrente, regla: { clase: "semanal", dias: [0, 2, 4] } }),
    ).toBe("Recurrente · lunes, miércoles y viernes");
    expect(detalleDeActividad({ tipo: "unica", venceHoy: true })).toBe("Única · vence hoy");
    expect(detalleDeActividad({ tipo: "unica", colmena: "Proyecto final" })).toBe(
      "Única · Proyecto final",
    );
    expect(detalleDeActividad({ tipo: "unica", vencida: true, vence: "2026-11-10" })).toBe(
      "Única · vencía el 10 de noviembre",
    );
  });

  test("el panal de hoy se describe para quien no lo ve", () => {
    expect(descripcionDelPanal(resumen(3))).toBe("Panal de hoy: 3 celdas llenas y 2 vacías");
    expect(descripcionDelPanal(resumen(1))).toBe("Panal de hoy: 1 celda llena y 4 vacías");
    expect(descripcionDelPanal(resumen(5))).toBe("Panal de hoy cerrado: 5 de 5 celdas llenas");
  });
});
