import { afterAll, beforeAll, beforeEach, describe, expect, test } from "vite-plus/test";
import { crearActividad as crearUna, crearEntorno, DIA_MS, MARTES, nuevoId } from "./ayudantes.js";

/** @type {Awaited<ReturnType<typeof crearEntorno>>} */
let entorno;
beforeAll(async () => {
  entorno = await crearEntorno();
});
afterAll(() => entorno.cerrar());
beforeEach(() => {
  entorno.reloj.ahora = MARTES;
});

/**
 * Crea una actividad y deja pasar un segundo, para que el orden de creación sea claro.
 * @param {Parameters<typeof crearUna>} argumentos
 */
async function crearActividad(...argumentos) {
  const id = await crearUna(...argumentos);
  entorno.avanzar(1000);
  return id;
}

/**
 * Funda una colmena e invita a otras abejas.
 * @param {number} invitadas
 */
async function enjambre(invitadas = 1) {
  const fundadora = await entorno.nuevaAbeja({ nombre: "Sofia" });
  const { datos } = await fundadora.post("/api/colmenas", {
    nombre: "Proyecto final",
    descripcion: "La plataforma de la materia",
    entregaEl: "2026-11-26",
  });
  const colmenaId = datos.colmena.id;
  const otras = [];
  for (let numero = 0; numero < invitadas; numero += 1) {
    const abeja = await entorno.nuevaAbeja({ nombre: `Abeja${numero}` });
    const { codigo } = (await fundadora.post(`/api/colmenas/${colmenaId}/invitacion`)).datos
      .invitacion;
    await abeja.post(`/api/invitaciones/${codigo}/aceptar`);
    otras.push(abeja);
  }
  return { fundadora, otras, colmenaId };
}

