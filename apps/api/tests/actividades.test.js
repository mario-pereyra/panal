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

/** Una colmena con su fundadora y otra integrante. */
async function colmenaConDos() {
  const fundadora = await entorno.nuevaAbeja({ nombre: "Fundadora" });
  const otra = await entorno.nuevaAbeja({ nombre: "Otra" });
  const { datos } = await fundadora.post("/api/colmenas", { nombre: "Equipo" });
  const colmenaId = datos.colmena.id;
  const { datos: invitacion } = await fundadora.post(`/api/colmenas/${colmenaId}/invitacion`);
  await otra.post(`/api/invitaciones/${invitacion.invitacion.codigo}/aceptar`);
  return { fundadora, otra, colmenaId };
}

describe("crear y reemplazar con PUT", () => {
  test("crea con 201 y responde la actividad completa", async () => {
    const abeja = await entorno.nuevaAbeja();
    const id = nuevoId();
    const ahora = entorno.reloj.ahora;
    const { estado, datos } = await abeja.put(`/api/actividades/${id}`, {
      titulo: " Leer 20 páginas ",
      tipo: "recurrente",
      regla: { clase: "dias", dias: [4, 0, 2, 2] },
    });
    expect(estado).toBe(201);
    expect(datos.actividad).toEqual({
      id,
      titulo: "Leer 20 páginas",
      tipo: "recurrente",
      prioridad: "normal",
      regla: { clase: "dias", dias: [0, 2, 4] },
      vence: null,
      colmenaId: null,
      colmena: null,
      asignadaA: null,
      creadaPor: abeja.perfil.id,
      creadaEl: "2026-11-17",
      creadaEn: new Date(ahora).toISOString(),
      archivadaEl: null,
    });
  });

  test("repetir el mismo envío no duplica nada y reemplazar responde 200", async () => {
    const abeja = await entorno.nuevaAbeja();
    const id = nuevoId();
    const ahora = entorno.reloj.ahora;
    const cuerpo = {
      titulo: "Pagar el internet",
      tipo: "recurrente",
      regla: { clase: "mes", dia: 10 },
    };
    expect((await abeja.put(`/api/actividades/${id}`, cuerpo)).estado).toBe(201);
    entorno.avanzar(60 * 1000);
    const repetido = await abeja.put(`/api/actividades/${id}`, cuerpo);
    expect(repetido.estado).toBe(200);
    // El instante de creación es el del primer envío.
    expect(repetido.datos.actividad.creadaEn).toBe(new Date(ahora).toISOString());

    const reemplazo = await abeja.put(`/api/actividades/${id}`, {
      titulo: "Pagar la luz",
      tipo: "unica",
    });
    expect(reemplazo.datos.actividad).toMatchObject({
      titulo: "Pagar la luz",
      tipo: "unica",
      regla: null,
    });
    const filas = await entorno.base.consulta(
      "select count(*)::int as n from actividades where id = $1",
      [id],
    );
    expect(filas[0].n).toBe(1);
    const reglas = await entorno.base.consulta(
      "select count(*)::int as n from repeticiones where actividad_id = $1",
      [id],
    );
    expect(reglas[0].n).toBe(0);
  });

  test("datos inválidos: 400 con el campo que falla", async () => {
    const abeja = await entorno.nuevaAbeja();
    const sinRegla = await abeja.put(`/api/actividades/${nuevoId()}`, {
      titulo: "Correr",
      tipo: "recurrente",
    });
    expect(sinRegla.estado).toBe(400);
    expect(sinRegla.datos.error.campos).toHaveProperty("regla");
    const idMalo = await abeja.put("/api/actividades/no-es-un-id", {
      titulo: "Correr",
      tipo: "unica",
    });
    expect(idMalo.estado).toBe(400);
    expect(idMalo.datos.error.campos).toHaveProperty("id");
    const conFecha = await abeja.put(`/api/actividades/${nuevoId()}`, {
      titulo: "Correr",
      tipo: "recurrente",
      regla: { clase: "veces", veces: 9 },
    });
    expect(conFecha.estado).toBe(400);
  });

  test("sin sesión: 401", async () => {
    const { estado, datos } = await entorno
      .cliente()
      .put(`/api/actividades/${nuevoId()}`, { titulo: "Leer", tipo: "unica" });
    expect(estado).toBe(401);
    expect(datos.error.codigo).toBe("sin_sesion");
  });

  test("sin permiso: no se reemplaza la actividad personal de otra persona", async () => {
    const duena = await entorno.nuevaAbeja();
    const intrusa = await entorno.nuevaAbeja();
    const id = await crearActividad(duena, { titulo: "Mía" });
    const { estado, datos } = await intrusa.put(`/api/actividades/${id}`, {
      titulo: "Ahora mía",
      tipo: "unica",
    });
    expect(estado).toBe(403);
    expect(datos.error.codigo).toBe("sin_permiso");
  });

  test("una celda con días llenos no cambia de tipo", async () => {
    const abeja = await entorno.nuevaAbeja();
    const id = await crearActividad(abeja, {
      titulo: "Agua",
      tipo: "recurrente",
      regla: { clase: "diaria" },
    });
    await abeja.put(`/api/celdas/${nuevoId()}`, { actividadId: id });
    const { estado, datos } = await abeja.put(`/api/actividades/${id}`, {
      titulo: "Agua",
      tipo: "unica",
    });
    expect(estado).toBe(400);
    expect(datos.error.campos).toHaveProperty("tipo");
  });
});

