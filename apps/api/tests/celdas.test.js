import { afterAll, beforeAll, beforeEach, describe, expect, test } from "vite-plus/test";
import { crearActividad, crearEntorno, DIA_MS, MARTES, nuevoId } from "./ayudantes.js";

/** @type {Awaited<ReturnType<typeof crearEntorno>>} */
let entorno;
beforeAll(async () => {
  entorno = await crearEntorno();
});
afterAll(() => entorno.cerrar());
beforeEach(() => {
  entorno.reloj.ahora = MARTES;
});

const MINUTO_MS = 60 * 1000;

/** Una abeja con una actividad creada hace un rato, para que no sea relámpago. */
async function abejaConActividad(
  datos = { titulo: "Caminar", tipo: "recurrente", regla: { clase: "diaria" } },
) {
  const abeja = await entorno.nuevaAbeja();
  const actividadId = await crearActividad(abeja, datos);
  entorno.avanzar(5 * MINUTO_MS);
  return { abeja, actividadId };
}

describe("llenar una celda", () => {
  test("el servidor pone el día y el instante, y el motor las gotas", async () => {
    const { abeja, actividadId } = await abejaConActividad();
    const id = nuevoId();
    const { estado, datos } = await abeja.put(`/api/celdas/${id}`, {
      actividadId,
      dia: "2020-01-01",
    });
    expect(estado).toBe(200);
    expect(datos.celda).toEqual({
      id,
      actividadId,
      personaId: abeja.perfil.id,
      dia: "2026-11-17",
      llenadaEn: new Date(entorno.reloj.ahora).toISOString(),
      gotas: 10,
    });
    expect(datos.celebraciones.map((celebracion) => celebracion.tipo)).toEqual([
      "sello",
      "sello",
      "panal-cerrado",
    ]);
  });

  test("repetir el mismo envío devuelve la misma celda sin duplicarla ni celebrar otra vez", async () => {
    const { abeja, actividadId } = await abejaConActividad();
    const id = nuevoId();
    const primera = await abeja.put(`/api/celdas/${id}`, { actividadId });
    entorno.avanzar(MINUTO_MS);
    const segunda = await abeja.put(`/api/celdas/${id}`, { actividadId });
    expect(segunda.estado).toBe(200);
    expect(segunda.datos).toEqual({ celda: primera.datos.celda, celebraciones: [] });
    const filas = await entorno.base.consulta(
      "select count(*)::int as n from celdas_llenas where actividad_id = $1",
      [actividadId],
    );
    expect(filas[0].n).toBe(1);
  });

  test("una recurrente se llena una vez por día; una única, una sola vez", async () => {
    const { abeja, actividadId } = await abejaConActividad();
    await abeja.put(`/api/celdas/${nuevoId()}`, { actividadId });
    const otraVez = await abeja.put(`/api/celdas/${nuevoId()}`, { actividadId });
    expect(otraVez.estado).toBe(409);
    expect(otraVez.datos.error.codigo).toBe("celda_ya_llena");
    entorno.avanzar(DIA_MS);
    expect((await abeja.put(`/api/celdas/${nuevoId()}`, { actividadId })).estado).toBe(200);

    const unica = await crearActividad(abeja, { titulo: "Informe" });
    await abeja.put(`/api/celdas/${nuevoId()}`, { actividadId: unica });
    entorno.avanzar(DIA_MS);
    const deNuevo = await abeja.put(`/api/celdas/${nuevoId()}`, { actividadId: unica });
    expect(deNuevo.estado).toBe(409);
    expect(deNuevo.datos.error.codigo).toBe("celda_ya_llena");
  });

  test("el mismo identificador con otra actividad es un conflicto", async () => {
    const { abeja, actividadId } = await abejaConActividad();
    const otra = await crearActividad(abeja, { titulo: "Otra" });
    const id = nuevoId();
    await abeja.put(`/api/celdas/${id}`, { actividadId });
    const { estado } = await abeja.put(`/api/celdas/${id}`, { actividadId: otra });
    expect(estado).toBe(409);
  });

  test("el valor de cada celda: única, prioridad alta, vencida y relámpago", async () => {
    const abeja = await entorno.nuevaAbeja();
    const unica = await crearActividad(abeja, { titulo: "Única" });
    const alta = await crearActividad(abeja, { titulo: "Alta", prioridad: "alta" });
    const vencida = await crearActividad(abeja, { titulo: "Vencida", vence: "2026-11-16" });
    entorno.avanzar(5 * MINUTO_MS);
    const gotas = async (actividadId) =>
      (await abeja.put(`/api/celdas/${nuevoId()}`, { actividadId })).datos.celda.gotas;
    expect(await gotas(unica)).toBe(25);
    expect(await gotas(alta)).toBe(35);
    expect(await gotas(vencida)).toBe(15);
    // Creada y llenada en menos de un minuto: vale la mitad.
    const relampago = await crearActividad(abeja, { titulo: "Relámpago" });
    expect(await gotas(relampago)).toBe(12);
  });

  test("datos inválidos: 400", async () => {
    const { abeja } = await abejaConActividad();
    const sinActividad = await abeja.put(`/api/celdas/${nuevoId()}`, {});
    expect(sinActividad.estado).toBe(400);
    expect(sinActividad.datos.error.campos).toHaveProperty("actividadId");
    const idMalo = await abeja.put("/api/celdas/123", { actividadId: nuevoId() });
    expect(idMalo.estado).toBe(400);
    expect(idMalo.datos.error.campos).toHaveProperty("id");
  });

  test("una actividad que no existe o está archivada: 404", async () => {
    const { abeja, actividadId } = await abejaConActividad();
    expect((await abeja.put(`/api/celdas/${nuevoId()}`, { actividadId: nuevoId() })).estado).toBe(
      404,
    );
    await abeja.patch(`/api/actividades/${actividadId}`, { archivada: true });
    expect((await abeja.put(`/api/celdas/${nuevoId()}`, { actividadId })).estado).toBe(404);
  });

  test("sin sesión: 401; la actividad personal de otra persona: 403", async () => {
    const { actividadId } = await abejaConActividad();
    expect((await entorno.cliente().put(`/api/celdas/${nuevoId()}`, { actividadId })).estado).toBe(
      401,
    );
    const intrusa = await entorno.nuevaAbeja();
    const { estado, datos } = await intrusa.put(`/api/celdas/${nuevoId()}`, { actividadId });
    expect(estado).toBe(403);
    expect(datos.error.codigo).toBe("sin_permiso");
  });

  test("en una colmena: la asignada a otra abeja es ajena; una libre la llena cualquiera", async () => {
    const fundadora = await entorno.nuevaAbeja();
    const otra = await entorno.nuevaAbeja();
    const colmenaId = (await fundadora.post("/api/colmenas", { nombre: "Taller" })).datos.colmena
      .id;
    const { codigo } = (await fundadora.post(`/api/colmenas/${colmenaId}/invitacion`)).datos
      .invitacion;
    await otra.post(`/api/invitaciones/${codigo}/aceptar`);
    const asignada = await crearActividad(fundadora, {
      titulo: "De la fundadora",
      colmenaId,
      asignadaA: fundadora.perfil.id,
    });
    const libre = await crearActividad(fundadora, { titulo: "Libre", colmenaId });
    entorno.avanzar(5 * MINUTO_MS);

    const ajena = await otra.put(`/api/celdas/${nuevoId()}`, { actividadId: asignada });
    expect(ajena.estado).toBe(409);
    expect(ajena.datos.error.codigo).toBe("celda_ajena");
    expect((await otra.put(`/api/celdas/${nuevoId()}`, { actividadId: libre })).estado).toBe(200);
    // Ya la llenó otra abeja.
    const tarde = await fundadora.put(`/api/celdas/${nuevoId()}`, { actividadId: libre });
    expect(tarde.datos.error.codigo).toBe("celda_ya_llena");

    const fuera = await entorno.nuevaAbeja();
    expect((await fuera.put(`/api/celdas/${nuevoId()}`, { actividadId: asignada })).estado).toBe(
      403,
    );
  });
});

