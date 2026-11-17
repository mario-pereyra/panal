import { afterAll, beforeAll, beforeEach, describe, expect, test } from "vite-plus/test";
import { hashDeSesion } from "../src/seguridad/sesion.js";
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

describe("registro", () => {
  test("crea la cuenta, responde el perfil y deja una cookie segura", async () => {
    const { estado, datos, respuesta } = await entorno.cliente().post("/api/cuenta", {
      nombre: " Ana ",
      correo: " Ana.Registro@Panal.Test ",
      clave: "panal1234",
    });
    expect(estado).toBe(201);
    expect(datos).toMatchObject({
      nombre: "Ana",
      correo: "ana.registro@panal.test",
      metaDiaria: 5,
      metaSiguiente: null,
      zonaHoraria: "America/La_Paz",
      diaSinFlores: null,
      invernada: null,
      primerVueloEn: null,
      creadaEl: "2026-11-17",
    });
    expect(datos).not.toHaveProperty("claveHash");

    const cookie = respuesta.headers.get("set-cookie");
    expect(cookie).toMatch(/^panal_sesion=[\w-]{40,};/);
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Path=/");
    expect(cookie).toContain(`Max-Age=${30 * 24 * 60 * 60}`);
    expect(cookie).not.toContain("Secure");
  });

  test("toma la zona horaria del dispositivo, si llega", async () => {
    const { estado, datos } = await entorno.cliente().post("/api/cuenta", {
      nombre: "Kenji",
      correo: "kenji.zona@panal.test",
      clave: "panal1234",
      zonaHoraria: "Asia/Tokyo",
    });
    expect(estado).toBe(201);
    expect(datos.zonaHoraria).toBe("Asia/Tokyo");
  });

  test("guarda la clave con scrypt y solo el hash de la sesión", async () => {
    const { respuesta } = await entorno.cliente().post("/api/cuenta", {
      nombre: "Hash",
      correo: "hash@panal.test",
      clave: "panal1234",
    });
    const identificador = entorno.cookieDe(respuesta).split("=")[1];
    const [persona] = await entorno.base.consulta(
      "select clave_hash from personas where correo = $1",
      ["hash@panal.test"],
    );
    expect(persona.clave_hash).toMatch(/^scrypt\$16384\$8\$1\$/);
    expect(persona.clave_hash).not.toContain("panal1234");
    const sesiones = await entorno.base.consulta(
      "select id_hash from sesiones where id_hash = $1",
      [hashDeSesion(identificador)],
    );
    expect(sesiones).toHaveLength(1);
    const enClaro = await entorno.base.consulta("select 1 from sesiones where id_hash = $1", [
      identificador,
    ]);
    expect(enClaro).toHaveLength(0);
  });

  test("datos inválidos: responde 400 con el mensaje de cada campo", async () => {
    const { estado, datos } = await entorno.cliente().post("/api/cuenta", {
      nombre: "",
      correo: "no-es-correo",
      clave: "corta",
    });
    expect(estado).toBe(400);
    expect(datos.error).toMatchObject({ codigo: "datos_invalidos", mensaje: expect.any(String) });
    expect(Object.keys(datos.error.campos)).toEqual(["nombre", "correo", "clave"]);
  });

  test("un cuerpo que no es JSON también es un 400", async () => {
    const { estado, datos } = await entorno.cliente().post("/api/cuenta", "{esto no es json");
    expect(estado).toBe(400);
    expect(datos.error.codigo).toBe("datos_invalidos");
  });

  test("un correo ya registrado responde 409", async () => {
    const abeja = await entorno.nuevaAbeja();
    const { estado, datos } = await entorno.cliente().post("/api/cuenta", {
      nombre: "Otra",
      correo: abeja.correo.toUpperCase(),
      clave: "panal1234",
    });
    expect(estado).toBe(409);
    expect(datos.error.codigo).toBe("correo_en_uso");
  });
});

