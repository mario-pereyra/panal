import { diaLogico, gotasDeCelda, tocaHoy } from "@panal/motor";
import { crearDatosDeEjemplo } from "./datosDeEjemplo.js";

/**
 * Servidor de ejemplo, en memoria. Responde a las mismas rutas que tendrá la
 * API real, así que el resto de la aplicación no sabe que no hay servidor.
 * Los cambios se pierden al recargar la página.
 */

const ZONA = "America/La_Paz";
const LATENCIA_MS = 120;

let panal = null;

function leerPanal() {
  const hoy = diaLogico(Date.now(), ZONA);
  if (!panal || panal.hoy !== hoy) panal = crearDatosDeEjemplo(hoy);
  return panal;
}

function fallo(status, codigo, mensaje) {
  return { error: { status, data: { error: { codigo, mensaje } } } };
}

function llenarCelda(id, actividadId) {
  const datos = leerPanal();
  const repetida = datos.celdasLlenas.find((celda) => celda.id === id);
  // Repetir es seguro: el mismo envío dos veces no cambia nada.
  if (repetida) return { data: { celda: repetida } };

  const actividad = datos.actividades.find((candidata) => candidata.id === actividadId);
  if (!actividad) return fallo(404, "no_existe", "Esa actividad ya no está en tu panal.");

  const deHoy = datos.celdasLlenas.filter((celda) => celda.dia === datos.hoy);
  if (deHoy.some((celda) => celda.actividadId === actividadId)) {
    return fallo(409, "celda_ya_llena", "Esa celda ya estaba llena.");
  }

  const hechos = datos.celdasLlenas.filter((celda) => celda.actividadId === actividadId);
  const { vencida } = tocaHoy(actividad, actividad.regla, hechos, datos.hoy);
  const celda = {
    id,
    actividadId,
    dia: datos.hoy,
    gotas: gotasDeCelda({ ...actividad, vencida }, { llenasAntes: deHoy.length }),
  };
  datos.celdasLlenas.push(celda);

  const enColmena = datos.colmena?.celdas.find((otra) => otra.actividadId === actividadId);
  if (enColmena) enColmena.llenaPor = datos.persona.id;
  return { data: { celda } };
}

function vaciarCelda(id) {
  const datos = leerPanal();
  const celda = datos.celdasLlenas.find((candidata) => candidata.id === id);
  if (celda) {
    datos.celdasLlenas = datos.celdasLlenas.filter((otra) => otra.id !== id);
    const enColmena = datos.colmena?.celdas.find((otra) => otra.actividadId === celda.actividadId);
    if (enColmena) enColmena.llenaPor = null;
  }
  return { data: null };
}

/**
 * Hace de `baseQuery` de RTK Query.
 * @param {string | { url: string, method?: string, body?: any }} pedido
 */
export async function baseDeEjemplo(pedido) {
  const { url, method = "GET", body } = typeof pedido === "string" ? { url: pedido } : pedido;
  await new Promise((resolver) => setTimeout(resolver, LATENCIA_MS));

  if (method === "GET" && url === "/panal") return { data: structuredClone(leerPanal()) };

  const celda = /^\/celdas\/([^/]+)$/.exec(url);
  if (celda && method === "PUT") return llenarCelda(celda[1], body?.actividadId);
  if (celda && method === "DELETE") return vaciarCelda(celda[1]);

  return fallo(404, "no_existe", "Esa dirección no existe en el panal.");
}
