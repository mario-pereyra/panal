import { cambiosDePerfil, primerVuelo } from "@panal/contratos";
import { diaLogico, sumarDias } from "@panal/motor";
import { Hono } from "hono";
import { actualizarPersona } from "../datos/personas.js";
import { falla, leerCuerpo } from "../errores.js";
import { exigirSesion, personaDe } from "../seguridad/sesion.js";
import { anotarAjustes } from "../servicios/ajustes.js";
import { iso, metasDe, perfilDe } from "../servicios/formatos.js";
import { progresoDePersona } from "../servicios/progreso.js";

/**
 * El perfil propio: ajustes, el recorrido inicial y "Mi vuelo".
 * @param {import("../app.js").Contexto} contexto
 */
export function rutasDeYo({ base, reloj }) {
  const rutas = new Hono();

  rutas.get("/yo", exigirSesion, (c) => c.json(perfilDe(personaDe(c), reloj())));

  rutas.patch("/yo", exigirSesion, async (c) => {
    const cambios = await leerCuerpo(c, cambiosDePerfil);
    const persona = personaDe(c);
    const ahora = reloj();
    const hoy = diaLogico(ahora, persona.zona_horaria);
    /** @type {Record<string, unknown>} */
    const columnas = {};

    if (cambios.nombre !== undefined) columnas.nombre = cambios.nombre;
    if (cambios.zonaHoraria !== undefined) columnas.zona_horaria = cambios.zonaHoraria;
    if (cambios.diaSinFlores !== undefined) columnas.dia_sin_flores = cambios.diaSinFlores;
    if (cambios.invernada !== undefined)
      Object.assign(columnas, invernadaNueva(persona, cambios.invernada, hoy));

    if (cambios.metaDiaria !== undefined) {
      const vigente = metasDe(persona, hoy).metaDiaria;
      const alInstante = !persona.primer_vuelo_en || cambios.metaDiaria === vigente;
      // Durante el primer vuelo la meta rige al instante; después, desde mañana.
      Object.assign(columnas, {
        meta_diaria: persona.primer_vuelo_en ? vigente : cambios.metaDiaria,
        meta_siguiente: alInstante ? null : cambios.metaDiaria,
        meta_cambia_el: alInstante ? null : sumarDias(hoy, 1),
      });
    }

    const cambianAjustes = cambios.metaDiaria !== undefined || cambios.diaSinFlores !== undefined;
    const actualizada = await base.transaccion(async (tx) => {
      const fila = await actualizarPersona(tx, persona.id, columnas);
      // Lo que rige desde hoy va al historial; los días anteriores no cambian.
      if (cambianAjustes) await anotarAjustes(tx, fila, hoy);
      return fila;
    });
    return c.json(perfilDe(actualizada, ahora));
  });

  rutas.post("/yo/primer-vuelo", exigirSesion, async (c) => {
    const { metaDiaria } = await leerCuerpo(c, primerVuelo);
    const persona = personaDe(c);
    const ahora = reloj();
    const actualizada = await base.transaccion(async (tx) => {
      const fila = await actualizarPersona(tx, persona.id, {
        meta_diaria: metaDiaria,
        meta_siguiente: null,
        meta_cambia_el: null,
        primer_vuelo_en: persona.primer_vuelo_en ?? iso(ahora),
      });
      await anotarAjustes(tx, fila, diaLogico(ahora, fila.zona_horaria));
      return fila;
    });
    return c.json(perfilDe(actualizada, ahora));
  });

  rutas.get("/yo/progreso", exigirSesion, async (c) => {
    const { hechos, progreso } = await progresoDePersona(base, personaDe(c), reloj());
    return c.json({
      hoy: hechos.hoy,
      oficio: progreso.oficio,
      gotas: { total: progreso.gotas.total, desglose: progreso.gotas.desglose },
      racha: {
        actual: progreso.racha.actual,
        mejor: progreso.racha.mejor,
        reservas: progreso.racha.reservas,
      },
      sellos: progreso.sellos,
    });
  });

  return rutas;
}

/**
 * Las columnas de una invernada nueva.
 *
 * El motor mira una sola invernada para todo el historial, así que cambiar una
 * que ya empezó cambiaría cómo se contaron días pasados. Por eso una invernada
 * nueva empieza hoy o después, salvo que sea la misma que está en curso; y al
 * quitar una que ya empezó, se conservan los días ya pasados.
 *
 * @param {import("../datos/personas.js").FilaDePersona} persona
 * @param {{ desde: string, hasta: string } | null} invernada
 * @param {string} hoy
 */
function invernadaNueva(persona, invernada, hoy) {
  const empezoAntes = persona.invernada_desde != null && persona.invernada_desde < hoy;
  if (invernada === null) {
    if (!empezoAntes) return { invernada_desde: null, invernada_hasta: null };
    const ayer = sumarDias(hoy, -1);
    return {
      invernada_desde: persona.invernada_desde,
      invernada_hasta: persona.invernada_hasta < ayer ? persona.invernada_hasta : ayer,
    };
  }
  if (invernada.desde < hoy && invernada.desde !== persona.invernada_desde) {
    throw falla("datos_invalidos", {
      campos: { invernada: "La invernada empieza hoy o más adelante." },
    });
  }
  return { invernada_desde: invernada.desde, invernada_hasta: invernada.hasta };
}