describe("el día cambia a las 03:00 de la zona de cada persona", () => {
  test("a las 02:30 la celda es del día anterior; a las 03:00, del nuevo", async () => {
    const { abeja, actividadId } = await abejaConActividad();
    // Miércoles 18 a las 02:30 en La Paz (UTC−4): todavía es martes en Panal.
    entorno.reloj.ahora = Date.parse("2026-11-18T06:30:00Z");
    const madrugada = await abeja.put(`/api/celdas/${nuevoId()}`, { actividadId });
    expect(madrugada.datos.celda.dia).toBe("2026-11-17");
    expect((await abeja.get("/api/panal")).datos.hoy).toBe("2026-11-17");

    entorno.reloj.ahora = Date.parse("2026-11-18T06:59:59Z");
    const antes = await abeja.put(`/api/celdas/${nuevoId()}`, { actividadId });
    expect(antes.estado).toBe(409);

    entorno.reloj.ahora = Date.parse("2026-11-18T07:00:00Z");
    const nuevoDia = await abeja.put(`/api/celdas/${nuevoId()}`, { actividadId });
    expect(nuevoDia.estado).toBe(200);
    expect(nuevoDia.datos.celda.dia).toBe("2026-11-18");
    expect((await abeja.get("/api/panal")).datos.hoy).toBe("2026-11-18");
  });

  test("cada persona usa su propia zona horaria", async () => {
    const { abeja, actividadId } = await abejaConActividad();
    await abeja.patch("/api/yo", { zonaHoraria: "Asia/Tokyo" });
    // 15:05 UTC del martes son las 00:05 del miércoles en Tokio: sigue siendo martes en Panal.
    expect((await abeja.put(`/api/celdas/${nuevoId()}`, { actividadId })).datos.celda.dia).toBe(
      "2026-11-17",
    );
    entorno.reloj.ahora = Date.parse("2026-11-17T18:00:00Z"); // 03:00 en Tokio
    expect((await abeja.put(`/api/celdas/${nuevoId()}`, { actividadId })).datos.celda.dia).toBe(
      "2026-11-18",
    );
  });
});

describe("deshacer", () => {
  test("solo quien la llenó; las gotas desaparecen con ella", async () => {
    const { abeja, actividadId } = await abejaConActividad();
    const id = nuevoId();
    await abeja.put(`/api/celdas/${id}`, { actividadId });
    expect((await abeja.get("/api/yo/progreso")).datos.gotas.total).toBeGreaterThan(0);

    const intrusa = await entorno.nuevaAbeja();
    const ajena = await intrusa.delete(`/api/celdas/${id}`);
    expect(ajena.estado).toBe(403);
    expect((await entorno.cliente().delete(`/api/celdas/${id}`)).estado).toBe(401);

    expect((await abeja.delete(`/api/celdas/${id}`)).estado).toBe(204);
    expect((await abeja.get("/api/yo/progreso")).datos.gotas.total).toBe(0);
    // Deshacer otra vez no falla: ya no hay nada que deshacer.
    expect((await abeja.delete(`/api/celdas/${id}`)).estado).toBe(204);
    expect((await abeja.delete("/api/celdas/no-es-un-id")).estado).toBe(204);
  });
});