describe("actividades de colmena", () => {
  test("cualquier integrante crea y asigna; quien no está, no", async () => {
    const { fundadora, otra, colmenaId } = await colmenaConDos();
    const id = nuevoId();
    const creada = await otra.put(`/api/actividades/${id}`, {
      titulo: "Diseñar la portada",
      tipo: "unica",
      colmenaId,
      asignadaA: fundadora.perfil.id,
    });
    expect(creada.estado).toBe(201);
    expect(creada.datos.actividad).toMatchObject({
      colmenaId,
      colmena: { id: colmenaId, nombre: "Equipo" },
      asignadaA: fundadora.perfil.id,
      creadaPor: otra.perfil.id,
    });

    const ajena = await entorno.nuevaAbeja();
    const intento = await ajena.put(`/api/actividades/${nuevoId()}`, {
      titulo: "X",
      tipo: "unica",
      colmenaId,
    });
    expect(intento.estado).toBe(403);
    const editar = await ajena.patch(`/api/actividades/${id}`, { titulo: "Mía" });
    expect(editar.estado).toBe(403);
  });

  test("solo se asigna a quien está en la colmena, y la colmena tiene que existir", async () => {
    const { fundadora, colmenaId } = await colmenaConDos();
    const ajena = await entorno.nuevaAbeja();
    const fuera = await fundadora.put(`/api/actividades/${nuevoId()}`, {
      titulo: "X",
      tipo: "unica",
      colmenaId,
      asignadaA: ajena.perfil.id,
    });
    expect(fuera.estado).toBe(400);
    expect(fuera.datos.error.campos).toHaveProperty("asignadaA");
    const inexistente = await fundadora.put(`/api/actividades/${nuevoId()}`, {
      titulo: "X",
      tipo: "unica",
      colmenaId: nuevoId(),
    });
    expect(inexistente.estado).toBe(400);
    expect(inexistente.datos.error.campos).toHaveProperty("colmenaId");
  });

  test("una colmena archivada no recibe actividades nuevas", async () => {
    const { fundadora, colmenaId } = await colmenaConDos();
    await fundadora.patch(`/api/colmenas/${colmenaId}`, { archivada: true });
    const { estado, datos } = await fundadora.put(`/api/actividades/${nuevoId()}`, {
      titulo: "X",
      tipo: "unica",
      colmenaId,
    });
    expect(estado).toBe(409);
    expect(datos.error.codigo).toBe("colmena_cerrada");
  });
});

describe("prioridad alta", () => {
  test("como mucho tres únicas de prioridad alta pendientes por persona", async () => {
    const abeja = await entorno.nuevaAbeja();
    const altas = [];
    for (const titulo of ["Una", "Dos", "Tres"]) {
      altas.push(await crearActividad(abeja, { titulo, prioridad: "alta" }));
    }
    const cuarta = await abeja.put(`/api/actividades/${nuevoId()}`, {
      titulo: "Cuatro",
      tipo: "unica",
      prioridad: "alta",
    });
    expect(cuarta.estado).toBe(409);
    expect(cuarta.datos.error.codigo).toBe("prioridad_alta_completa");

    // Editar una que ya contaba no la rechaza.
    expect((await abeja.patch(`/api/actividades/${altas[0]}`, { titulo: "Uno" })).estado).toBe(200);

    // Al cumplir una, se libera un lugar.
    await abeja.put(`/api/celdas/${nuevoId()}`, { actividadId: altas[1] });
    const normal = await crearActividad(abeja, { titulo: "Normal" });
    expect((await abeja.patch(`/api/actividades/${normal}`, { prioridad: "alta" })).estado).toBe(
      200,
    );
    expect((await abeja.patch(`/api/actividades/${altas[1]}`, { titulo: "Dos bis" })).estado).toBe(
      200,
    );

    // Recuperar una archivada también cuenta.
    await abeja.patch(`/api/actividades/${altas[2]}`, { archivada: true });
    await crearActividad(abeja, { titulo: "Otra", prioridad: "alta" });
    const recuperar = await abeja.patch(`/api/actividades/${altas[2]}`, { archivada: false });
    expect(recuperar.estado).toBe(409);
  });
});