describe("fundar y ver colmenas", () => {
  test("fundar responde 201 con la colmena; la fundadora toma el primer color", async () => {
    const abeja = await entorno.nuevaAbeja({ nombre: "Sofia" });
    const { estado, datos } = await abeja.post("/api/colmenas", {
      nombre: " Taller ",
      entregaEl: "2026-12-01",
    });
    expect(estado).toBe(201);
    expect(datos.colmena).toEqual({
      id: expect.any(String),
      nombre: "Taller",
      descripcion: null,
      entregaEl: "2026-12-01",
      fundadoraId: abeja.perfil.id,
      cerradaEn: null,
      archivadaEn: null,
      avance: {
        total: 0,
        llenas: 0,
        porcentaje: 0,
        cuadro: 0,
        faltanParaElSiguiente: 0,
        cerrada: false,
      },
      integrantes: [{ id: abeja.perfil.id, nombre: "Sofia", color: 0 }],
      celdas: [],
    });
  });

  test("datos inválidos y sin sesión", async () => {
    const abeja = await entorno.nuevaAbeja();
    const { estado, datos } = await abeja.post("/api/colmenas", {
      nombre: "",
      entregaEl: "mañana",
    });
    expect(estado).toBe(400);
    expect(Object.keys(datos.error.campos).sort()).toEqual(["entregaEl", "nombre"]);
    expect((await entorno.cliente().post("/api/colmenas", { nombre: "X" })).estado).toBe(401);
    expect((await entorno.cliente().get("/api/colmenas")).estado).toBe(401);
  });

  test("la lista trae el avance, el enjambre y una celda por actividad", async () => {
    const { fundadora, otras, colmenaId } = await enjambre(1);
    const primera = await crearActividad(fundadora, { titulo: "Primera", colmenaId });
    await crearActividad(fundadora, {
      titulo: "Segunda",
      colmenaId,
      asignadaA: otras[0].perfil.id,
    });
    entorno.avanzar(5 * 60 * 1000);
    await otras[0].put(`/api/celdas/${nuevoId()}`, { actividadId: primera });

    const { estado, datos } = await otras[0].get("/api/colmenas");
    expect(estado).toBe(200);
    expect(datos.colmenas).toHaveLength(1);
    expect(datos.colmenas[0]).toMatchObject({
      id: colmenaId,
      avance: {
        total: 2,
        llenas: 1,
        porcentaje: 50,
        cuadro: 2,
        faltanParaElSiguiente: 1,
        cerrada: false,
      },
      integrantes: [
        { id: fundadora.perfil.id, color: 0 },
        { id: otras[0].perfil.id, color: 1 },
      ],
      celdas: [
        { actividadId: primera, llenaPor: otras[0].perfil.id },
        { actividadId: expect.any(String), llenaPor: null },
      ],
    });
  });

  test("el detalle: actividades con quién las llenó y el aporte de cada abeja", async () => {
    const { fundadora, otras, colmenaId } = await enjambre(1);
    const primera = await crearActividad(fundadora, { titulo: "Primera", colmenaId });
    await crearActividad(fundadora, {
      titulo: "Segunda",
      colmenaId,
      asignadaA: otras[0].perfil.id,
    });
    entorno.avanzar(5 * 60 * 1000);
    const celdaId = nuevoId();
    await fundadora.put(`/api/celdas/${celdaId}`, { actividadId: primera });

    const { estado, datos } = await otras[0].get(`/api/colmenas/${colmenaId}`);
    expect(estado).toBe(200);
    expect(datos.hoy).toBe("2026-11-17");
    expect(datos.colmena.avance.llenas).toBe(1);
    expect(datos.actividades.map((a) => [a.titulo, a.llenaPor, a.llenadaEl, a.celdaId])).toEqual([
      ["Primera", fundadora.perfil.id, "2026-11-17", celdaId],
      ["Segunda", null, null, null],
    ]);
    expect(datos.enjambre).toEqual([
      expect.objectContaining({
        id: fundadora.perfil.id,
        aportes: 1,
        pendientes: 0,
        unidaEn: expect.any(String),
      }),
      expect.objectContaining({ id: otras[0].perfil.id, aportes: 0, pendientes: 1 }),
    ]);
    // Los integrantes se ven el nombre y el color, nunca el correo.
    expect(JSON.stringify(datos)).not.toContain("@prueba.test");
  });

  test("solo los integrantes ven el detalle; lo que no existe es 404", async () => {
    const { colmenaId } = await enjambre(0);
    const ajena = await entorno.nuevaAbeja();
    const { estado, datos } = await ajena.get(`/api/colmenas/${colmenaId}`);
    expect(estado).toBe(403);
    expect(datos.error.codigo).toBe("sin_permiso");
    expect((await ajena.get(`/api/colmenas/${nuevoId()}`)).estado).toBe(404);
    expect((await ajena.get("/api/colmenas/no-es-un-id")).estado).toBe(404);
    expect((await entorno.cliente().get(`/api/colmenas/${colmenaId}`)).estado).toBe(401);
  });
});

