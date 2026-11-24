import { MAXIMO_DE_PRIORIDAD_ALTA } from "@panal/contratos";
import { duenaDe, ocupaCupoDeAlta } from "@panal/motor";
import { createSelector } from "@reduxjs/toolkit";
import { selectActividades, selectPanal, selectYo } from "../../store/api.js";

const selectActivas = (estado) => selectActividades(estado, "activas");
const selectArchivadas = (estado) => selectActividades(estado, "archivadas");
const selectCeldasLlenas = (estado) => selectPanal(estado)?.celdasLlenas;

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

/**
 * Cuántos cupos de prioridad alta ocupa la persona, sin contar la que se edita.
 * La regla es la del motor, la misma con que decide el servidor: solo cuentan
 * las de su panal que siguen sin llenar.
 */
const selectAltasOcupadas = createSelector(
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
