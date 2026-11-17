import { describe, expect, test } from "vite-plus/test";
import {
  actividad,
  cambiosDePerfil,
  erroresPorCampo,
  nuevaCuenta,
  periodoDeReporte,
  regla,
} from "../src/index.js";

const ID = "6f1c2a8e-3b4d-4e5f-8a9b-0c1d2e3f4a5b";

describe("cuenta", () => {
  test("normaliza el correo y exige una contraseña de ocho caracteres", () => {
    const datos = nuevaCuenta.parse({
      nombre: " Ana ",
      correo: " Ana@Panal.Test ",
      clave: "panal1234",
    });
    expect(datos).toEqual({ nombre: "Ana", correo: "ana@panal.test", clave: "panal1234" });
    const fallo = nuevaCuenta.safeParse({ nombre: "Ana", correo: "ana", clave: "corta" });
    expect(Object.keys(erroresPorCampo(fallo.error))).toEqual(["correo", "clave"]);
  });

  test("la invernada dura como máximo 14 días y la meta es 3, 5 o 7", () => {
    expect(
      cambiosDePerfil.safeParse({ invernada: { desde: "2026-12-01", hasta: "2026-12-14" } })
        .success,
    ).toBe(true);
    expect(
      cambiosDePerfil.safeParse({ invernada: { desde: "2026-12-01", hasta: "2026-12-15" } })
        .success,
    ).toBe(false);
    expect(cambiosDePerfil.safeParse({ metaDiaria: 4 }).success).toBe(false);
    expect(cambiosDePerfil.safeParse({ zonaHoraria: "Marte/Olimpo" }).success).toBe(false);
  });
});

describe("actividades", () => {
  test("una única no lleva regla; una recurrente sí, y sin fecha", () => {
    expect(actividad.parse({ titulo: "Leer", tipo: "unica" })).toMatchObject({
      prioridad: "normal",
      regla: null,
      vence: null,
      colmenaId: null,
    });
    expect(actividad.safeParse({ titulo: "Leer", tipo: "recurrente" }).success).toBe(false);
    expect(
      actividad.safeParse({
        titulo: "Leer",
        tipo: "recurrente",
        regla: { clase: "diaria" },
        vence: "2026-12-01",
      }).success,
    ).toBe(false);
    expect(actividad.safeParse({ titulo: "Leer", tipo: "unica", asignadaA: ID }).success).toBe(
      false,
    );
  });

  test("los días de una regla quedan ordenados y sin repetir", () => {
    expect(regla.parse({ clase: "dias", dias: [4, 0, 4, 2] })).toEqual({
      clase: "dias",
      dias: [0, 2, 4],
    });
    expect(regla.safeParse({ clase: "veces", veces: 7 }).success).toBe(false);
  });
});

test("un reporte abarca como máximo 92 días", () => {
  expect(periodoDeReporte.safeParse({ desde: "2026-09-01", hasta: "2026-11-30" }).success).toBe(
    true,
  );
  expect(periodoDeReporte.safeParse({ desde: "2026-08-01", hasta: "2026-11-30" }).success).toBe(
    false,
  );
});
