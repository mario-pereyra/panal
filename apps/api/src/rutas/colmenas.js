import { randomBytes, randomUUID } from "node:crypto";
import { cambiosDeColmena, nuevaColmena } from "@panal/contratos";
import { diaLogico } from "@panal/motor";
import { Hono } from "hono";
import { liberarPendientes } from "../datos/actividades.js";
import {
  actualizarColmena,
  colmenaPorId,
  colmenasDePersona,
  crearColmena,
  crearInvitacion,
  esIntegrante,
  integrantesDe,
  invitacionPorCodigo,
  invitacionVigente,
  sacarIntegrante,
  sumarIntegrante,
} from "../datos/colmenas.js";
import { falla, leerCuerpo } from "../errores.js";
import { exigirSesion, personaDe } from "../seguridad/sesion.js";
import { colmenaDeIntegrante, colmenasCompletas, detalleDeColmena } from "../servicios/colmenas.js";
import { iso } from "../servicios/formatos.js";

/** Días que dura un enlace de invitación. */
export const DIAS_DE_INVITACION = 7;

/**
 * Colmenas, su enjambre y sus invitaciones.
 * @param {import("../app.js").Contexto} contexto
 */
export function rutasDeColmenas({ base, reloj }) {
  const rutas = new Hono();

  /** @param {import("../datos/colmenas.js").FilaDeColmena} fila */
  const completa = async (fila, db = base) => (await colmenasCompletas(db, [fila]))[0];

  rutas.get("/colmenas", exigirSesion, async (c) => {
    const filas = await colmenasDePersona(base, personaDe(c).id);
    return c.json({ colmenas: await colmenasCompletas(base, filas) });
  });

  rutas.post("/colmenas", exigirSesion, async (c) => {
    const datos = await leerCuerpo(c, nuevaColmena);
    const persona = personaDe(c);
    const ahora = iso(reloj());
    const id = randomUUID();
    const colmena = await base.transaccion(async (tx) => {
      await crearColmena(tx, { id, ...datos, fundadoraId: persona.id, creadaEn: ahora });
      await sumarIntegrante(tx, id, persona.id, ahora);
      return completa(await colmenaPorId(tx, id), tx);
    });
    return c.json({ colmena }, 201);
  });

  rutas.get("/colmenas/:id", exigirSesion, async (c) => {
    const persona = personaDe(c);
    const colmena = await colmenaDeIntegrante(base, c.req.param("id"), persona.id);
    const zona = persona.zona_horaria;
    return c.json(await detalleDeColmena(base, colmena, { zona, hoy: diaLogico(reloj(), zona) }));
  });

  // Editar: cualquier integrante. Archivar o recuperar: solo la fundadora.
  rutas.patch("/colmenas/:id", exigirSesion, async (c) => {
    const persona = personaDe(c);
    const colmena = await colmenaDeIntegrante(base, c.req.param("id"), persona.id);
    const cambios = await leerCuerpo(c, cambiosDeColmena);
    if (cambios.archivada !== undefined && colmena.fundadora_id !== persona.id) {
      throw falla("sin_permiso");
    }
    /** @type {Record<string, unknown>} */
    const columnas = {};
    if (cambios.nombre !== undefined) columnas.nombre = cambios.nombre;
    if (cambios.descripcion !== undefined) columnas.descripcion = cambios.descripcion;
    if (cambios.entregaEl !== undefined) columnas.entrega_el = cambios.entregaEl;
    if (cambios.archivada !== undefined) {
      columnas.archivada_en = cambios.archivada ? iso(colmena.archivada_en ?? reloj()) : null;
    }
    await actualizarColmena(base, colmena.id, columnas);
    return c.json({ colmena: await completa(await colmenaPorId(base, colmena.id)) });
  });

  rutas.get("/colmenas/:id/invitacion", exigirSesion, async (c) => {
    const colmena = await colmenaDeIntegrante(base, c.req.param("id"), personaDe(c).id);
    const vigente = await invitacionVigente(base, colmena.id, iso(reloj()));
    return c.json({
      invitacion: vigente ? { codigo: vigente.codigo, venceEn: iso(vigente.vence_en) } : null,
    });
  });

  // Crea un enlace nuevo y anula el anterior.
  rutas.post("/colmenas/:id/invitacion", exigirSesion, async (c) => {
    const persona = personaDe(c);
    const colmena = await colmenaDeIntegrante(base, c.req.param("id"), persona.id);
    if (colmena.archivada_en) throw falla("colmena_cerrada");
    const ahora = reloj();
    const invitacion = {
      // 128 bits aleatorios: imposible de adivinar y corto para un enlace.
      codigo: randomBytes(16).toString("base64url"),
      venceEn: iso(ahora + DIAS_DE_INVITACION * 24 * 60 * 60 * 1000),
    };
    await base.transaccion((tx) =>
      crearInvitacion(tx, {
        ...invitacion,
        colmenaId: colmena.id,
        creadaPor: persona.id,
        creadaEn: iso(ahora),
      }),
    );
    return c.json({ invitacion }, 201);
  });

  // Salir (la propia persona) o quitar a alguien (la fundadora).
  rutas.delete("/colmenas/:id/integrantes/:personaId", exigirSesion, async (c) => {
    const persona = personaDe(c);
    const colmena = await colmenaDeIntegrante(base, c.req.param("id"), persona.id);
    const quien = c.req.param("personaId");
    const esFundadora = colmena.fundadora_id === persona.id;
    if (quien !== persona.id && !esFundadora) throw falla("sin_permiso");

    await base.transaccion(async (tx) => {
      const integrantes = await integrantesDe(tx, [colmena.id]);
      if (!integrantes.some((integrante) => integrante.id === quien)) throw falla("no_existe");
      if (quien === colmena.fundadora_id && integrantes.length > 1)
        throw falla("fundadora_no_sale");
      await sacarIntegrante(tx, colmena.id, quien, iso(reloj()));
      await liberarPendientes(tx, colmena.id, quien);
    });
    return c.body(null, 204);
  });

  return rutas;
}

