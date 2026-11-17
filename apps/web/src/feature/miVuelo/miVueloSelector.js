import { createSelector } from "@reduxjs/toolkit";
import { panalApi } from "../../api/panalApi.js";
import { selectYo } from "../sesion/sesionSelector.js";

/**
 * Selectores de Mi vuelo (P11).
 */

const selectProgreso = (estado) => panalApi.endpoints.obtenerProgreso.select()(estado).data;

export const selectSelloAbierto = (estado) => estado.miVuelo.selloAbierto;
export const selectMovimiento = (estado) => estado.miVuelo.movimiento;

export const selectOficioDeVuelo = createSelector(
  [selectProgreso],
  (progreso) => progreso?.oficio ?? null,
);

/**
 * Los sellos, con el siguiente a ganar señalado: el primero disponible, no
 * secreto y sin ganar, el que tiene más avance.
 */
export const selectSellos = createSelector([selectProgreso], (progreso) => {
  const sellos = progreso?.sellos ?? [];
  const candidatos = sellos.filter((sello) => !sello.ganado && sello.disponible && !sello.secreto);
  const siguiente = candidatos.reduce(
    (mejor, sello) =>
      mejor && mejor.actual / mejor.meta >= sello.actual / sello.meta ? mejor : sello,
    null,
  );
  return {
    lista: sellos.map((sello) => ({ ...sello, siguiente: sello.id === siguiente?.id })),
    ganados: sellos.filter((sello) => sello.ganado).length,
    total: sellos.length,
  };
});

export const selectSello = createSelector([selectSellos, selectSelloAbierto], (sellos, id) =>
  id ? (sellos.lista.find((sello) => sello.id === id) ?? null) : null,
);

/** Los ajustes del perfil, como los muestra el formulario. */
export const selectAjustes = createSelector([selectYo], (yo) =>
  yo
    ? {
        nombre: yo.nombre,
        metaDiaria: yo.metaDiaria,
        metaSiguiente: yo.metaSiguiente,
        diaSinFlores: yo.diaSinFlores,
        invernada: yo.invernada,
        zonaHoraria: yo.zonaHoraria,
      }
    : null,
);

export const selectGotasYRacha = createSelector([selectProgreso], (progreso) =>
  progreso ? { gotas: progreso.gotas, racha: progreso.racha, hoy: progreso.hoy } : null,
);
