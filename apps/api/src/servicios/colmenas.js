import { identificador } from "@panal/contratos";
import { avanceDeColmena } from "@panal/motor";
import { actividadesDeColmena } from "../datos/actividades.js";
import {
  actualizarColmena,
  celdasDeColmenas,
  colmenaPorId,
  esIntegrante,
  integrantesDe,
} from "../datos/colmenas.js";
import { falla } from "../errores.js";
import { actividadDe, instante, integranteDe, iso } from "./formatos.js";

/**
 * Colmenas: su avance, su enjambre y quién puede verlas.
 *
 * @typedef {import("../datos/base.js").Consultor} Consultor
 * @typedef {import("../datos/colmenas.js").FilaDeColmena} FilaDeColmena
 */

/**
 * La colmena, si existe y la persona sigue dentro. Si no, el error que corresponde.
 * @param {Consultor} db
 * @param {string} colmenaId Tal como llegó en la dirección.
 * @param {string} personaId
 * @returns {Promise<FilaDeColmena>}
 */
export async function colmenaDeIntegrante(db, colmenaId, personaId) {
  if (!identificador.safeParse(colmenaId).success) throw falla("no_existe");
  const colmena = await colmenaPorId(db, colmenaId);
  if (!colmena) throw falla("no_existe");
  if (!(await esIntegrante(db, colmenaId, personaId))) throw falla("sin_permiso");
  return colmena;
}

/**
 * `Avance` de respuestas.js: el del motor, sin el reparto por persona.
 * @param {Array<{ llenaPor: string | null }>} celdas
 */
function avanceDe(celdas) {
  const { total, llenas, porcentaje, cuadro, faltanParaElSiguiente, cerrada } =
    avanceDeColmena(celdas);
  return { total, llenas, porcentaje, cuadro, faltanParaElSiguiente, cerrada };
}

/**
 * `Colmena` de respuestas.js para cada fila, en el mismo orden.
 * @param {Consultor} db
 * @param {FilaDeColmena[]} filas
 */
export async function colmenasCompletas(db, filas) {
  const ids = filas.map((fila) => fila.id);
  const integrantes = await integrantesDe(db, ids);
  const celdas = await celdasDeColmenas(db, ids);
  return filas.map((fila) => {
    const suyas = celdas
      .filter((celda) => celda.colmena_id === fila.id)
      .map((celda) => ({ actividadId: celda.actividad_id, llenaPor: celda.llena_por }));
    return {
      id: fila.id,
      nombre: fila.nombre,
      descripcion: fila.descripcion,
      entregaEl: fila.entrega_el,
      fundadoraId: fila.fundadora_id,
      cerradaEn: instante(fila.cerrada_en),
      archivadaEn: instante(fila.archivada_en),
      avance: avanceDe(suyas),
      integrantes: integrantes.filter((i) => i.colmena_id === fila.id).map(integranteDe),
      celdas: suyas,
    };
  });
}

/**
 * La colmena de "Hoy": entre las activas, la que tiene la celda llenada más
 * recientemente; si ninguna tiene celdas, la más nueva.
 * @param {Consultor} db
 * @param {FilaDeColmena[]} activas De la más nueva a la más vieja.
 * @returns {Promise<{ id: string, nombre: string, integrantes: Array<ReturnType<typeof integranteDe>>, celdas: Array<{ actividadId: string, llenaPor: string | null }> } | null>}
 */
export async function resumenDeColmenaActiva(db, activas) {
  if (activas.length === 0) return null;
  const celdas = await celdasDeColmenas(
    db,
    activas.map((colmena) => colmena.id),
  );
  const ultimaLlena = (colmena) =>
    Math.max(
      0,
      ...celdas
        .filter((celda) => celda.colmena_id === colmena.id && celda.llenada_en)
        .map((celda) => Number(celda.llenada_en)),
    );
  // `reduce` se queda con la primera en caso de empate, que es la más nueva.
  const elegida = activas.reduce((mejor, colmena) =>
    ultimaLlena(colmena) > ultimaLlena(mejor) ? colmena : mejor,
  );
  const [completa] = await colmenasCompletas(db, [elegida]);
  return {
    id: completa.id,
    nombre: completa.nombre,
    integrantes: completa.integrantes,
    celdas: completa.celdas,
  };
}

/**
 * `DetalleDeColmena` de respuestas.js.
 * @param {Consultor} db
 * @param {FilaDeColmena} fila
 * @param {{ zona: string, hoy: string }} vista Zona y día de quien mira.
 */
export async function detalleDeColmena(db, fila, { zona, hoy }) {
  const [colmena] = await colmenasCompletas(db, [fila]);
  const filas = await actividadesDeColmena(db, fila.id);
  const actividades = filas.map((actividad) => ({
    ...actividadDe(actividad, zona),
    llenaPor: actividad.llena_por,
    llenadaEl: actividad.llenada_el,
    celdaId: actividad.celda_id,
  }));
  const integrantes = await integrantesDe(db, [fila.id]);
  const enjambre = integrantes.map((integrante) => ({
    ...integranteDe(integrante),
    unidaEn: iso(integrante.unida_en),
    aportes: actividades.filter((a) => a.llenaPor === integrante.id).length,
    pendientes: actividades.filter((a) => a.asignadaA === integrante.id && !a.llenaPor).length,
  }));
  return { hoy, colmena, actividades, enjambre };
}

/**
 * Mantiene `cerrada_en` al día con el avance de la colmena.
 *
 * Se fija al llegar al 100 % llenando una celda (`puedeCerrar`). Se borra si la
 * colmena vuelve a bajar: al agregarle una actividad o al deshacer una celda.
 *
 * @param {Consultor} db
 * @param {string | null} colmenaId
 * @param {number} ahora
 * @param {{ puedeCerrar: boolean }} opciones
 */
export async function revisarCierre(db, colmenaId, ahora, { puedeCerrar }) {
  if (!colmenaId) return;
  const colmena = await colmenaPorId(db, colmenaId);
  if (!colmena) return;
  const celdas = await celdasDeColmenas(db, [colmenaId]);
  const { cerrada } = avanceDeColmena(celdas.map((celda) => ({ llenaPor: celda.llena_por })));
  if (cerrada && !colmena.cerrada_en && puedeCerrar) {
    await actualizarColmena(db, colmenaId, { cerrada_en: iso(ahora) });
  } else if (!cerrada && colmena.cerrada_en) {
    await actualizarColmena(db, colmenaId, { cerrada_en: null });
  }
}