describe("editar, archivar y listar", () => {
  test("PATCH edita, pospone, archiva y recupera", async () => {
    const abeja = await entorno.nuevaAbeja();
    const id = await crearActividad(abeja, { titulo: "Informe", vence: "2026-11-18" });

    const pospuesta = await abeja.patch(`/api/actividades/${id}`, {
      vence: "2026-11-25",
      titulo: "Informe final",
    });
    expect(pospuesta.estado).toBe(200);
    expect(pospuesta.datos.actividad).toMatchObject({
      titulo: "Informe final",
      vence: "2026-11-25",
    });

    entorno.avanzar(DIA_MS);
    const archivada = await abeja.patch(`/api/actividades/${id}`, { archivada: true });
    expect(archivada.datos.actividad.archivadaEl).toBe("2026-11-18");
    expect((await abeja.get("/api/actividades")).datos.actividades.map((a) => a.id)).not.toContain(
      id,
    );
    const vistas = await abeja.get("/api/actividades?ver=archivadas");
    expect(vistas.datos).toMatchObject({ hoy: "2026-11-18", actividades: [{ id }] });

    const recuperada = await abeja.patch(`/api/actividades/${id}`, { archivada: false });
    expect(recuperada.datos.actividad.archivadaEl).toBeNull();
  });

  test("el cambio completo tiene que seguir siendo válido", async () => {
    const abeja = await entorno.nuevaAbeja();
    const id = await crearActividad(abeja, { titulo: "Única" });
    const { estado, datos } = await abeja.patch(`/api/actividades/${id}`, {
      regla: { clase: "diaria" },
    });
    expect(estado).toBe(400);
    expect(datos.error.campos).toHaveProperty("regla");
    expect((await abeja.patch(`/api/actividades/${id}`, { titulo: "" })).estado).toBe(400);
  });

  test("PATCH de algo que no existe: 404; sin sesión: 401", async () => {
    const abeja = await entorno.nuevaAbeja();
    expect((await abeja.patch(`/api/actividades/${nuevoId()}`, { titulo: "X" })).estado).toBe(404);
    expect((await abeja.patch("/api/actividades/otra-cosa", { titulo: "X" })).estado).toBe(404);
    expect(
      (await entorno.cliente().patch(`/api/actividades/${nuevoId()}`, { titulo: "X" })).estado,
    ).toBe(401);
  });

  test("la lista activa no incluye únicas cumplidas antes de hoy ni lo ajeno", async () => {
    const abeja = await entorno.nuevaAbeja();
    const otra = await entorno.nuevaAbeja();
    await crearActividad(otra, { titulo: "De otra" });
    const cumplida = await crearActividad(abeja, { titulo: "Cumplida ayer" });
    const ronda = await crearActividad(abeja, {
      titulo: "Ronda",
      tipo: "recurrente",
      regla: { clase: "diaria" },
    });
    await abeja.put(`/api/celdas/${nuevoId()}`, { actividadId: cumplida });

    const hoy = await abeja.get("/api/actividades?ver=activas");
    expect(hoy.datos.actividades.map((a) => a.titulo).sort()).toEqual(["Cumplida ayer", "Ronda"]);
    entorno.avanzar(DIA_MS);
    const manana = await abeja.get("/api/actividades");
    expect(manana.datos.actividades.map((a) => a.id)).toEqual([ronda]);
  });

  test("una vista desconocida es un 400; sin sesión, 401", async () => {
    const abeja = await entorno.nuevaAbeja();
    const { estado, datos } = await abeja.get("/api/actividades?ver=todas");
    expect(estado).toBe(400);
    expect(datos.error.campos).toHaveProperty("ver");
    expect((await entorno.cliente().get("/api/actividades")).estado).toBe(401);
  });
});