describe("editar y archivar", () => {
  test("solo la fundadora edita, archiva y recupera", async () => {
    const { fundadora, otras, colmenaId } = await enjambre(1);
    for (const cambio of [{ nombre: "Otra" }, { archivada: true }]) {
      expect((await otras[0].patch(`/api/colmenas/${colmenaId}`, cambio)).estado).toBe(403);
    }
    const editada = await fundadora.patch(`/api/colmenas/${colmenaId}`, {
      nombre: "Proyecto final II",
      entregaEl: null,
    });
    expect(editada.datos.colmena).toMatchObject({ nombre: "Proyecto final II", entregaEl: null });

    const archivada = await fundadora.patch(`/api/colmenas/${colmenaId}`, { archivada: true });
    expect(archivada.datos.colmena.archivadaEn).toBe(new Date(entorno.reloj.ahora).toISOString());
    // Archivada, ya no se edita: solo se recupera.
    expect((await fundadora.patch(`/api/colmenas/${colmenaId}`, { nombre: "X" })).estado).toBe(403);
    const recuperada = await fundadora.patch(`/api/colmenas/${colmenaId}`, { archivada: false });
    expect(recuperada.datos.colmena.archivadaEn).toBeNull();
  });

  test("la fundadora pasa la fundación a otra abeja y entonces puede salir", async () => {
    const { fundadora, otras, colmenaId } = await enjambre(2);
    const ajena = await entorno.nuevaAbeja();
    const aAjena = await fundadora.patch(`/api/colmenas/${colmenaId}`, {
      fundadoraId: ajena.perfil.id,
    });
    expect(aAjena.estado).toBe(400);
    // Nadie se nombra fundadora a sí misma.
    expect(
      (await otras[0].patch(`/api/colmenas/${colmenaId}`, { fundadoraId: otras[0].perfil.id }))
        .estado,
    ).toBe(403);

    const pasada = await fundadora.patch(`/api/colmenas/${colmenaId}`, {
      fundadoraId: otras[0].perfil.id,
    });
    expect(pasada.datos.colmena.fundadoraId).toBe(otras[0].perfil.id);
    expect(
      (await fundadora.delete(`/api/colmenas/${colmenaId}/integrantes/${fundadora.perfil.id}`))
        .estado,
    ).toBe(204);
  });

  test("datos inválidos, sin sesión y sin permiso", async () => {
    const { fundadora, colmenaId } = await enjambre(0);
    expect((await fundadora.patch(`/api/colmenas/${colmenaId}`, { nombre: "" })).estado).toBe(400);
    expect(
      (await entorno.cliente().patch(`/api/colmenas/${colmenaId}`, { nombre: "X" })).estado,
    ).toBe(401);
    const ajena = await entorno.nuevaAbeja();
    expect((await ajena.patch(`/api/colmenas/${colmenaId}`, { nombre: "X" })).estado).toBe(403);
  });
});

