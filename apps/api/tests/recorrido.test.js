import { afterAll, beforeAll, describe, expect, test } from "vite-plus/test";
import { crearEntorno, DIA_MS, nuevoId } from "./ayudantes.js";

/** @type {Awaited<ReturnType<typeof crearEntorno>>} */
let entorno;
beforeAll(async () => {
  entorno = await crearEntorno();
});
afterAll(() => entorno.cerrar());

const MINUTO_MS = 60 * 1000;

describe("recorrido completo", () => {
  test("registro, primer vuelo, crear, llenar, celebrar el panal cerrado y deshacer", async () => {
    // 1. Crear el panal.
    const registro = await entorno.cliente().post("/api/cuenta", {
      nombre: "Camila",
      correo: "camila@panal.test",
      clave: "panal1234",
    });
    expect(registro.estado).toBe(201);
    const camila = entorno.cliente(entorno.cookieDe(registro.respuesta));
    expect(registro.datos.primerVueloEn).toBeNull();

    // 2. Primer vuelo: un panal de tres celdas, que rige al instante.
    const vuelo = await camila.post("/api/yo/primer-vuelo", { metaDiaria: 3 });
    expect(vuelo.datos).toMatchObject({ metaDiaria: 3, primerVueloEn: expect.any(String) });

    // 3. La primera celda.
    const actividadId = nuevoId();
    const creada = await camila.put(`/api/actividades/${actividadId}`, {
      titulo: "Tomar agua",
      tipo: "recurrente",
      regla: { clase: "diaria" },
    });
    expect(creada.estado).toBe(201);

    const antes = (await camila.get("/api/panal")).datos;
    expect(antes).toMatchObject({
      hoy: "2026-11-17",
      persona: { nombre: "Camila", metaDiaria: 3 },
      progreso: { gotasHastaAyer: 0, bonosDeHoy: 0, vueloHastaAyer: { racha: 0, reservas: 1 } },
      actividades: [{ id: actividadId, titulo: "Tomar agua" }],
      celdasLlenas: [],
      colmena: null,
      colmenasActivas: 0,
    });

    // 4. Llenarla. Con una sola actividad, la meta del día es una: el panal se cierra.
    entorno.avanzar(2 * MINUTO_MS);
    const celdaId = nuevoId();
    const llena = await camila.put(`/api/celdas/${celdaId}`, { actividadId });
    expect(llena.estado).toBe(200);
    expect(llena.datos.celda).toMatchObject({ id: celdaId, dia: "2026-11-17", gotas: 10 });
    expect(llena.datos.celebraciones).toEqual([
      { tipo: "sello", id: "primera-celda", nombre: "Primera celda" },
      { tipo: "sello", id: "panal-cerrado", nombre: "Panal cerrado" },
      { tipo: "panal-cerrado", gotas: 20, racha: 1 },
    ]);

    const despues = (await camila.get("/api/panal")).datos;
    expect(despues.celdasLlenas).toEqual([llena.datos.celda]);
    // El navegador da el paso de hoy; hasta ayer no cambió nada.
    expect(despues.progreso.gotasHastaAyer).toBe(0);
    const progreso = (await camila.get("/api/yo/progreso")).datos;
    expect(progreso).toMatchObject({
      gotas: { total: 30, desglose: { celdas: 10, cierres: 20 } },
      racha: { actual: 1, mejor: 1, reservas: 1 },
    });
    expect(progreso.sellos.filter((sello) => sello.ganado).map((sello) => sello.id)).toEqual([
      "primera-celda",
      "panal-cerrado",
    ]);

    // 5. Deshacer: todo vuelve a como estaba.
    expect((await camila.delete(`/api/celdas/${celdaId}`)).estado).toBe(204);
    const deshecho = (await camila.get("/api/panal")).datos;
    expect(deshecho.celdasLlenas).toEqual([]);
    expect((await camila.get("/api/yo/progreso")).datos).toMatchObject({
      gotas: { total: 0 },
      racha: { actual: 0, reservas: 1 },
    });

    // 6. Al día siguiente lo de ayer cuenta en "hasta ayer".
    await camila.put(`/api/celdas/${nuevoId()}`, { actividadId });
    entorno.avanzar(DIA_MS);
    const manana = (await camila.get("/api/panal")).datos;
    expect(manana).toMatchObject({
      hoy: "2026-11-18",
      progreso: { gotasHastaAyer: 30, vueloHastaAyer: { racha: 1, panalesCerrados: 1 } },
    });
  });
});

