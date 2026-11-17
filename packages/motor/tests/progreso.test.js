import fc from "fast-check";
import { describe, expect, test } from "vite-plus/test";
import {
  avanzarDia,
  celebracionesEntre,
  cuadrosDeColmena,
  cuotaSemanal,
  cuotasCumplidas,
  diasEntre,
  gotasDeCelda,
  ocurrencias,
  programadasEl,
  progresoDe,
  recorrerVuelo,
  sellosDe,
  seriesDeCuotas,
  sumarDias,
  tocaHoy,
  tomar,
  valorarDia,
  vueloInicial,
} from "../src/index.js";

const LUNES = "2026-11-02";

/** Jornadas seguidas desde un día: "x" activa, "." en blanco, "d" descanso, "-" nada programado. */
function jornadas(desde, patron, { hoy } = {}) {
  return [...patron].map((letra, indice) => {
    const dia = sumarDias(desde, indice);
    return {
      dia,
      llenas: letra === "x" || letra === "c" ? 1 : 0,
      programadas: letra === "-" ? 0 : 3,
      cerrado: letra === "c",
      descanso: letra === "d",
      terminado: hoy ? dia < hoy : true,
    };
  });
}

describe("vuelo: racha y reservas de miel", () => {
  test("cuenta los días seguidos; a los 7 llega un hito con una reserva", () => {
    const vuelo = recorrerVuelo(jornadas(LUNES, "xxxxxxxxxxxx"));
    expect(vuelo).toMatchObject({ racha: 12, mejor: 12, hitos: 1, reservas: 2 });
  });

  test("las reservas no pasan de dos", () => {
    expect(recorrerVuelo(jornadas(LUNES, "x".repeat(21))).reservas).toBe(2);
  });

  test("hoy sin celdas todavía no cuenta en contra", () => {
    const hoy = sumarDias(LUNES, 4);
    const vuelo = recorrerVuelo(jornadas(LUNES, "xxxx.", { hoy }));
    expect(vuelo).toMatchObject({ racha: 4, reservas: 1, reservasUsadas: 0 });
  });

  test("un día en blanco gasta una reserva; sin reservas, la racha se pierde y queda la mejor", () => {
    const conUna = recorrerVuelo(jornadas(LUNES, "xxx.x"));
    expect(conUna).toMatchObject({ racha: 4, reservas: 0, ultimaReservaEl: sumarDias(LUNES, 3) });

    const perdida = recorrerVuelo(jornadas(LUNES, "xxx..x"));
    expect(perdida).toMatchObject({ racha: 1, mejor: 3, rachaPerdida: 3, vueltas: 1 });
    expect(perdida.rachaRotaEl).toBe(sumarDias(LUNES, 4));
    expect(perdida.marcas.vuelta).toBe(sumarDias(LUNES, 5));
  });

  test("el descanso y los días sin nada programado no rompen ni suman", () => {
    expect(recorrerVuelo(jornadas(LUNES, "xxdxx")).racha).toBe(4);
    expect(recorrerVuelo(jornadas(LUNES, "xx-xx")).racha).toBe(4);
    expect(recorrerVuelo(jornadas(LUNES, "xxdxx")).reservas).toBe(1);
  });

  test("cuenta los panales cerrados seguidos para la flor de siete", () => {
    const vuelo = recorrerVuelo(jornadas(LUNES, "ccccccc"));
    expect(vuelo).toMatchObject({ panalesCerrados: 7, mejorCerradosSeguidos: 7 });
    expect(vuelo.marcas.florDeSiete).toBe(sumarDias(LUNES, 6));
  });

  test("avanzar un día no modifica el estado anterior", () => {
    const inicial = Object.freeze(vueloInicial());
    const despues = avanzarDia(inicial, jornadas(LUNES, "c")[0]);
    expect(inicial.racha).toBe(0);
    expect(despues.racha).toBe(1);
    expect(despues).not.toBe(inicial);
  });
});