describe("invitaciones", () => {
  test("el enlace se crea, se vuelve a mostrar y al renovarlo el anterior deja de servir", async () => {
    const { fundadora, colmenaId } = await enjambre(0);
    expect((await fundadora.get(`/api/colmenas/${colmenaId}/invitacion`)).datos).toEqual({
      invitacion: null,
    });

    const creada = await fundadora.post(`/api/colmenas/${colmenaId}/invitacion`);
    expect(creada.estado).toBe(201);
    expect(creada.datos.invitacion).toEqual({
      codigo: expect.stringMatching(/^[\w-]{22}$/),
      venceEn: new Date(entorno.reloj.ahora + 7 * DIA_MS).toISOString(),
    });
    expect((await fundadora.get(`/api/colmenas/${colmenaId}/invitacion`)).datos).toEqual(
      creada.datos,
    );

    const nueva = await fundadora.post(`/api/colmenas/${colmenaId}/invitacion`);
    expect(nueva.datos.invitacion.codigo).not.toBe(creada.datos.invitacion.codigo);
    const vieja = await entorno
      .cliente()
      .get(`/api/invitaciones/${creada.datos.invitacion.codigo}`);
    expect(vieja.estado).toBe(410);
    expect(vieja.datos.error.codigo).toBe("invitacion_vencida");
  });

  test("ver una invitación no pide sesión", async () => {
    const { fundadora, colmenaId } = await enjambre(1);
    const { codigo, venceEn } = (await fundadora.post(`/api/colmenas/${colmenaId}/invitacion`))
      .datos.invitacion;
    const anonima = await entorno.cliente().get(`/api/invitaciones/${codigo}`);
    expect(anonima.estado).toBe(200);
    expect(anonima.datos).toEqual({
      colmena: { id: colmenaId, nombre: "Proyecto final", abejas: 2 },
      invita: { nombre: "Sofia" },
      venceEn,
      yaSoyIntegrante: false,
    });
    expect((await fundadora.get(`/api/invitaciones/${codigo}`)).datos.yaSoyIntegrante).toBe(true);
    expect((await entorno.cliente().get("/api/invitaciones/no-existe")).estado).toBe(404);
  });

  test("aceptar suma a la abeja con el menor color libre; dos veces es un conflicto", async () => {
    const { fundadora, otras, colmenaId } = await enjambre(2);
    expect(otras.length).toBe(2);
    // La de color 1 sale; quien llega después toma ese color.
    await otras[0].delete(`/api/colmenas/${colmenaId}/integrantes/${otras[0].perfil.id}`);
    const nueva = await entorno.nuevaAbeja({ nombre: "Nueva" });
    const { codigo } = (await fundadora.post(`/api/colmenas/${colmenaId}/invitacion`)).datos
      .invitacion;
    const aceptada = await nueva.post(`/api/invitaciones/${codigo}/aceptar`);
    expect(aceptada.estado).toBe(200);
    expect(aceptada.datos.colmena.integrantes.map((i) => [i.nombre, i.color])).toEqual([
      ["Sofia", 0],
      ["Abeja1", 2],
      ["Nueva", 1],
    ]);
    const repetida = await nueva.post(`/api/invitaciones/${codigo}/aceptar`);
    expect(repetida.estado).toBe(409);
    expect(repetida.datos.error.codigo).toBe("ya_eres_integrante");
  });

  test("a los siete días vence; aceptar pide sesión", async () => {
    const { fundadora, colmenaId } = await enjambre(0);
    const { codigo } = (await fundadora.post(`/api/colmenas/${colmenaId}/invitacion`)).datos
      .invitacion;
    expect((await entorno.cliente().post(`/api/invitaciones/${codigo}/aceptar`)).estado).toBe(401);
    entorno.avanzar(7 * DIA_MS);
    const abeja = await entorno.nuevaAbeja();
    expect((await abeja.post(`/api/invitaciones/${codigo}/aceptar`)).estado).toBe(410);
  });

  test("solo los integrantes ven o crean el enlace", async () => {
    const { colmenaId } = await enjambre(0);
    const ajena = await entorno.nuevaAbeja();
    expect((await ajena.get(`/api/colmenas/${colmenaId}/invitacion`)).estado).toBe(403);
    expect((await ajena.post(`/api/colmenas/${colmenaId}/invitacion`)).estado).toBe(403);
    expect((await entorno.cliente().post(`/api/colmenas/${colmenaId}/invitacion`)).estado).toBe(
      401,
    );
  });
});

describe("salir y quitar abejas", () => {
  test("salir libera las celdas asignadas pendientes y conserva las llenas", async () => {
    const { fundadora, otras, colmenaId } = await enjambre(1);
    const [abeja] = otras;
    const pendiente = await crearActividad(fundadora, {
      titulo: "Pendiente",
      colmenaId,
      asignadaA: abeja.perfil.id,
    });
    const llena = await crearActividad(fundadora, {
      titulo: "Llena",
      colmenaId,
      asignadaA: abeja.perfil.id,
    });
    entorno.avanzar(5 * 60 * 1000);
    await abeja.put(`/api/celdas/${nuevoId()}`, { actividadId: llena });

    expect(
      (await abeja.delete(`/api/colmenas/${colmenaId}/integrantes/${abeja.perfil.id}`)).estado,
    ).toBe(204);
    const { datos } = await fundadora.get(`/api/colmenas/${colmenaId}`);
    expect(datos.enjambre.map((i) => i.id)).toEqual([fundadora.perfil.id]);
    const porId = Object.fromEntries(datos.actividades.map((a) => [a.id, a]));
    expect(porId[pendiente].asignadaA).toBeNull();
    expect(porId[llena]).toMatchObject({ asignadaA: abeja.perfil.id, llenaPor: abeja.perfil.id });
    expect((await abeja.get(`/api/colmenas/${colmenaId}`)).estado).toBe(403);
  });

  test("la fundadora quita abejas, pero no sale mientras haya otras", async () => {
    const { fundadora, otras, colmenaId } = await enjambre(2);
    const sale = await fundadora.delete(
      `/api/colmenas/${colmenaId}/integrantes/${fundadora.perfil.id}`,
    );
    expect(sale.estado).toBe(409);
    expect(sale.datos.error.codigo).toBe("fundadora_no_sale");

    const quitar = await otras[0].delete(
      `/api/colmenas/${colmenaId}/integrantes/${otras[1].perfil.id}`,
    );
    expect(quitar.estado).toBe(403);
    expect(
      (await fundadora.delete(`/api/colmenas/${colmenaId}/integrantes/${otras[1].perfil.id}`))
        .estado,
    ).toBe(204);
    expect(
      (await fundadora.delete(`/api/colmenas/${colmenaId}/integrantes/${otras[1].perfil.id}`))
        .estado,
    ).toBe(404);
    expect(
      (
        await entorno
          .cliente()
          .delete(`/api/colmenas/${colmenaId}/integrantes/${otras[0].perfil.id}`)
      ).estado,
    ).toBe(401);
  });
});