describe("la pantalla Hoy", () => {
  test("muestra la colmena con la celda llenada más recientemente y las celdas de cinco semanas", async () => {
    const ana = await entorno.nuevaAbeja({ nombre: "Ana" });
    const vieja = (await ana.post("/api/colmenas", { nombre: "Vieja" })).datos.colmena.id;
    entorno.avanzar(MINUTO_MS);
    const nueva = (await ana.post("/api/colmenas", { nombre: "Nueva" })).datos.colmena.id;
    const archivada = (await ana.post("/api/colmenas", { nombre: "Archivada" })).datos.colmena.id;
    await ana.patch(`/api/colmenas/${archivada}`, { archivada: true });

    // Sin celdas en ninguna, elige la más nueva de las activas.
    let panal = (await ana.get("/api/panal")).datos;
    expect(panal.colmena.nombre).toBe("Nueva");
    expect(panal.colmenasActivas).toBe(2);

    const deLaVieja = nuevoId();
    await ana.put(`/api/actividades/${deLaVieja}`, {
      titulo: "De la vieja",
      tipo: "unica",
      colmenaId: vieja,
      asignadaA: ana.perfil.id,
    });
    await ana.put(`/api/actividades/${nuevoId()}`, {
      titulo: "Libre de la nueva",
      tipo: "unica",
      colmenaId: nueva,
    });
    entorno.avanzar(2 * MINUTO_MS);
    await ana.put(`/api/celdas/${nuevoId()}`, { actividadId: deLaVieja });

    panal = (await ana.get("/api/panal")).datos;
    expect(panal.colmena).toMatchObject({
      id: vieja,
      nombre: "Vieja",
      integrantes: [{ id: ana.perfil.id, nombre: "Ana", color: 0 }],
      celdas: [{ actividadId: deLaVieja, llenaPor: ana.perfil.id }],
    });
    // Su panal tiene la asignada a ella, no la libre.
    expect(panal.actividades.map((a) => a.titulo)).toEqual(["De la vieja"]);

    // Mañana, la única ya cumplida deja el panal; la celda sigue en el historial.
    entorno.avanzar(DIA_MS);
    panal = (await ana.get("/api/panal")).datos;
    expect(panal.actividades).toEqual([]);
    expect(panal.celdasLlenas).toHaveLength(1);

    // A las seis semanas ya no viaja con el panal. A mitad de camino entra, para que la sesión siga viva.
    entorno.avanzar(21 * DIA_MS);
    expect((await ana.get("/api/panal")).datos.celdasLlenas).toHaveLength(1);
    entorno.avanzar(21 * DIA_MS);
    expect((await ana.get("/api/panal")).datos.celdasLlenas).toEqual([]);
  });

  test("sin sesión: 401", async () => {
    const { estado, datos } = await entorno.cliente().get("/api/panal");
    expect(estado).toBe(401);
    expect(datos.error.codigo).toBe("sin_sesion");
  });
});

describe("toda ruta protegida responde 401 sin sesión, con la forma de error", () => {
  const id = "6f1c2a8e-3b4d-4e5f-8a9b-0c1d2e3f4a5b";
  const rutas = [
    ["GET", "/api/yo"],
    ["PATCH", "/api/yo"],
    ["POST", "/api/yo/primer-vuelo"],
    ["GET", "/api/yo/progreso"],
    ["GET", "/api/panal"],
    ["GET", "/api/actividades"],
    ["PUT", `/api/actividades/${id}`],
    ["PATCH", `/api/actividades/${id}`],
    ["PUT", `/api/celdas/${id}`],
    ["DELETE", `/api/celdas/${id}`],
    ["GET", "/api/colmenas"],
    ["POST", "/api/colmenas"],
    ["GET", `/api/colmenas/${id}`],
    ["PATCH", `/api/colmenas/${id}`],
    ["GET", `/api/colmenas/${id}/invitacion`],
    ["POST", `/api/colmenas/${id}/invitacion`],
    ["POST", "/api/invitaciones/abc/aceptar"],
    ["DELETE", `/api/colmenas/${id}/integrantes/${id}`],
    ["GET", "/api/reportes"],
  ];
  test.each(rutas)("%s %s", async (metodo, ruta) => {
    const respuesta = await entorno.app.request(ruta, {
      method: metodo,
      headers: { "content-type": "application/json" },
      body: metodo === "GET" || metodo === "DELETE" ? undefined : "{}",
    });
    expect(respuesta.status).toBe(401);
    expect(await respuesta.json()).toEqual({
      error: { codigo: "sin_sesion", mensaje: expect.any(String) },
    });
  });
});