describe("entrar y salir", () => {
  test("con la clave correcta deja la sesión; con otra, 401", async () => {
    const abeja = await entorno.nuevaAbeja({ nombre: "Entra" });
    const bien = await entorno
      .cliente()
      .post("/api/sesion", { correo: abeja.correo, clave: "panal1234" });
    expect(bien.estado).toBe(200);
    expect(bien.datos.correo).toBe(abeja.correo);
    const sesion = entorno.cliente(entorno.cookieDe(bien.respuesta));
    expect((await sesion.get("/api/yo")).estado).toBe(200);

    const mal = await entorno
      .cliente()
      .post("/api/sesion", { correo: abeja.correo, clave: "otraclave" });
    expect(mal.estado).toBe(401);
    expect(mal.datos.error.codigo).toBe("credenciales_incorrectas");
    expect(entorno.cookieDe(mal.respuesta)).toBeUndefined();

    const nadie = await entorno.cliente().post("/api/sesion", {
      correo: "nadie@panal.test",
      clave: "panal1234",
    });
    expect(nadie.estado).toBe(401);
  });

  test("datos inválidos al entrar: 400", async () => {
    const { estado, datos } = await entorno.cliente().post("/api/sesion", { correo: "x" });
    expect(estado).toBe(400);
    expect(Object.keys(datos.error.campos)).toEqual(["correo", "clave"]);
  });

  test("salir borra la sesión: la cookie vieja ya no sirve", async () => {
    const abeja = await entorno.nuevaAbeja();
    const { estado, respuesta } = await abeja.delete("/api/sesion");
    expect(estado).toBe(204);
    expect(respuesta.headers.get("set-cookie")).toMatch(/panal_sesion=;.*Max-Age=0/);
    const despues = await abeja.get("/api/yo");
    expect(despues.estado).toBe(401);
    expect(despues.datos).toEqual({
      error: { codigo: "sin_sesion", mensaje: "Tu sesión terminó. Vuelve a entrar al panal." },
    });
  });

  test("cinco fallos en diez minutos bloquean ese correo, con el tiempo de espera", async () => {
    const abeja = await entorno.nuevaAbeja({ nombre: "Olvidadiza" });
    const fallar = () =>
      entorno.cliente().post("/api/sesion", { correo: abeja.correo, clave: "malamala" });
    for (let intento = 0; intento < 5; intento += 1) {
      expect((await fallar()).estado).toBe(401);
      entorno.avanzar(60 * 1000);
    }
    const bloqueada = await entorno
      .cliente()
      .post("/api/sesion", { correo: abeja.correo, clave: "panal1234" });
    expect(bloqueada.estado).toBe(429);
    expect(bloqueada.datos.error).toMatchObject({
      codigo: "demasiados_intentos",
      reintentarEn: 300,
    });
    expect(bloqueada.respuesta.headers.get("retry-after")).toBe("300");

    // Otro correo no está bloqueado.
    const otra = await entorno.nuevaAbeja();
    const libre = await entorno
      .cliente()
      .post("/api/sesion", { correo: otra.correo, clave: "panal1234" });
    expect(libre.estado).toBe(200);

    // Cuando caduca el fallo más viejo, vuelve a haber un intento.
    entorno.avanzar(5 * 60 * 1000);
    const deNuevo = await entorno
      .cliente()
      .post("/api/sesion", { correo: abeja.correo, clave: "panal1234" });
    expect(deNuevo.estado).toBe(200);
  });
});

describe("la sesión", () => {
  test("se renueva con el uso y vence tras 30 días sin usarla", async () => {
    const abeja = await entorno.nuevaAbeja();
    const mismoDia = await abeja.get("/api/yo");
    expect(mismoDia.respuesta.headers.get("set-cookie")).toBeNull();

    entorno.avanzar(2 * DIA_MS);
    const renovada = await abeja.get("/api/yo");
    expect(renovada.estado).toBe(200);
    expect(renovada.respuesta.headers.get("set-cookie")).toContain(abeja.cookie);

    entorno.avanzar(29 * DIA_MS);
    expect((await abeja.get("/api/yo")).estado).toBe(200);

    entorno.avanzar(31 * DIA_MS);
    expect((await abeja.get("/api/yo")).estado).toBe(401);
  });

  test("una cookie inventada no abre ninguna sesión", async () => {
    const { estado } = await entorno.cliente("panal_sesion=inventada").get("/api/yo");
    expect(estado).toBe(401);
  });

  test("las respuestas llevan las cabeceras de seguridad", async () => {
    const { respuesta } = await entorno.cliente().get("/api/yo");
    expect(respuesta.headers.get("x-content-type-options")).toBe("nosniff");
    expect(respuesta.headers.get("x-frame-options")).toBe("SAMEORIGIN");
  });

  test("una dirección desconocida responde 404 con la forma de error", async () => {
    const { estado, datos } = await entorno.cliente().get("/api/no-existe");
    expect(estado).toBe(404);
    expect(datos.error.codigo).toBe("no_existe");
  });
});