describe("el cierre de una colmena", () => {
  test("al llegar al 100 % se cierra y se celebra; agregar una actividad la vuelve a abrir", async () => {
    const { fundadora, otras, colmenaId } = await enjambre(1);
    const ids = [];
    for (const titulo of ["Uno", "Dos", "Tres", "Cuatro", "Cinco"]) {
      ids.push(await crearActividad(fundadora, { titulo, colmenaId }));
    }
    entorno.avanzar(5 * 60 * 1000);
    const llenar = (abeja, actividadId) => abeja.put(`/api/celdas/${nuevoId()}`, { actividadId });

    const primera = await llenar(otras[0], ids[0]);
    expect(primera.datos.celebraciones).toContainEqual(
      expect.objectContaining({ tipo: "cuadro", colmenaId, cuadro: 1, gotas: 30 }),
    );
    // El bono del cuadro ya cuenta en las gotas de hoy de quien lo cerró.
    expect(primera.datos.bonosDeHoy).toBe(30);
    for (const id of ids.slice(1, 4)) await llenar(fundadora, id);
    const ultima = await llenar(otras[0], ids[4]);
    expect(ultima.datos.celebraciones[0]).toMatchObject({
      tipo: "colmena-cerrada",
      colmenaId,
      gotas: 100,
    });

    const cerrada = (await fundadora.get(`/api/colmenas/${colmenaId}`)).datos.colmena;
    expect(cerrada.avance).toMatchObject({ porcentaje: 100, cerrada: true });
    expect(cerrada.cerradaEn).toBe(new Date(entorno.reloj.ahora).toISOString());

    await crearActividad(fundadora, { titulo: "Seis", colmenaId });
    const abierta = (await fundadora.get(`/api/colmenas/${colmenaId}`)).datos.colmena;
    expect(abierta).toMatchObject({ cerradaEn: null, avance: { porcentaje: 83, cerrada: false } });
  });

  test("deshacer la última celda también la vuelve a abrir", async () => {
    const { fundadora, colmenaId } = await enjambre(0);
    const id = await crearActividad(fundadora, { titulo: "Única", colmenaId });
    entorno.avanzar(5 * 60 * 1000);
    const celdaId = nuevoId();
    await fundadora.put(`/api/celdas/${celdaId}`, { actividadId: id });
    expect((await fundadora.get("/api/colmenas")).datos.colmenas[0].cerradaEn).not.toBeNull();
    await fundadora.delete(`/api/celdas/${celdaId}`);
    expect((await fundadora.get("/api/colmenas")).datos.colmenas[0].cerradaEn).toBeNull();
  });
});
