import { sumarDias } from "@panal/motor";
import { afterAll, beforeAll, describe, expect, test } from "vite-plus/test";
import { CORREOS_DE_DEMOSTRACION, sembrar } from "../src/datos/semilla.js";
import { crearEntorno, DIA_MS, MARTES } from "./ayudantes.js";

/** @type {Awaited<ReturnType<typeof crearEntorno>>} */
let entorno;
beforeAll(async () => {
  entorno = await crearEntorno();
});
afterAll(() => entorno.cerrar());

/** Entra como una de las abejas de la demostración. */
async function entrar(correo) {
  const { estado, respuesta } = await entorno
    .cliente()
    .post("/api/sesion", { correo, clave: "panal1234" });
  expect(estado).toBe(200);
  return entorno.cliente(entorno.cookieDe(respuesta));
}

const contar = async (tabla) =>
  (await entorno.base.consulta(`select count(*)::int as n from ${tabla}`))[0].n;

describe("semilla de demostración", () => {
  test("Ana: seis semanas de historial, racha, nivel 5, dos reservas y tres celdas hoy", async () => {
    entorno.reloj.ahora = MARTES;
    const { sembrada } = await sembrar(entorno.base, { reloj: () => entorno.reloj.ahora });
    expect(sembrada).toBe(true);

    for (const correo of Object.values(CORREOS_DE_DEMOSTRACION)) await entrar(correo);
    const ana = await entrar(CORREOS_DE_DEMOSTRACION.ana);

    const progreso = (await ana.get("/api/yo/progreso")).datos;
    expect(progreso.racha.actual).toBeGreaterThanOrEqual(12);
    expect(progreso.racha.actual).toBeLessThanOrEqual(14);
    expect(progreso.racha.reservas).toBe(2);
    expect(progreso.oficio).toMatchObject({ nivel: 5, nombre: "Recolectora" });
    expect(progreso.gotas.total).toBeGreaterThanOrEqual(700);
    expect(progreso.gotas.total).toBeLessThan(1000);

    const panal = (await ana.get("/api/panal")).datos;
    const { hoy } = panal;
    expect(panal.persona).toMatchObject({
      nombre: "Ana",
      metaDiaria: 5,
      creadaEl: sumarDias(hoy, -41),
    });
    expect(panal.celdasLlenas.filter((celda) => celda.dia === hoy)).toHaveLength(3);

    const porTitulo = Object.fromEntries(panal.actividades.map((a) => [a.titulo, a]));
    expect(porTitulo["Repasar apuntes de Redux"].regla).toEqual({ clase: "diaria" });
    expect(porTitulo["Caminar 30 minutos"].regla).toEqual({ clase: "diaria" });
    expect(porTitulo["Practicar inglés 15 minutos"].regla).toEqual({
      clase: "dias",
      dias: [0, 2, 4],
    });
    expect(porTitulo["Leer 20 páginas"].regla).toEqual({ clase: "veces", veces: 3 });
    expect(porTitulo["Pagar el internet"].regla).toEqual({ clase: "mes", dia: 10 });
    expect(porTitulo["Entregar informe de avance"]).toMatchObject({ tipo: "unica", vence: hoy });
    expect(porTitulo["Diseñar pantalla de reportes"]).toMatchObject({
      tipo: "unica",
      asignadaA: panal.persona.id,
      colmena: { nombre: "Proyecto final" },
    });
    const archivadas = (await ana.get("/api/actividades?ver=archivadas")).datos.actividades;
    expect(archivadas.filter((actividad) => !actividad.colmena)).toEqual([
      expect.objectContaining({ tipo: "unica", archivadaEl: expect.any(String) }),
    ]);
    // Las del viaje, archivado, también se ven ahí.
    expect(archivadas.filter((actividad) => actividad.colmena?.archivada)).toHaveLength(6);

    // El historial empieza unas seis semanas atrás.
    const [{ primera }] = await entorno.base.consulta(
      `select min(cl.dia) as primera from celdas_llenas cl join personas p on p.id = cl.persona_id
       where p.correo = $1`,
      [CORREOS_DE_DEMOSTRACION.ana],
    );
    expect(primera).toBe(sumarDias(hoy, -40));
  });

  test("Proyecto final al 60 % entre cuatro abejas y Feria de ciencias cerrada", async () => {
    const ana = await entrar(CORREOS_DE_DEMOSTRACION.ana);
    const { colmenas } = (await ana.get("/api/colmenas")).datos;
    const proyecto = colmenas.find((colmena) => colmena.nombre === "Proyecto final");
    const feria = colmenas.find((colmena) => colmena.nombre === "Feria de ciencias");

    expect(proyecto.avance).toMatchObject({
      total: 30,
      llenas: 18,
      porcentaje: 60,
      cuadro: 3,
      cerrada: false,
    });
    expect(proyecto.integrantes.map((i) => i.nombre)).toEqual(["Sofía", "Ana", "Luis", "Diego"]);
    expect(proyecto.integrantes.map((i) => i.color)).toEqual([0, 1, 2, 3]);
    expect(proyecto.entregaEl).toBe(sumarDias("2026-11-17", 9));
    expect(proyecto.fundadoraId).toBe(proyecto.integrantes[0].id);

    const detalle = (await ana.get(`/api/colmenas/${proyecto.id}`)).datos;
    expect(detalle.enjambre.every((abeja) => abeja.aportes > 0)).toBe(true);
    expect(detalle.actividades.filter((a) => a.asignadaA).length).toBeGreaterThan(10);
    const reportes = detalle.actividades.find((a) => a.titulo === "Diseñar pantalla de reportes");
    expect(reportes).toMatchObject({ llenaPor: null, asignadaA: detalle.enjambre[1].id });

    expect(feria.avance).toMatchObject({ porcentaje: 100, cerrada: true });
    expect(feria.cerradaEn).not.toBeNull();

    // Las de Ana: una para quitar abejas y pasar la fundación, otra para recuperar.
    const yo = (await ana.get("/api/yo")).datos;
    const club = colmenas.find((colmena) => colmena.nombre === "Club de lectura");
    expect(club).toMatchObject({ fundadoraId: yo.id, archivadaEn: null });
    expect(club.integrantes).toHaveLength(4);
    const viaje = colmenas.find((colmena) => colmena.nombre === "Viaje de promoción");
    expect(viaje).toMatchObject({ fundadoraId: yo.id, archivadaEn: expect.any(String) });
    expect(viaje.avance.cerrada).toBe(false);

    // "Hoy" muestra el proyecto, que tiene la celda más reciente.
    expect((await ana.get("/api/panal")).datos.colmena.nombre).toBe("Proyecto final");
    // El enlace de invitación está listo para mostrarse.
    expect(
      (await ana.get(`/api/colmenas/${proyecto.id}/invitacion`)).datos.invitacion,
    ).not.toBeNull();
  });

  test("es idempotente; con --reiniciar vuelve a crearla sin tocar otras cuentas", async () => {
    const tablas = ["personas", "actividades", "celdas_llenas", "colmenas", "integrantes"];
    const antes = await Promise.all(tablas.map(contar));
    expect((await sembrar(entorno.base, { reloj: () => entorno.reloj.ahora })).sembrada).toBe(
      false,
    );
    expect(await Promise.all(tablas.map(contar))).toEqual(antes);

    const ajena = await entorno.nuevaAbeja({ nombre: "Ajena" });
    const [anaAntes] = await entorno.base.consulta("select id from personas where correo = $1", [
      CORREOS_DE_DEMOSTRACION.ana,
    ]);
    await sembrar(entorno.base, { reloj: () => entorno.reloj.ahora, reiniciar: true });
    const [anaDespues] = await entorno.base.consulta("select id from personas where correo = $1", [
      CORREOS_DE_DEMOSTRACION.ana,
    ]);
    expect(anaDespues.id).not.toBe(anaAntes.id);
    expect((await ajena.get("/api/yo")).estado).toBe(200);
    expect(await contar("personas")).toBe(antes[0] + 1);
  });

  test("se ve igual cualquier día de la semana y del mes", { timeout: 60_000 }, async () => {
    for (let dias = 1; dias <= 8; dias += 1) {
      // Cada día a otra hora, también de madrugada.
      entorno.reloj.ahora = MARTES + dias * (DIA_MS + 5 * 60 * 60 * 1000);
      await sembrar(entorno.base, { reloj: () => entorno.reloj.ahora, reiniciar: true });
      const ana = await entrar(CORREOS_DE_DEMOSTRACION.ana);
      const { racha, oficio } = (await ana.get("/api/yo/progreso")).datos;
      const panal = (await ana.get("/api/panal")).datos;
      expect({ racha: racha.actual, reservas: racha.reservas, nivel: oficio.nivel }).toEqual({
        racha: 14,
        reservas: 2,
        nivel: 5,
      });
      expect(panal.celdasLlenas.filter((celda) => celda.dia === panal.hoy)).toHaveLength(3);
      // Hoy no está cerrado: quedan celdas para la demostración.
      const programadas = panal.actividades.length;
      expect(programadas).toBeGreaterThan(3);
    }
  });
});
