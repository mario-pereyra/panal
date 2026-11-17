import {
  actividad as esquemaDeActividad,
  cambiosDeActividad,
  identificador,
  vistaDeActividades,
} from "@panal/contratos";
import { diaLogico } from "@panal/motor";
import { Hono } from "hono";
import { actividadesVisibles, actividadPorId, guardarActividad } from "../datos/actividades.js";
import { falla, leerCuerpo, validar } from "../errores.js";
import { exigirSesion, personaDe } from "../seguridad/sesion.js";
import {
  esIdentificador,
  estadoDeFila,
  exigirColmenaDeDestino,
  exigirCupoDeAlta,
  exigirPermisoSobreActividad,
} from "../servicios/actividades.js";
import { revisarCierre } from "../servicios/colmenas.js";
import { actividadDe, iso } from "../servicios/formatos.js";

/**
 * Actividades: las listas de "Celdas", crear, reemplazar, editar y archivar.
 * @param {import("../app.js").Contexto} contexto
 */
export function rutasDeActividades({ base, reloj }) {
  const rutas = new Hono();

  rutas.get("/actividades", exigirSesion, async (c) => {
    const vista = validar(vistaDeActividades, c.req.query("ver"), { campo: "ver" });
    const persona = personaDe(c);
    const zona = persona.zona_horaria;
    const hoy = diaLogico(reloj(), zona);
    const filas = await actividadesVisibles(base, persona.id);
    const actividades = filas
      .filter((fila) => {
        const archivada = Boolean(fila.archivada_en || fila.colmena_archivada_en);
        if (vista === "archivadas") return archivada;
        // Una única cumplida antes de hoy ya no está activa: terminó.
        const cumplida =
          fila.tipo === "unica" && fila.primera_llena_el && fila.primera_llena_el < hoy;
        return !archivada && !cumplida;
      })
      .map((fila) => actividadDe(fila, zona));
    return c.json({ hoy, actividades });
  });

  // Crear o reemplazar. El identificador lo pone el navegador: repetir el envío no duplica nada.
  rutas.put("/actividades/:id", exigirSesion, async (c) => {
    const id = validar(identificador, c.req.param("id"), { campo: "id" });
    const datos = await leerCuerpo(c, esquemaDeActividad);
    const persona = personaDe(c);
    const ahora = reloj();

    const { fila, creada } = await base.transaccion(async (tx) => {
      const existente = await actividadPorId(tx, id);
      if (existente) await exigirPermisoSobreActividad(tx, existente, persona.id);
      await exigirColmenaDeDestino(tx, datos, persona.id);
      const antes = existente ? estadoDeFila(existente) : null;
      if (antes?.llena && (antes.tipo !== datos.tipo || antes.colmenaId !== datos.colmenaId)) {
        throw falla("datos_invalidos", {
          campos: { tipo: "Esta celda ya tiene días llenos: no cambia de tipo ni de colmena." },
        });
      }
      const creadaPor = existente?.creada_por ?? persona.id;
      await exigirCupoDeAlta(tx, antes, {
        id,
        tipo: datos.tipo,
        prioridad: datos.prioridad,
        colmenaId: datos.colmenaId,
        asignadaA: datos.asignadaA,
        creadaPor,
        archivada: antes?.archivada ?? false,
        llena: antes?.llena ?? false,
      });
      await guardarActividad(tx, {
        id,
        creadaPor,
        colmenaId: datos.colmenaId,
        asignadaA: datos.asignadaA,
        titulo: datos.titulo,
        tipo: datos.tipo,
        prioridadAlta: datos.prioridad === "alta",
        venceEl: datos.vence,
        regla: datos.regla,
        creadaEn: iso(existente?.creada_en ?? ahora),
        archivadaEn: existente?.archivada_en ? iso(existente.archivada_en) : null,
      });
      await revisarColmenas(tx, [existente?.colmena_id, datos.colmenaId], ahora);
      return { fila: await actividadPorId(tx, id), creada: !existente };
    });

    return c.json({ actividad: actividadDe(fila, persona.zona_horaria) }, creada ? 201 : 200);
  });

  // Editar, posponer, archivar o recuperar.
  rutas.patch("/actividades/:id", exigirSesion, async (c) => {
    const id = c.req.param("id");
    if (!esIdentificador(id)) throw falla("no_existe");
    const cambios = await leerCuerpo(c, cambiosDeActividad);
    const persona = personaDe(c);
    const zona = persona.zona_horaria;
    const ahora = reloj();

    const fila = await base.transaccion(async (tx) => {
      const existente = await actividadPorId(tx, id);
      if (!existente) throw falla("no_existe");
      await exigirPermisoSobreActividad(tx, existente, persona.id);
      const actual = actividadDe(existente, zona);
      const cambiaDeColmena =
        cambios.colmenaId !== undefined && cambios.colmenaId !== existente.colmena_id;

      // La actividad completa tiene que seguir siendo válida, no solo lo que cambia.
      const nueva = validar(esquemaDeActividad, {
        titulo: cambios.titulo ?? actual.titulo,
        tipo: actual.tipo,
        prioridad: cambios.prioridad ?? actual.prioridad,
        regla: cambios.regla ?? actual.regla,
        vence: cambios.vence !== undefined ? cambios.vence : actual.vence,
        colmenaId: cambios.colmenaId !== undefined ? cambios.colmenaId : actual.colmenaId,
        // Al cambiar de colmena, quien la tenía asignada puede no estar en la nueva.
        asignadaA:
          cambios.asignadaA !== undefined
            ? cambios.asignadaA
            : cambiaDeColmena
              ? null
              : actual.asignadaA,
      });

      const antes = estadoDeFila(existente);
      if (cambiaDeColmena && antes.llena) {
        throw falla("datos_invalidos", {
          campos: { colmenaId: "Esta celda ya tiene días llenos: no cambia de colmena." },
        });
      }
      if (cambiaDeColmena || nueva.asignadaA !== existente.asignada_a) {
        await exigirColmenaDeDestino(tx, nueva, persona.id);
      }
      const archivada = cambios.archivada ?? Boolean(existente.archivada_en);
      await exigirCupoDeAlta(tx, antes, {
        ...antes,
        prioridad: nueva.prioridad,
        colmenaId: nueva.colmenaId,
        asignadaA: nueva.asignadaA,
        archivada: archivada || Boolean(existente.colmena_archivada_en),
      });
      await guardarActividad(tx, {
        id,
        creadaPor: existente.creada_por,
        colmenaId: nueva.colmenaId,
        asignadaA: nueva.asignadaA,
        titulo: nueva.titulo,
        tipo: nueva.tipo,
        prioridadAlta: nueva.prioridad === "alta",
        venceEl: nueva.vence,
        regla: nueva.regla,
        creadaEn: iso(existente.creada_en),
        archivadaEn: archivada ? iso(existente.archivada_en ?? ahora) : null,
      });
      await revisarColmenas(tx, [existente.colmena_id, nueva.colmenaId], ahora);
      return actividadPorId(tx, id);
    });

    return c.json({ actividad: actividadDe(fila, zona) });
  });

  return rutas;
}

/**
 * Tras cambiar actividades, una colmena que estaba cerrada puede volver a abrirse.
 * @param {import("../datos/base.js").Consultor} tx
 * @param {Array<string | null | undefined>} colmenaIds
 * @param {number} ahora
 */
async function revisarColmenas(tx, colmenaIds, ahora) {
  for (const colmenaId of new Set(colmenaIds.filter(Boolean))) {
    await revisarCierre(tx, colmenaId, ahora, { puedeCerrar: false });
  }
}
