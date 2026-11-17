import { describe, expect, test } from "vite-plus/test";
import {
  ajustesDelDia,
  duenaDe,
  ocupaCupoDeAlta,
  avanceDeColmena,
  constanciaDe,
  esDescanso,
  diaDeLaSemana,
  diaLogico,
  estadoDeZum,
  gotasDeCelda,
  nivelDeConstancia,
  oficioDe,
  resumenDelDia,
  sumarDias,
  tocaHoy,
} from "../src/index.js";

const ZONA = "America/La_Paz"; // UTC-4, sin horario de verano

describe("día lógico", () => {
  test("las 02:30 del sábado pertenecen al viernes", () => {
    expect(diaLogico("2026-11-14T06:30:00Z", ZONA)).toBe("2026-11-13");
  });

  test("a las 03:00 empieza el día siguiente", () => {
    expect(diaLogico("2026-11-14T07:00:00Z", ZONA)).toBe("2026-11-14");
  });

  test("retrocede bien al cambiar de mes y de año", () => {
    expect(diaLogico("2027-01-01T05:00:00Z", ZONA)).toBe("2026-12-31");
    expect(sumarDias("2026-03-01", -1)).toBe("2026-02-28");
  });

  test("la semana empieza en lunes", () => {
    expect(diaDeLaSemana("2026-11-09")).toBe(0);
    expect(diaDeLaSemana("2026-11-13")).toBe(4);
    expect(diaDeLaSemana("2026-11-15")).toBe(6);
  });
});

describe("oficios", () => {
  test("el estado de ejemplo: 640 gotas, Exploradora, faltan 60 para Recolectora", () => {
    expect(oficioDe(640)).toMatchObject({
      nivel: 4,
      nombre: "Exploradora",
      siguiente: "Recolectora",
      faltan: 60,
    });
  });

  test("el umbral exacto ya es el oficio nuevo", () => {
    expect(oficioDe(699).nombre).toBe("Exploradora");
    expect(oficioDe(700).nombre).toBe("Recolectora");
  });

  test("el último oficio no tiene siguiente", () => {
    expect(oficioDe(9999)).toMatchObject({ nivel: 10, siguiente: null, faltan: 0, avance: 1 });
  });
});

describe("gotas de una celda", () => {
  test("el ejemplo de las maquetas: dos recurrentes y una única dan 45", () => {
    const gotas =
      gotasDeCelda({ tipo: "recurrente" }) +
      gotasDeCelda({ tipo: "recurrente" }, { llenasAntes: 1 }) +
      gotasDeCelda({ tipo: "unica" }, { llenasAntes: 2 });
    expect(gotas).toBe(45);
  });

  test("ponerse al día suma menos, pero suma", () => {
    expect(gotasDeCelda({ tipo: "unica", prioridad: "alta", vencida: true })).toBe(15);
  });

  test("solo dos únicas de prioridad alta por día valen como tales", () => {
    expect(gotasDeCelda({ tipo: "unica", prioridad: "alta" }, { altasAntes: 1 })).toBe(35);
    expect(gotasDeCelda({ tipo: "unica", prioridad: "alta" }, { altasAntes: 2 })).toBe(25);
  });

  test("desde la undécima celda del día, cada una vale 2", () => {
    expect(gotasDeCelda({ tipo: "unica" }, { llenasAntes: 9 })).toBe(25);
    expect(gotasDeCelda({ tipo: "unica" }, { llenasAntes: 10 })).toBe(2);
  });

  test("una celda relámpago vale la mitad, y la cuarta del día no da gotas", () => {
    expect(gotasDeCelda({ tipo: "unica", relampago: true })).toBe(12);
    expect(gotasDeCelda({ tipo: "unica", relampago: true }, { relampagosAntes: 3 })).toBe(0);
  });
});