describe("reglas de repetición", () => {
  const viernes = "2026-11-13";

  test("ocurrencias es un generador infinito del que se toma lo que hace falta", () => {
    const dias = tomar(ocurrencias({ clase: "dias", dias: [0, 2, 4] }, viernes), 4);
    expect(dias).toEqual(["2026-11-13", "2026-11-16", "2026-11-18", "2026-11-20"]);
  });

  test("el día 31 de cada mes cae el último día en los meses cortos", () => {
    const dias = tomar(ocurrencias({ clase: "mes", dia: 31 }, "2026-01-15"), 3);
    expect(dias).toEqual(["2026-01-31", "2026-02-28", "2026-03-31"]);
  });

  test("tres veces por semana aparece hasta cumplir la cuota y vuelve el lunes", () => {
    const regla = { clase: "veces", veces: 3 };
    const actividad = { tipo: "recurrente", regla };
    const hechos = [{ dia: "2026-11-09" }, { dia: "2026-11-10" }, { dia: "2026-11-11" }];
    expect(tocaHoy(actividad, regla, hechos.slice(0, 2), "2026-11-12").toca).toBe(true);
    expect(tocaHoy(actividad, regla, hechos, "2026-11-12").toca).toBe(false);
    expect(tocaHoy(actividad, regla, hechos, "2026-11-11").toca).toBe(true);
    expect(tocaHoy(actividad, regla, hechos, "2026-11-16").toca).toBe(true);
  });

  test("al mirar un día pasado no cuentan las celdas que se llenaron después", () => {
    const regla = { clase: "veces", veces: 3 };
    const actividad = { tipo: "recurrente", regla };
    // Lunes, miércoles y jueves llenos: el martes la cuota todavía no estaba cumplida.
    const hechos = [{ dia: "2026-11-09" }, { dia: "2026-11-11" }, { dia: "2026-11-12" }];
    expect(tocaHoy(actividad, regla, hechos, "2026-11-10").toca).toBe(true);
  });

  test("la cuota semanal de cada regla", () => {
    expect(cuotaSemanal({ clase: "diaria" })).toBe(7);
    expect(cuotaSemanal({ clase: "dias", dias: [1, 3] })).toBe(2);
    expect(cuotaSemanal({ clase: "veces", veces: 4 })).toBe(4);
    expect(cuotaSemanal({ clase: "mes", dia: 1 })).toBeNull();
  });

  test("solo cuentan las actividades que existían ese día", () => {
    const actividades = [
      { id: "a", tipo: "recurrente", regla: { clase: "diaria" }, creadaEl: "2026-11-10" },
      {
        id: "b",
        tipo: "recurrente",
        regla: { clase: "diaria" },
        creadaEl: "2026-11-01",
        archivadaEl: "2026-11-11",
      },
    ];
    expect(programadasEl(actividades, new Map(), "2026-11-09")).toBe(1);
    expect(programadasEl(actividades, new Map(), "2026-11-10")).toBe(2);
    expect(programadasEl(actividades, new Map(), "2026-11-11")).toBe(1);
  });
});

describe("valor de las celdas de un día", () => {
  const actividades = new Map([
    ["r", { id: "r", tipo: "recurrente" }],
    ["alta1", { id: "alta1", tipo: "unica", prioridad: "alta" }],
    ["alta2", { id: "alta2", tipo: "unica", prioridad: "alta" }],
    ["alta3", { id: "alta3", tipo: "unica", prioridad: "alta" }],
    ["vieja", { id: "vieja", tipo: "unica", vence: "2026-11-01" }],
    ["rayo", { id: "rayo", tipo: "unica", creadaEn: "2026-11-13T15:00:00Z" }],
  ]);
  const celda = (actividadId, minuto) => ({
    id: `${actividadId}-${minuto}`,
    actividadId,
    dia: "2026-11-13",
    llenadaEn: `2026-11-13T15:${String(minuto).padStart(2, "0")}:30Z`,
  });

  test("se valoran en el orden en que se llenaron, no en el que llegan", () => {
    const valoradas = valorarDia(
      [celda("alta3", 3), celda("alta1", 1), celda("alta2", 2)],
      actividades,
    );
    expect(valoradas.map((c) => [c.actividadId, c.gotas])).toEqual([
      ["alta1", 35],
      ["alta2", 35],
      ["alta3", 25],
    ]);
  });

  test("lo vencido vale 15 y una celda relámpago vale la mitad", () => {
    // Vuelven en el orden en que se llenaron: primero la relámpago.
    const [relampago, vencida] = valorarDia([celda("vieja", 1), celda("rayo", 0)], actividades);
    expect(relampago.gotas).toBe(12);
    expect(vencida.gotas).toBe(15);
  });

  test("desde la undécima celda del día cada una vale 2", () => {
    const once = Array.from({ length: 11 }, (_, minuto) => celda("r", minuto + 10));
    expect(
      valorarDia(once, actividades)
        .map((c) => c.gotas)
        .slice(-2),
    ).toEqual([10, 2]);
  });
});

