import { celdaNueva, identificador } from "@panal/contratos";
import { celebracionesEntre, diaLogico, progresoDe } from "@panal/motor";
import { Hono } from "hono";
import {
  actividadPorId,
  borrarCelda,
  celdaPorId,
  insertarCelda,
  yaLlena,
} from "../datos/actividades.js";
import { esDuplicado } from "../datos/base.js";
import { esIntegrante } from "../datos/colmenas.js";
import { falla, leerCuerpo, validar } from "../errores.js";
import { exigirSesion, personaDe } from "../seguridad/sesion.js";
import { esIdentificador } from "../servicios/actividades.js";
import { revisarCierre } from "../servicios/colmenas.js";
import { celdaDe, iso } from "../servicios/formatos.js";
import { gotasPorCelda, hechosDe } from "../servicios/progreso.js";

/**
 * Llenar y deshacer celdas. El día lo pone el servidor con su propio reloj.
 * @param {import("../app.js").Contexto} contexto
 */
export function rutasDeCeldas({ base, reloj }) {
  const rutas = new Hono();

  rutas.put("/celdas/:id", exigirSesion, async (c) => {
    const id = validar(identificador, c.req.param("id"), { campo: "id" });
    const { actividadId } = await leerCuerpo(c, celdaNueva);
    const persona = personaDe(c);

    const llenar = () =>
      base.transaccion(async (tx) => {
        const ahora = reloj();
        const previa = await celdaPorId(tx, id);
        if (previa) {
          // Repetir el mismo envío devuelve la misma celda, sin celebrar dos veces.
          if (previa.persona_id !== persona.id || previa.actividad_id !== actividadId) {
            throw falla("celda_ya_llena");
          }
          const gotas = gotasPorCelda(progresoDe((await hechosDe(tx, persona, ahora)).entrada));
          return { celda: celdaDe(previa, gotas.get(id) ?? 0), celebraciones: [] };
        }

        const actividad = await actividadPorId(tx, actividadId);
        if (!actividad) throw falla("no_existe");
        if (actividad.colmena_id) {
          if (!(await esIntegrante(tx, actividad.colmena_id, persona.id)))
            throw falla("sin_permiso");
          if (actividad.colmena_archivada_en) throw falla("colmena_cerrada");
          if (actividad.asignada_a && actividad.asignada_a !== persona.id)
            throw falla("celda_ajena");
        } else if (actividad.creada_por !== persona.id) {
          throw falla("sin_permiso");
        }
        if (actividad.archivada_en) throw falla("no_existe");

        const dia = diaLogico(ahora, persona.zona_horaria);
        // Una única se llena una sola vez; una recurrente, una vez por día.
        if (await yaLlena(tx, actividadId, actividad.tipo === "unica" ? null : dia)) {
          throw falla("celda_ya_llena");
        }

        const antes = progresoDe((await hechosDe(tx, persona, ahora)).entrada);
        await insertarCelda(tx, {
          id,
          actividadId,
          personaId: persona.id,
          dia,
          llenadaEn: iso(ahora),
        });
        await revisarCierre(tx, actividad.colmena_id, ahora, { puedeCerrar: true });
        const despues = progresoDe((await hechosDe(tx, persona, ahora)).entrada);

        const celda = await celdaPorId(tx, id);
        return {
          celda: celdaDe(celda, gotasPorCelda(despues).get(id) ?? 0),
          celebraciones: celebracionesEntre(antes, despues),
        };
      });

    try {
      return c.json(await llenar());
    } catch (error) {
      // Dos envíos iguales a la vez: el segundo choca con el primero y lo encuentra al repetir.
      if (esDuplicado(error, "celdas_llenas_pkey")) return c.json(await llenar());
      if (esDuplicado(error)) throw falla("celda_ya_llena");
      throw error;
    }
  });

  // Deshacer. Solo quien la llenó; si ya no existe, no hay nada que hacer.
  rutas.delete("/celdas/:id", exigirSesion, async (c) => {
    const id = c.req.param("id");
    const persona = personaDe(c);
    if (!esIdentificador(id)) return c.body(null, 204);
    await base.transaccion(async (tx) => {
      const celda = await celdaPorId(tx, id);
      if (!celda) return;
      if (celda.persona_id !== persona.id) throw falla("sin_permiso");
      const actividad = await actividadPorId(tx, celda.actividad_id);
      await borrarCelda(tx, id);
      await revisarCierre(tx, actividad?.colmena_id ?? null, reloj(), { puedeCerrar: false });
    });
    return c.body(null, 204);
  });

  return rutas;
}
