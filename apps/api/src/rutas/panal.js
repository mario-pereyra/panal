import { lunesDe, sumarDias } from "@panal/motor";
import { Hono } from "hono";
import { colmenasDePersona } from "../datos/colmenas.js";
import { exigirSesion, personaDe } from "../seguridad/sesion.js";
import { resumenDeColmenaActiva } from "../servicios/colmenas.js";
import { celdaDe, perfilDe } from "../servicios/formatos.js";
import { gotasPorCelda, progresoDePersona } from "../servicios/progreso.js";

/** Semanas de celdas que viajan con el panal: las del panal de constancia. */
const SEMANAS_DE_CONSTANCIA = 5;

/**
 * `GET /api/panal`: todo lo que necesita "Hoy" en una sola llamada.
 * @param {import("../app.js").Contexto} contexto
 */
export function rutasDePanal({ base, reloj }) {
  const rutas = new Hono();

  rutas.get("/panal", exigirSesion, async (c) => {
    const persona = personaDe(c);
    const ahora = reloj();
    const { hechos, progreso } = await progresoDePersona(base, persona, ahora);
    const { hoy } = hechos;

    const enColmenas = await colmenasDePersona(base, persona.id);
    const activas = enColmenas.filter((colmena) => !colmena.archivada_en);
    const idsActivas = new Set(activas.map((colmena) => colmena.id));

    // Las activas de su panal. Una única cumplida antes de hoy ya terminó;
    // si se cumplió hoy, sigue a la vista con su casilla llena.
    const actividades = hechos.actividades
      .filter(({ actividad, delPanal, primeraLlenaEl }) => {
        if (!delPanal || actividad.archivadaEl) return false;
        if (actividad.colmenaId && !idsActivas.has(actividad.colmenaId)) return false;
        return !(actividad.tipo === "unica" && primeraLlenaEl && primeraLlenaEl < hoy);
      })
      .map(({ actividad }) => actividad);

    // Desde el lunes de hace cuatro semanas: lo que dibuja el panal de constancia.
    const desde = sumarDias(lunesDe(hoy), -7 * (SEMANAS_DE_CONSTANCIA - 1));
    const gotas = gotasPorCelda(progreso);
    const celdasLlenas = hechos.celdas
      .filter((celda) => celda.dia >= desde)
      .map((celda) => celdaDe(celda, gotas.get(celda.id) ?? 0));

    return c.json({
      hoy,
      persona: perfilDe(persona, ahora),
      progreso: {
        vueloHastaAyer: progreso.vueloHastaAyer,
        gotasHastaAyer: progreso.gotas.hastaAyer,
        bonosDeHoy: progreso.gotas.bonosDeHoy,
      },
      actividades,
      celdasLlenas,
      tramosDeAjustes: hechos.entrada.ajustes.historial,
      colmena: await resumenDeColmenaActiva(base, activas),
      colmenasActivas: activas.length,
    });
  });

  return rutas;
}