describe("cuadros de colmena", () => {
  test("cada 20 % da un bono a quien aportó en ese tramo, y el cierre a todo el enjambre", () => {
    const llenas = ["ana", "ana", "luis", "ana", "sofia"].map((personaId, indice) => ({
      personaId,
      dia: sumarDias(LUNES, indice),
    }));
    const { cuadros, bonos } = cuadrosDeColmena(llenas, 5);
    expect(cuadros.map((c) => [c.cuadro, c.personas])).toEqual([
      [1, ["ana"]],
      [2, ["ana"]],
      [3, ["luis"]],
      [4, ["ana"]],
      [5, ["sofia"]],
    ]);
    const deAna = bonos.filter((b) => b.personaId === "ana").reduce((s, b) => s + b.gotas, 0);
    expect(deAna).toBe(3 * 30 + 100);
    expect(bonos.filter((b) => b.motivo === "colmena-cerrada")).toHaveLength(3);
  });

  test("una colmena sin actividades no tiene cuadros", () => {
    expect(cuadrosDeColmena([], 0)).toEqual({ cuadros: [], bonos: [] });
  });
});

describe("cuotas semanales", () => {
  const actividad = { tipo: "recurrente", regla: { clase: "veces", veces: 2 } };

  test("cada semana con la cuota cumplida, con el día en que se alcanzó", () => {
    const hechos = ["2026-11-02", "2026-11-04", "2026-11-05", "2026-11-10"].map((dia) => ({ dia }));
    expect(cuotasCumplidas(actividad, hechos)).toEqual([
      { lunes: "2026-11-02", dia: "2026-11-04" },
    ]);
  });

  test("las series de semanas seguidas", () => {
    const cumplidas = ["2026-10-05", "2026-10-19", "2026-10-26", "2026-11-02", "2026-11-09"].map(
      (lunes) => ({ lunes, dia: lunes }),
    );
    expect(seriesDeCuotas(cumplidas)).toEqual({
      mejor: 4,
      alcanzada: { 1: "2026-10-05", 2: "2026-10-26", 3: "2026-11-02", 4: "2026-11-09" },
    });
  });
});

describe("sellos y celebraciones", () => {
  const historial = {
    vuelo: {
      ...vueloInicial(),
      mejor: 8,
      panalesCerrados: 1,
      marcas: { primeraCelda: LUNES, racha7: "2026-11-08", primerCierre: LUNES },
    },
    celdas: 20,
    unicasATiempo: { cantidad: 3, decimaEl: null },
    cuotas: { mejor: 1, cuartaEl: null },
    vencidas: { llenadas: 0, pendientes: 0, ultimaEl: null },
    colmenas: {
      fundadasConEnjambre: 0,
      unidas: 0,
      mejorCuadro: 0,
      primerCuadroEl: null,
      cerradas: 0,
      cerradaEl: null,
    },
    madrugadas: { dias: 0, quintoEl: null },
  };

  test("los sellos ganados llevan su fecha; los demás, su avance", () => {
    const sellos = sellosDe(historial);
    expect(sellos).toHaveLength(17);
    const porId = Object.fromEntries(sellos.map((s) => [s.id, s]));
    expect(porId["semana-de-vuelo"]).toMatchObject({
      ganado: true,
      ganadoEl: "2026-11-08",
      actual: 7,
    });
    expect(porId["luna-de-miel"]).toMatchObject({ ganado: false, actual: 8, meta: 30 });
    expect(porId["ala-amiga"]).toMatchObject({ ganado: false, disponible: false });
  });

  test("celebra lo nuevo, de lo más grande a lo más pequeño", () => {
    const foto = (cerrado, nivel, cuadro) => ({
      hoy: { cerrado },
      vuelo: { racha: 7, hitos: cerrado ? 1 : 0 },
      oficio: {
        nivel,
        nombre: nivel === 5 ? "Recolectora" : "Exploradora",
        siguiente: null,
        faltan: 0,
      },
      sellos: [{ id: "panal-cerrado", nombre: "Panal cerrado", ganado: cerrado }],
      colmenas: [{ id: "c", nombre: "Proyecto final", cuadro, cerrada: false }],
    });
    const tipos = celebracionesEntre(foto(false, 4, 2), foto(true, 5, 3)).map((c) => c.tipo);
    expect(tipos).toEqual(["oficio", "cuadro", "sello", "racha", "panal-cerrado"]);
    expect(celebracionesEntre(foto(true, 5, 3), foto(true, 5, 3))).toEqual([]);
  });
});

