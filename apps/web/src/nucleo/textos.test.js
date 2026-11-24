import { describe, expect, test } from "vite-plus/test";
import { fechaLarga } from "../lib/formato.js";
import {
  cuandoEs,
  detalleDeActividad,
  ordinalDeCuadro,
  textoDeEntrega,
  textoDeGotas,
  textoDeRachaDeVuelo,
  textoDeRegla,
  textoDeReservas,
} from "./textos.js";

describe("textos compartidos", () => {
  test("la fecha se escribe como en el diseño", () => {
    expect(fechaLarga("2026-11-13")).toBe("Viernes 13 de noviembre");
    expect(cuandoEs("2026-11-18", "2026-11-17")).toBe("Mañana");
    expect(cuandoEs("2026-11-23", "2026-11-17")).toBe("Lunes 23");
  });

  test("cada clase de regla en palabras", () => {
    expect(textoDeRegla({ clase: "diaria" })).toBe("diaria");
    expect(textoDeRegla({ clase: "dias", dias: [0, 2, 4] })).toBe("lunes, miércoles y viernes");
    expect(textoDeRegla({ clase: "dias", dias: [3, 0] })).toBe("lunes y jueves");
    expect(textoDeRegla({ clase: "veces", veces: 1 })).toBe("1 vez por semana");
    expect(textoDeRegla({ clase: "veces", veces: 3 })).toBe("3 veces por semana");
    expect(textoDeRegla({ clase: "mes", dia: 10 })).toBe("el día 10 de cada mes");
  });

  test("el detalle de cada actividad", () => {
    expect(detalleDeActividad({ tipo: "recurrente", regla: { clase: "diaria" } })).toBe(
      "Recurrente · diaria",
    );
    expect(detalleDeActividad({ tipo: "unica", venceHoy: true })).toBe("Única · vence hoy");
    expect(detalleDeActividad({ tipo: "unica", colmena: "Proyecto final" })).toBe(
      "Única · Proyecto final",
    );
    expect(detalleDeActividad({ tipo: "unica", vencida: true, vence: "2026-11-10" })).toBe(
      "Única · vencía el 10 de noviembre",
    );
  });

  test("racha y reservas, con sus singulares y sus ceros", () => {
    expect(textoDeRachaDeVuelo(12)).toBe("Racha de vuelo: 12 días");
    expect(textoDeRachaDeVuelo(1)).toBe("Racha de vuelo: 1 día");
    expect(textoDeRachaDeVuelo(0)).toBe("Tu racha empieza hoy");
    expect(textoDeReservas(2)).toBe("2 reservas de miel");
    expect(textoDeReservas(1)).toBe("1 reserva de miel");
    expect(textoDeReservas(0)).toBe("Sin reservas de miel");
  });

  test("la entrega de una colmena, las gotas y los cuadros", () => {
    expect(textoDeEntrega("2026-11-26", "2026-11-17")).toBe("Faltan 9 días");
    expect(textoDeEntrega("2026-11-17", "2026-11-17")).toBe("Se entrega hoy");
    expect(textoDeEntrega("2026-11-15", "2026-11-17")).toBe("Se entregó hace 2 días");
    expect(textoDeGotas(25)).toBe("+25 gotas de miel");
    expect(ordinalDeCuadro(1)).toBe("primer");
    expect(ordinalDeCuadro(5)).toBe("quinto");
  });
});
