import {
  agruparPor,
  avanceDeLaSemana,
  gotasDeCelda,
  reglaToca,
  sumarDias,
  vivaEl,
} from "@panal/motor";
import { createSelector } from "@reduxjs/toolkit";
import { panalApi } from "../../api/panalApi.js";
import { cuandoEs, detalleDeActividad } from "../../componentes/textos.js";
import { selectCeldasDeHoy, selectPanal } from "../hoy/hoySelector.js";

/**
 * Selectores de "Celdas" (P05). Combinan la lista de actividades, las celdas
 * llenas de las últimas semanas y las reglas del motor.
 */

/** Días hacia adelante que mira la pestaña "Próximas". */
export const DIAS_DE_HORIZONTE = 7;

export const PESTANAS = ["hoy", "proximas", "recurrentes", "archivadas"];

const selectActivas = (estado) =>
  panalApi.endpoints.obtenerActividades.select("activas")(estado).data;
const selectArchivadas = (estado) =>
  panalApi.endpoints.obtenerActividades.select("archivadas")(estado).data;

export const selectFiltrosDeCeldas = (estado) => estado.celdas.filtros;

/** Las colmenas que aparecen en mis actividades, para el filtro. */
export const selectColmenasDeCeldas = createSelector([selectActivas], (lista) => {
  const colmenas = new Map();
  for (const actividad of lista?.actividades ?? []) {
    if (actividad.colmena) colmenas.set(actividad.colmena.id, actividad.colmena.nombre);
  }
  return [...colmenas].map(([id, nombre]) => ({ id, nombre }));
});

function pasaLosFiltros(actividad, filtros) {
  if (filtros.prioridad === "alta" && actividad.prioridad !== "alta") return false;
  if (filtros.colmena === "personales") return !actividad.colmenaId;
  if (filtros.colmena !== "todas") return actividad.colmenaId === filtros.colmena;
  return true;
}

/** Una actividad lista para su fila: el detalle y lo que vale. */
function aFila(actividad, extra = {}) {
  const fila = {
    id: actividad.id,
    titulo: actividad.titulo,
    tipo: actividad.tipo,
    prioridad: actividad.prioridad,
    regla: actividad.regla,
    vence: actividad.vence,
    colmenaId: actividad.colmenaId,
    colmena: actividad.colmena?.nombre ?? null,
    archivada: Boolean(actividad.archivadaEl),
    llena: false,
    gotas: gotasDeCelda(actividad),
    ...extra,
  };
  return { ...fila, detalle: detalleDeActividad(fila) };
}

/** Lo que toca un día que no es hoy: únicas que vencen ese día y recurrentes de días fijos. */
function tocaElDia(actividad, dia) {
  if (actividad.tipo === "unica") return actividad.vence === dia;
  const { clase } = actividad.regla ?? {};
  if (clase !== "dias" && clase !== "mes") return false;
  return vivaEl(actividad, dia) && reglaToca(actividad.regla, dia);
}

/** Las cuatro pestañas, ya filtradas, con sus conteos. */
export const selectCeldasPorPestana = createSelector(
  [selectCeldasDeHoy, selectActivas, selectArchivadas, selectPanal, selectFiltrosDeCeldas],
  (deHoy, activas, archivadas, panal, filtros) => {
    const hoy = panal?.hoy ?? activas?.hoy;
    const lista = (activas?.actividades ?? []).filter((actividad) =>
      pasaLosFiltros(actividad, filtros),
    );
    const hechosDe = agruparPor(panal?.celdasLlenas ?? [], (celda) => celda.actividadId);

    const filasDeHoy = deHoy
      .filter((fila) => pasaLosFiltros(fila, filtros))
      .map((fila) => ({ ...fila, detalle: detalleDeActividad(fila), archivada: false }));

    const proximas = [];
    if (hoy) {
      for (let salto = 1; salto <= DIAS_DE_HORIZONTE; salto += 1) {
        const dia = sumarDias(hoy, salto);
        const filas = lista
          .filter((actividad) => tocaElDia(actividad, dia))
          .map((actividad) => aFila(actividad));
        if (filas.length > 0) proximas.push({ dia, titulo: cuandoEs(dia, hoy), filas });
      }
      const masAdelante = lista
        .filter(
          (actividad) =>
            actividad.tipo === "unica" && actividad.vence > sumarDias(hoy, DIAS_DE_HORIZONTE),
        )
        .sort((a, b) => a.vence.localeCompare(b.vence))
        .map((actividad) => aFila(actividad));
      if (masAdelante.length > 0)
        proximas.push({ dia: "despues", titulo: "Más adelante", filas: masAdelante });
    }

    const recurrentes = lista
      .filter((actividad) => actividad.tipo === "recurrente")
      .map((actividad) => {
        const semana = hoy
          ? avanceDeLaSemana(actividad, hechosDe.get(actividad.id) ?? [], hoy)
          : null;
        return aFila(actividad, { semana });
      });

    const filasArchivadas = (archivadas?.actividades ?? [])
      .filter((actividad) => pasaLosFiltros(actividad, filtros))
      .map((actividad) => aFila(actividad));

    return {
      hoy: filasDeHoy,
      proximas,
      recurrentes,
      archivadas: filasArchivadas,
      conteos: {
        hoy: filasDeHoy.length,
        proximas: proximas.reduce((suma, grupo) => suma + grupo.filas.length, 0),
        recurrentes: recurrentes.length,
        archivadas: archivadas ? filasArchivadas.length : null,
      },
    };
  },
);

/** Si hay algún filtro puesto. */
export const selectHayFiltros = createSelector(
  [selectFiltrosDeCeldas],
  (filtros) => filtros.colmena !== "todas" || filtros.prioridad !== "todas",
);