describe("progreso completo", () => {
  // Dos semanas exactas, de lunes a domingo, llenando cada día dos recurrentes diarias.
  const hoy = sumarDias(LUNES, 13);
  const actividades = ["a", "b"].map((id) => ({
    id,
    tipo: "recurrente",
    regla: { clase: "diaria" },
    creadaEl: LUNES,
  }));
  const celdas = [...diasEntre(LUNES, hoy)].flatMap((dia) =>
    actividades.map((actividad, indice) => ({
      id: `${actividad.id}-${dia}`,
      actividadId: actividad.id,
      dia,
      llenadaEn: `${dia}T13:0${indice}:00Z`,
    })),
  );
  const entrada = {
    personaId: "ana",
    hoy,
    desde: LUNES,
    ajustes: { metaDiaria: 2 },
    actividades,
    celdas,
  };

  test("las gotas son las celdas más cada bono, y el oficio sale de ese total", () => {
    const progreso = progresoDe(entrada);
    expect(progreso.gotas.desglose).toEqual({
      celdas: 280,
      cierres: 280,
      hitos: 100,
      cuotas: 60,
      colmenas: 0,
    });
    expect(progreso.gotas.total).toBe(720);
    expect(progreso.oficio).toMatchObject({ nivel: 5, nombre: "Recolectora" });
    expect(progreso.racha).toMatchObject({ actual: 14, reservas: 2, hoyCuenta: true });
  });

  test("los logros de una colmena son de quien aportó al menos una celda", () => {
    const colmena = (llenas) => ({
      id: "c",
      nombre: "Feria",
      fundadoraId: "luis",
      unidas: 1,
      total: 2,
      llenas,
    });
    const enjambrazon = (llenas) =>
      progresoDe({ ...entrada, colmenas: [colmena(llenas)] }).sellos.find(
        (sello) => sello.id === "enjambrazon",
      );
    const deLuis = [
      { personaId: "luis", dia: LUNES },
      { personaId: "luis", dia: sumarDias(LUNES, 1) },
    ];
    expect(enjambrazon(deLuis).ganado).toBe(false);
    expect(enjambrazon([deLuis[0], { personaId: "ana", dia: sumarDias(LUNES, 1) }]).ganado).toBe(
      true,
    );
  });

  test("una meta nueva rige desde su día: los panales de antes no cambian", () => {
    const historial = [
      { desde: LUNES, metaDiaria: 2, diaSinFlores: null },
      { desde: sumarDias(LUNES, 10), metaDiaria: 3, diaSinFlores: null },
    ];
    // Una tercera recurrente que nunca se llena: con meta 3 el panal ya no cierra.
    const conTres = { ...entrada, actividades: [...actividades, { ...actividades[0], id: "c" }] };
    const conHistorial = progresoDe({ ...conTres, ajustes: { metaDiaria: 3, historial } });
    const sinHistorial = progresoDe({ ...conTres, ajustes: { metaDiaria: 3 } });
    // Diez días cerrados con meta 2, a 20 gotas cada cierre; con meta 3 ninguno cierra.
    expect(conHistorial.gotas.desglose.cierres).toBe(200);
    expect(sinHistorial.gotas.desglose.cierres).toBe(0);
  });

  test("lo de hoy se separa de lo de antes, para que el navegador dé el último paso", () => {
    const progreso = progresoDe(entrada);
    // Hoy: 20 de las celdas, 20 del cierre, 50 del hito de 14 días y 30 de dos cuotas.
    expect(progreso.gotas.deHoy).toBe(120);
    expect(progreso.gotas.bonosDeHoy).toBe(30);
    expect(progreso.gotas.hastaAyer).toBe(600);
    expect(progreso.vueloHastaAyer.racha).toBe(13);
  });
});