describe("qué toca hoy", () => {
  const viernes = "2026-11-13";

  test("una recurrente semanal solo aparece en sus días", () => {
    const regla = { clase: "dias", dias: [0, 2, 4] };
    expect(tocaHoy({ tipo: "recurrente" }, regla, [], viernes).toca).toBe(true);
    expect(tocaHoy({ tipo: "recurrente" }, regla, [], "2026-11-14").toca).toBe(false);
  });

  test("una única cumplida hoy se queda a la vista; cumplida ayer, ya no vuelve", () => {
    expect(tocaHoy({ tipo: "unica" }, null, [{ dia: viernes }], viernes).toca).toBe(true);
    expect(tocaHoy({ tipo: "unica" }, null, [{ dia: "2026-11-12" }], viernes).toca).toBe(false);
  });

  test("una única sigue apareciendo después de vencer, marcada como vencida", () => {
    expect(tocaHoy({ tipo: "unica", vence: "2026-11-10" }, null, [], viernes)).toEqual({
      toca: true,
      vencida: true,
    });
    expect(tocaHoy({ tipo: "unica", vence: viernes }, null, [], viernes).vencida).toBe(false);
  });
});

describe("resumen del día y estado de Zum", () => {
  const hoy = "2026-11-13";
  const ajustes = { metaDiaria: 5 };
  const celdas = (cantidad) => Array.from({ length: cantidad }, () => ({ dia: hoy, gotas: 10 }));
  const resumen = (cantidad, otros = ajustes) =>
    resumenDelDia({ celdas: celdas(cantidad), programadas: 5 }, otros, hoy);
  const racha = { actual: 12 };

  test("tres de cinco: faltan dos y el panal sigue abierto", () => {
    expect(resumen(3)).toMatchObject({ llenas: 3, meta: 5, faltan: 2, cerrado: false, gotas: 30 });
  });

  test("cerrar el panal suma el bono de cierre", () => {
    expect(resumen(5)).toMatchObject({ cerrado: true, bonoDeCierre: 20, gotas: 70 });
  });

  test("si hoy tocan menos actividades que la meta, basta con llenarlas todas", () => {
    const corto = resumenDelDia({ celdas: celdas(2), programadas: 2 }, ajustes, hoy);
    expect(corto).toMatchObject({ meta: 2, cerrado: true });
  });

  test("no cuenta las celdas de otros días", () => {
    const mezcla = [...celdas(1), { dia: "2026-11-12", gotas: 25 }];
    expect(resumenDelDia({ celdas: mezcla, programadas: 5 }, ajustes, hoy).llenas).toBe(1);
  });

  test("Zum pasa por sus estados a medida que se llena el panal", () => {
    const tarde = { hora: 10 };
    expect(estadoDeZum(resumen(0), racha, tarde)).toBe("esperando");
    expect(estadoDeZum(resumen(1), racha, tarde)).toBe("animando");
    expect(estadoDeZum(resumen(2), racha, tarde)).toBe("animando");
    expect(estadoDeZum(resumen(3), racha, tarde)).toBe("feliz");
    expect(estadoDeZum(resumen(5), racha, tarde)).toBe("celebrando");
  });

  test("Zum se preocupa solo de tarde, sin celdas y con racha en juego", () => {
    expect(estadoDeZum(resumen(0), racha, { hora: 19 })).toBe("preocupada");
    expect(estadoDeZum(resumen(0), racha, { hora: 1 })).toBe("preocupada");
    expect(estadoDeZum(resumen(0), { actual: 0 }, { hora: 19 })).toBe("esperando");
    expect(estadoDeZum(resumen(1), racha, { hora: 19 })).toBe("animando");
  });

  test("en el día sin flores Zum descansa, aunque el panal esté lleno", () => {
    const viernesLibre = { metaDiaria: 5, diaSinFlores: 4 };
    expect(estadoDeZum(resumen(5, viernesLibre), racha, { hora: 19 })).toBe("descansando");
  });
});

describe("panal de constancia", () => {
  test("los niveles: nada, algo, la mitad o más, panal cerrado", () => {
    expect([0, 1, 2, 3, 4, 5, 8].map((llenas) => nivelDeConstancia(llenas, 5))).toEqual([
      0, 1, 1, 2, 2, 3, 3,
    ]);
  });

  test("cinco semanas de lunes a domingo, con hoy y el futuro marcados", () => {
    const hoy = "2026-11-13";
    const semanas = constanciaDe(
      [{ dia: hoy }, { dia: hoy }, { dia: hoy }],
      { metaDiaria: 5 },
      hoy,
    );
    expect(semanas).toHaveLength(5);
    expect(semanas[0][0].dia).toBe("2026-10-12");
    expect(semanas[4][4]).toMatchObject({ dia: hoy, llenas: 3, nivel: 2, esHoy: true });
    expect(semanas[4][5]).toMatchObject({ dia: "2026-11-14", futuro: true });
  });
});

