import { afterAll, beforeAll, beforeEach, describe, expect, test } from "vite-plus/test";
import { crearActividad, crearEntorno, DIA_MS, MARTES, nuevoId } from "./ayudantes.js";

/** @type {Awaited<ReturnType<typeof crearEntorno>>} */
let entorno;
beforeAll(async () => {
  entorno = await crearEntorno();
});
afterAll(() => entorno.cerrar());

/** Lunes 9 de noviembre de 2026, 10:00 en La Paz. */
const LUNES = MARTES - 8 * DIA_MS - 60 * 60 * 1000;

beforeEach(() => {
  entorno.reloj.ahora = LUNES;
});

describe("reportes", () => {
  test("celdas por día, periodo anterior, rondas, reparto y colmenas", async () => {
    const abeja = await entorno.nuevaAbeja({ nombre: "Rita" });
    const lmv = await crearActividad(abeja, {
      titulo: "Inglés",
      tipo: "recurrente",
      regla: { clase: "dias", dias: [0, 2, 4] },
    });
    const diaria = await crearActividad(abeja, {
      titulo: "Agua",
      tipo: "recurrente",
      regla: { clase: "diaria" },
    });
    const colmenaId = (await abeja.post("/api/colmenas", { nombre: "Grupo" })).datos.colmena.id;
    const deColmena = await crearActividad(abeja, { titulo: "Póster", colmenaId });
    const unica = await crearActividad(abeja, { titulo: "Trámite" });
    const llenar = (actividadId) => abeja.put(`/api/celdas/${nuevoId()}`, { actividadId });

    // Lunes 9: inglés y agua. Martes 10: agua. Miércoles 11: nada. Jueves 12: póster y trámite.
    entorno.avanzar(5 * 60 * 1000);
    await llenar(lmv);
    await llenar(diaria);
    entorno.avanzar(DIA_MS);
    await llenar(diaria);
    entorno.avanzar(2 * DIA_MS);
    await llenar(deColmena);
    await llenar(unica);

    const { estado, datos } = await abeja.get("/api/reportes?desde=2026-11-09&hasta=2026-11-15");
    expect(estado).toBe(200);
    expect(datos).toMatchObject({
      desde: "2026-11-09",
      hasta: "2026-11-15",
      hoy: "2026-11-12",
      celdasPorDia: [
        { dia: "2026-11-09", llenas: 2 },
        { dia: "2026-11-10", llenas: 1 },
        { dia: "2026-11-11", llenas: 0 },
        { dia: "2026-11-12", llenas: 2 },
      ],
      periodoAnterior: 0,
      reparto: { unicas: 2, recurrentes: 3 },
      colmenas: [
        {
          id: colmenaId,
          nombre: "Grupo",
          aportes: [{ id: abeja.perfil.id, nombre: "Rita", color: 0, celdas: 1 }],
        },
      ],
    });

    expect(datos.rondas).toHaveLength(2);
    const ingles = datos.rondas.find((ronda) => ronda.actividadId === lmv);
    const agua = datos.rondas.find((ronda) => ronda.actividadId === diaria);
    expect(ingles).toMatchObject({ actividadId: lmv, titulo: "Inglés", porcentaje: 50 });
    // Siete días hasta hoy: antes de crearse, la actividad no tocaba.
    expect(ingles.dias).toEqual([
      { dia: "2026-11-06", tocaba: false, llena: false },
      { dia: "2026-11-07", tocaba: false, llena: false },
      { dia: "2026-11-08", tocaba: false, llena: false },
      { dia: "2026-11-09", tocaba: true, llena: true },
      { dia: "2026-11-10", tocaba: false, llena: false },
      { dia: "2026-11-11", tocaba: true, llena: false },
      { dia: "2026-11-12", tocaba: false, llena: false },
    ]);
    expect(agua).toMatchObject({ actividadId: diaria, porcentaje: 50 });

    // La semana siguiente compara con esta.
    entorno.avanzar(7 * DIA_MS);
    const siguiente = (await abeja.get("/api/reportes?desde=2026-11-16&hasta=2026-11-22")).datos;
    expect(siguiente.periodoAnterior).toBe(5);
    // La tira siempre tiene siete días, aunque el periodo vaya por la mitad.
    expect(siguiente.rondas.map((ronda) => ronda.dias.length)).toEqual([7, 7]);
  });

  test("sin periodo, los últimos siete días hasta hoy", async () => {
    const abeja = await entorno.nuevaAbeja();
    const { datos } = await abeja.get("/api/reportes");
    expect(datos).toMatchObject({ desde: "2026-11-03", hasta: "2026-11-09", hoy: "2026-11-09" });
    expect(datos.celdasPorDia).toHaveLength(7);
    expect(datos).toMatchObject({
      rondas: [],
      reparto: { unicas: 0, recurrentes: 0 },
      colmenas: [],
    });
  });

  test("un periodo inválido es un 400", async () => {
    const abeja = await entorno.nuevaAbeja();
    const alReves = await abeja.get("/api/reportes?desde=2026-11-10&hasta=2026-11-01");
    expect(alReves.estado).toBe(400);
    expect(alReves.datos.error.codigo).toBe("datos_invalidos");
    expect((await abeja.get("/api/reportes?desde=2026-01-01&hasta=2026-11-01")).estado).toBe(400);
    const roto = await abeja.get("/api/reportes?hasta=ayer");
    expect(roto.estado).toBe(400);
    expect(roto.datos.error.campos).toHaveProperty("hasta");
  });

  test("sin sesión: 401", async () => {
    expect((await entorno.cliente().get("/api/reportes")).estado).toBe(401);
  });

  test("solo cuenta las celdas propias y las colmenas en las que sigue", async () => {
    const abeja = await entorno.nuevaAbeja();
    const otra = await entorno.nuevaAbeja();
    const ajena = await crearActividad(otra, { titulo: "Ajena" });
    entorno.avanzar(5 * 60 * 1000);
    await otra.put(`/api/celdas/${nuevoId()}`, { actividadId: ajena });
    await otra.post("/api/colmenas", { nombre: "Ajena" });
    const { datos } = await abeja.get("/api/reportes");
    expect(datos.celdasPorDia.reduce((suma, dia) => suma + dia.llenas, 0)).toBe(0);
    expect(datos.colmenas).toEqual([]);
  });
});