describe("propiedades", () => {
  const dia = fc
    .date({
      min: new Date("2024-01-01T00:00:00Z"),
      max: new Date("2030-12-31T00:00:00Z"),
      noInvalidDate: true,
    })
    .map((fecha) => fecha.toISOString().slice(0, 10));
  const regla = fc.oneof(
    fc.constant({ clase: "diaria" }),
    fc
      .uniqueArray(fc.integer({ min: 0, max: 6 }), { minLength: 1, maxLength: 7 })
      .map((dias) => ({ clase: "dias", dias })),
    fc.integer({ min: 1, max: 31 }).map((numero) => ({ clase: "mes", dia: numero })),
  );

  test("ocurrencias nunca devuelve un día anterior a su inicio y siempre avanza", () => {
    fc.assert(
      fc.property(regla, dia, (unaRegla, desde) => {
        const dias = tomar(ocurrencias(unaRegla, desde), 12);
        return dias.every((d, i) => d >= desde && (i === 0 || d > dias[i - 1]));
      }),
    );
  });

  test("una celda nunca vale gotas negativas", () => {
    fc.assert(
      fc.property(
        fc.record({
          tipo: fc.constantFrom("unica", "recurrente"),
          prioridad: fc.constantFrom("normal", "alta"),
          vencida: fc.boolean(),
          relampago: fc.boolean(),
        }),
        fc.record({
          llenasAntes: fc.nat(30),
          altasAntes: fc.nat(5),
          relampagosAntes: fc.nat(5),
        }),
        (celda, contexto) => gotasDeCelda(celda, contexto) >= 0,
      ),
    );
  });

  test("la racha nunca supera los días transcurridos ni la mejor racha", () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom("x", ".", "d", "-", "c"), { maxLength: 60 }),
        (letras) => {
          const vuelo = recorrerVuelo(jornadas(LUNES, letras.join("")));
          return vuelo.racha <= letras.length && vuelo.racha <= vuelo.mejor && vuelo.reservas <= 2;
        },
      ),
    );
  });

  // La celda nueva es siempre de hoy: el servidor pone el día y no se llenan días pasados.
  // Una celda en un día pasado sí puede restar gotas, porque cambia el día en que se gasta una reserva.
  test("llenar una celda hoy nunca resta gotas, y deshacerla deja el progreso como estaba", () => {
    const desde = "2026-11-02";
    const hoy = "2026-11-15";
    const actividades = ["a", "b", "c"].map((id) => ({
      id,
      tipo: "recurrente",
      regla: { clase: "diaria" },
      creadaEl: desde,
    }));
    const celda = fc.record({
      actividad: fc.constantFrom("a", "b", "c"),
      desplazamiento: fc.integer({ min: 0, max: 13 }),
    });
    fc.assert(
      fc.property(
        fc.uniqueArray(celda, {
          selector: (c) => `${c.actividad}${c.desplazamiento}`,
          maxLength: 30,
        }),
        fc.constantFrom("a", "b", "c").map((actividad) => ({ actividad, desplazamiento: 13 })),
        (lista, extra) => {
          const aCelda = ({ actividad, desplazamiento }) => {
            const unDia = sumarDias(desde, desplazamiento);
            return {
              id: `${actividad}-${unDia}`,
              actividadId: actividad,
              dia: unDia,
              llenadaEn: `${unDia}T12:00:00Z`,
            };
          };
          const celdas = lista.map(aCelda);
          const nueva = aCelda(extra);
          if (celdas.some((c) => c.id === nueva.id)) return true;
          const base = { personaId: "ana", hoy, desde, ajustes: { metaDiaria: 3 }, actividades };
          const antes = progresoDe({ ...base, celdas });
          const despues = progresoDe({
            ...base,
            celdas: [...celdas, nueva].filter((c) => c.id !== nueva.id),
          });
          const llena = progresoDe({ ...base, celdas: [...celdas, nueva] });
          return (
            JSON.stringify(antes) === JSON.stringify(despues) &&
            llena.gotas.total >= antes.gotas.total &&
            llena.gotas.total === llena.gotas.hastaAyer + llena.gotas.deHoy
          );
        },
      ),
      { numRuns: 60 },
    );
  });
});