describe("perfil", () => {
  test("cambia nombre, zona, día sin flores e invernada", async () => {
    const abeja = await entorno.nuevaAbeja();
    const { estado, datos } = await abeja.patch("/api/yo", {
      nombre: "Nuevo nombre",
      zonaHoraria: "America/Bogota",
      diaSinFlores: 6,
      invernada: { desde: "2026-12-20", hasta: "2026-12-31" },
    });
    expect(estado).toBe(200);
    expect(datos).toMatchObject({
      nombre: "Nuevo nombre",
      zonaHoraria: "America/Bogota",
      diaSinFlores: 6,
      invernada: { desde: "2026-12-20", hasta: "2026-12-31" },
    });
  });

  test("la meta cambia al instante durante el primer vuelo y desde mañana después", async () => {
    const abeja = await entorno.nuevaAbeja({ primerVuelo: false });
    expect((await abeja.patch("/api/yo", { metaDiaria: 7 })).datos).toMatchObject({
      metaDiaria: 7,
      metaSiguiente: null,
    });

    const vuelo = await abeja.post("/api/yo/primer-vuelo", { metaDiaria: 5 });
    expect(vuelo.estado).toBe(200);
    expect(vuelo.datos).toMatchObject({ metaDiaria: 5, primerVueloEn: expect.any(String) });

    const cambio = await abeja.patch("/api/yo", { metaDiaria: 3 });
    expect(cambio.datos).toMatchObject({ metaDiaria: 5, metaSiguiente: 3 });

    entorno.avanzar(DIA_MS);
    expect((await abeja.get("/api/yo")).datos).toMatchObject({
      metaDiaria: 3,
      metaSiguiente: null,
    });

    // Volver a la meta vigente anula un cambio pendiente.
    await abeja.patch("/api/yo", { metaDiaria: 7 });
    const anulado = await abeja.patch("/api/yo", { metaDiaria: 3 });
    expect(anulado.datos).toMatchObject({ metaDiaria: 3, metaSiguiente: null });
  });

  test("bajar la meta no cierra los panales de días anteriores", async () => {
    const abeja = await entorno.nuevaAbeja({ primerVuelo: false });
    await abeja.post("/api/yo/primer-vuelo", { metaDiaria: 5 });
    const ids = [];
    for (const titulo of ["Uno", "Dos", "Tres", "Cuatro", "Cinco"])
      ids.push(
        await crearActividad(abeja, { titulo, tipo: "recurrente", regla: { clase: "diaria" } }),
      );
    // Martes: tres de cinco, el panal queda abierto. Y la meta baja a 3 desde mañana.
    for (const actividadId of ids.slice(0, 3))
      await abeja.put(`/api/celdas/${nuevoId()}`, { actividadId });
    await abeja.patch("/api/yo", { metaDiaria: 3 });

    entorno.avanzar(DIA_MS);
    const panal = (await abeja.get("/api/panal")).datos;
    expect(panal.tramosDeAjustes).toEqual([
      { desde: "2026-11-17", metaDiaria: 5, diaSinFlores: null },
      { desde: "2026-11-18", metaDiaria: 3, diaSinFlores: null },
    ]);
    // Con la meta nueva el martes habría cerrado: 20 gotas de cierre que no corresponden.
    const progreso = (await abeja.get("/api/yo/progreso")).datos;
    expect(progreso.gotas.desglose.cierres).toBe(0);
  });

  test("un día sin flores nuevo rige desde hoy y no toca los días anteriores", async () => {
    const abeja = await entorno.nuevaAbeja();
    entorno.avanzar(DIA_MS);
    // Miércoles: el martes pasa a ser día sin flores desde hoy, no hacia atrás.
    await abeja.patch("/api/yo", { diaSinFlores: 1 });
    const { tramosDeAjustes } = (await abeja.get("/api/panal")).datos;
    expect(tramosDeAjustes).toEqual([
      { desde: "2026-11-17", metaDiaria: 3, diaSinFlores: null },
      { desde: "2026-11-18", metaDiaria: 3, diaSinFlores: 1 },
    ]);
  });

  test("terminar el primer vuelo dos veces conserva la primera fecha", async () => {
    const abeja = await entorno.nuevaAbeja({ primerVuelo: false });
    const primera = (await abeja.post("/api/yo/primer-vuelo", { metaDiaria: 3 })).datos
      .primerVueloEn;
    entorno.avanzar(60 * 1000);
    const segunda = (await abeja.post("/api/yo/primer-vuelo", { metaDiaria: 7 })).datos;
    expect(segunda).toMatchObject({ primerVueloEn: primera, metaDiaria: 7 });
  });

  test("una invernada no puede empezar en el pasado; quitarla conserva los días ya pasados", async () => {
    const abeja = await entorno.nuevaAbeja();
    const pasada = await abeja.patch("/api/yo", {
      invernada: { desde: "2026-11-10", hasta: "2026-11-20" },
    });
    expect(pasada.estado).toBe(400);
    expect(pasada.datos.error.campos).toHaveProperty("invernada");

    await abeja.patch("/api/yo", { invernada: { desde: "2026-11-17", hasta: "2026-11-28" } });
    entorno.avanzar(3 * DIA_MS);
    // La que está en curso se puede alargar aunque ya haya empezado.
    const alargada = await abeja.patch("/api/yo", {
      invernada: { desde: "2026-11-17", hasta: "2026-11-30" },
    });
    expect(alargada.estado).toBe(200);
    const quitada = await abeja.patch("/api/yo", { invernada: null });
    expect(quitada.datos.invernada).toEqual({ desde: "2026-11-17", hasta: "2026-11-19" });
  });

  test("datos inválidos y sin sesión", async () => {
    const abeja = await entorno.nuevaAbeja();
    const invalidos = await abeja.patch("/api/yo", { metaDiaria: 4, zonaHoraria: "Marte/Olimpo" });
    expect(invalidos.estado).toBe(400);
    expect(Object.keys(invalidos.datos.error.campos).sort()).toEqual(["metaDiaria", "zonaHoraria"]);
    expect((await abeja.post("/api/yo/primer-vuelo", { metaDiaria: 4 })).estado).toBe(400);

    const anonima = entorno.cliente();
    expect((await anonima.patch("/api/yo", { nombre: "X" })).estado).toBe(401);
    expect((await anonima.post("/api/yo/primer-vuelo", { metaDiaria: 3 })).estado).toBe(401);
    expect((await anonima.get("/api/yo/progreso")).estado).toBe(401);
  });

  test("Mi vuelo: oficio, gotas, racha y los diecisiete sellos", async () => {
    const abeja = await entorno.nuevaAbeja();
    const { estado, datos } = await abeja.get("/api/yo/progreso");
    expect(estado).toBe(200);
    expect(datos).toMatchObject({
      oficio: { nivel: 1, nombre: "Novata", gotas: 0, siguiente: "Nodriza", faltan: 100 },
      gotas: { total: 0, desglose: { celdas: 0, cierres: 0, hitos: 0, cuotas: 0, colmenas: 0 } },
      racha: { actual: 0, mejor: 0, reservas: 1 },
    });
    expect(datos.sellos).toHaveLength(17);
    expect(datos.sellos[0]).toMatchObject({ id: "primera-celda", ganado: false, actual: 0 });
  });
});
