import { MAXIMO_DE_PRIORIDAD_ALTA } from "@panal/contratos";
import { duenaDe, gotasDeCelda, ocupaCupoDeAlta } from "@panal/motor";
import { createSelector } from "@reduxjs/toolkit";
import { panalApi } from "../../api/panalApi.js";
import { colorDeAbeja } from "../../componentes/textos.js";
import { selectYo } from "../sesion/sesionSelector.js";

/**
 * Selectores de la ventana de actividad (P06).
 */

const selectActivas = (estado) =>
  panalApi.endpoints.obtenerActividades.select("activas")(estado).data;
const selectArchivadas = (estado) =>
  panalApi.endpoints.obtenerActividades.select("archivadas")(estado).data;
const selectColmenas = (estado) => panalApi.endpoints.obtenerColmenas.select()(estado).data;
const selectCeldasLlenas = (estado) =>
  panalApi.endpoints.obtenerPanal.select()(estado).data?.celdasLlenas;

/** El borrador guardado para una actividad, o `undefined`. */
export const selectBorradorDeCelda = (estado, clave) => estado.actividad.borradores[clave];

/** La actividad que se edita, buscada en las listas ya cargadas. */
export const selectActividadAEditar = createSelector(
  [selectActivas, selectArchivadas, (_, id) => id],
  (activas, archivadas, id) =>
    id
      ? ([...(activas?.actividades ?? []), ...(archivadas?.actividades ?? [])].find(
          (una) => una.id === id,
        ) ?? null)
      : null,
);

/** Las colmenas donde se puede crear una celda: activas y sin cerrar, con su enjambre. */
export const selectColmenasParaElegir = createSelector([selectColmenas], (respuesta) =>
  (respuesta?.colmenas ?? [])
    .filter((colmena) => !colmena.archivadaEn && !colmena.avance.cerrada)
    .map((colmena) => ({
      id: colmena.id,
      nombre: colmena.nombre,
      integrantes: colmena.integrantes.map((abeja) => ({
        ...abeja,
        color: colorDeAbeja(abeja.color),
      })),
    })),
);

/**
 * Cuántos cupos de prioridad alta ocupa la persona, sin contar la que se edita.
 * La regla es la del motor, la misma con que decide el servidor: solo cuentan
 * las de su panal que siguen sin llenar.
 */
export const selectAltasOcupadas = createSelector(
  [selectActivas, selectCeldasLlenas, selectYo, (_, id) => id],
  (activas, celdasLlenas, yo, id) => {
    const llenas = new Set((celdasLlenas ?? []).map((celda) => celda.actividadId));
    return (activas?.actividades ?? []).filter(
      (actividad) =>
        actividad.id !== id &&
        duenaDe(actividad) === yo?.id &&
        ocupaCupoDeAlta({
          ...actividad,
          archivada: Boolean(actividad.archivadaEl),
          llena: llenas.has(actividad.id),
        }),
    ).length;
  },
);

export const selectPuedeMarcarAlta = (estado, id) =>
  selectAltasOcupadas(estado, id) < MAXIMO_DE_PRIORIDAD_ALTA;

/** Lo que valdrá la celda al llenarla, con las reglas del motor. */
export const vistaPreviaDeGotas = ({ tipo, alta }) =>
  gotasDeCelda({ tipo, prioridad: tipo === "unica" && alta ? "alta" : "normal" });