describe("cupo de prioridad alta", () => {
  const alta = { tipo: "unica", prioridad: "alta", creadaPor: "ana", colmenaId: null };

  test("la dueña es quien la creó o, en una colmena, la abeja asignada", () => {
    expect(duenaDe(alta)).toBe("ana");
    expect(duenaDe({ ...alta, colmenaId: "c", asignadaA: "luis" })).toBe("luis");
    expect(duenaDe({ ...alta, colmenaId: "c", asignadaA: null })).toBeNull();
  });

  test("ocupa cupo una única alta pendiente en el panal de alguien", () => {
    expect(ocupaCupoDeAlta(alta)).toBe(true);
    expect(ocupaCupoDeAlta({ ...alta, llena: true })).toBe(false);
    expect(ocupaCupoDeAlta({ ...alta, archivada: true })).toBe(false);
    expect(ocupaCupoDeAlta({ ...alta, prioridad: "normal" })).toBe(false);
    expect(ocupaCupoDeAlta({ ...alta, tipo: "recurrente" })).toBe(false);
    // Libre en una colmena: no es de nadie todavía.
    expect(ocupaCupoDeAlta({ ...alta, colmenaId: "c", asignadaA: null })).toBe(false);
    expect(ocupaCupoDeAlta(null)).toBe(false);
  });
});

describe("ajustes que regían cada día", () => {
  // Meta 5 desde el 2 de noviembre; desde el 10, meta 3 y el domingo sin flores.
  const ajustes = {
    metaDiaria: 3,
    diaSinFlores: 6,
    historial: [
      { desde: "2026-11-02", metaDiaria: 5, diaSinFlores: null },
      { desde: "2026-11-10", metaDiaria: 3, diaSinFlores: 6 },
    ],
  };

  test("cada día toma el tramo que regía entonces", () => {
    expect(ajustesDelDia(ajustes, "2026-11-09").metaDiaria).toBe(5);
    expect(ajustesDelDia(ajustes, "2026-11-10").metaDiaria).toBe(3);
    expect(ajustesDelDia(ajustes, "2026-10-30").metaDiaria).toBe(5);
  });

  test("sin historial, los ajustes de hoy valen para todos los días", () => {
    expect(ajustesDelDia({ metaDiaria: 7 }, "2020-01-01").metaDiaria).toBe(7);
  });

  test("un día sin flores nuevo no convierte en descanso los domingos de antes", () => {
    expect(esDescanso(ajustes, "2026-11-08")).toBe(false);
    expect(esDescanso(ajustes, "2026-11-15")).toBe(true);
  });

  test("bajar la meta no cierra panales de días pasados", () => {
    const celdas = Array.from({ length: 3 }, () => ({ dia: "2026-11-09", gotas: 10 }));
    expect(resumenDelDia({ celdas, programadas: 6 }, ajustes, "2026-11-09").cerrado).toBe(false);
    const constancia = constanciaDe(celdas, ajustes, "2026-11-13");
    expect(constancia[4][0]).toMatchObject({ dia: "2026-11-09", nivel: 2 });
  });
});

describe("avance de colmena", () => {
  test("el ejemplo: 18 de 30 celdas, 60 % y el aporte de cada abeja", () => {
    const celdas = [
      ...Array.from({ length: 7 }, () => ({ llenaPor: "ana" })),
      ...Array.from({ length: 5 }, () => ({ llenaPor: "luis" })),
      ...Array.from({ length: 4 }, () => ({ llenaPor: "sofia" })),
      ...Array.from({ length: 2 }, () => ({ llenaPor: "diego" })),
      ...Array.from({ length: 12 }, () => ({ llenaPor: null })),
    ];
    expect(avanceDeColmena(celdas)).toMatchObject({
      total: 30,
      llenas: 18,
      porcentaje: 60,
      cuadro: 3,
      faltanParaElSiguiente: 6,
      aportes: [
        { personaId: "ana", celdas: 7 },
        { personaId: "luis", celdas: 5 },
        { personaId: "sofia", celdas: 4 },
        { personaId: "diego", celdas: 2 },
      ],
    });
  });

  test("una colmena sin celdas no falla", () => {
    expect(avanceDeColmena([])).toMatchObject({ total: 0, porcentaje: 0, cuadro: 0 });
  });
});