/**
 * Invitaciones por enlace. Ver una no pide sesión; aceptarla, sí.
 * @param {import("../app.js").Contexto} contexto
 */
export function rutasDeInvitaciones({ base, reloj }) {
  const rutas = new Hono();

  /**
   * La invitación si sigue abierta. Si no existe, 404; si venció, se anuló o su
   * colmena se archivó, 410.
   * @param {import("../datos/base.js").Consultor} db
   * @param {string} codigo
   * @param {number} ahora
   */
  async function invitacionAbierta(db, codigo, ahora) {
    const invitacion = codigo.length <= 64 ? await invitacionPorCodigo(db, codigo) : undefined;
    if (!invitacion) throw falla("no_existe");
    const cerrada =
      invitacion.anulada_en ||
      invitacion.colmena_archivada_en ||
      Number(invitacion.vence_en) <= ahora;
    if (cerrada) throw falla("invitacion_vencida");
    return invitacion;
  }

  rutas.get("/invitaciones/:codigo", async (c) => {
    const invitacion = await invitacionAbierta(base, c.req.param("codigo"), reloj());
    const persona = c.get("persona");
    return c.json({
      colmena: {
        id: invitacion.colmena_id,
        nombre: invitacion.colmena_nombre,
        abejas: invitacion.abejas,
      },
      invita: { nombre: invitacion.invita },
      venceEn: iso(invitacion.vence_en),
      yaSoyIntegrante: persona
        ? await esIntegrante(base, invitacion.colmena_id, persona.id)
        : false,
    });
  });

  rutas.post("/invitaciones/:codigo/aceptar", exigirSesion, async (c) => {
    const persona = personaDe(c);
    const ahora = reloj();
    const colmena = await base.transaccion(async (tx) => {
      const invitacion = await invitacionAbierta(tx, c.req.param("codigo"), ahora);
      if (await esIntegrante(tx, invitacion.colmena_id, persona.id))
        throw falla("ya_eres_integrante");
      await sumarIntegrante(tx, invitacion.colmena_id, persona.id, iso(ahora));
      return (await colmenasCompletas(tx, [await colmenaPorId(tx, invitacion.colmena_id)]))[0];
    });
    return c.json({ colmena });
  });

  return rutas;
}
