import { describe, expect, test } from "vite-plus/test";
import { permisosSobreActividad, permisosSobreColmena } from "../src/index.js";

const HOY = "2026-11-24";
const ANA = "ana";
const LUIS = "luis";
const SOFIA = "sofia";

const unica = (cambios = {}) => ({
  tipo: "unica",
  creadaPor: ANA,
  asignadaA: null,
  primeraLlenaEl: null,
  ...cambios,
});
const enColmena = { fundadoraId: SOFIA, archivada: false };

describe("permisos sobre una actividad", () => {
  test("una personal solo la toca quien la creó, y cambia de tipo mientras no tenga días llenos", () => {
    expect(permisosSobreActividad(unica(), { personaId: ANA, hoy: HOY, colmena: null })).toEqual({
      editar: true,
      archivar: true,
      cambiarDeTipo: true,
    });
    const recurrente = unica({ tipo: "recurrente", primeraLlenaEl: "2026-11-20" });
    expect(
      permisosSobreActividad(recurrente, { personaId: ANA, hoy: HOY, colmena: null }).cambiarDeTipo,
    ).toBe(false);
    expect(
      permisosSobreActividad(unica(), { personaId: LUIS, hoy: HOY, colmena: null }).editar,
    ).toBe(false);
  });

  test("en una colmena la cambian quien la creó, a quien está asignada y la fundadora", () => {
    const celda = unica({ asignadaA: LUIS });
    const puede = (personaId) =>
      permisosSobreActividad(celda, { personaId, hoy: HOY, colmena: enColmena }).editar;
    expect([ANA, LUIS, SOFIA, "diego"].map(puede)).toEqual([true, true, true, false]);
  });

  test("una celda de colmena llena solo la archiva la fundadora", () => {
    const llena = unica({ primeraLlenaEl: HOY });
    const archiva = (personaId) =>
      permisosSobreActividad(llena, { personaId, hoy: HOY, colmena: enColmena }).archivar;
    expect([ANA, SOFIA].map(archiva)).toEqual([false, true]);
  });

  test("una única terminada antes de hoy y una colmena archivada no se tocan", () => {
    const terminada = unica({ primeraLlenaEl: "2026-11-23" });
    expect(
      permisosSobreActividad(terminada, { personaId: ANA, hoy: HOY, colmena: null }).editar,
    ).toBe(false);
    const archivada = { fundadoraId: SOFIA, archivada: true };
    expect(
      permisosSobreActividad(unica(), { personaId: SOFIA, hoy: HOY, colmena: archivada }).editar,
    ).toBe(false);
  });
});

describe("permisos sobre una colmena", () => {
  test("la fundadora administra; quien no lo es solo sale", () => {
    const colmena = { fundadoraId: SOFIA, archivada: false };
    expect(permisosSobreColmena(colmena, { personaId: SOFIA, abejas: 3 })).toEqual({
      editar: true,
      archivar: true,
      recuperar: false,
      quitar: true,
      traspasar: true,
      salir: false,
    });
    expect(permisosSobreColmena(colmena, { personaId: ANA, abejas: 3 })).toEqual({
      editar: false,
      archivar: false,
      recuperar: false,
      quitar: false,
      traspasar: false,
      salir: true,
    });
  });

  test("archivada, la fundadora solo la recupera; sin enjambre, puede salir", () => {
    const archivada = { fundadoraId: SOFIA, archivada: true };
    expect(permisosSobreColmena(archivada, { personaId: SOFIA, abejas: 2 })).toMatchObject({
      editar: false,
      recuperar: true,
      traspasar: false,
    });
    const sola = { fundadoraId: SOFIA, archivada: false };
    expect(permisosSobreColmena(sola, { personaId: SOFIA, abejas: 1 }).salir).toBe(true);
  });
});
