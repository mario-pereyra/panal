import { DIAS_DE_INVERNADA } from "@panal/contratos";
import { sumarDias } from "@panal/motor";
import { createSelector } from "@reduxjs/toolkit";
import { selectProgreso, selectYo } from "../../store/api.js";

const selectSelloAbierto = (estado) => estado.miVuelo.selloAbierto;

export const selectOficioDeVuelo = createSelector(
  [selectProgreso],
  (progreso) => progreso?.oficio ?? null,
);

const porGanar = (sello) => !sello.ganado && sello.disponible && !sello.secreto;

/**
 * Los sellos, con el siguiente a ganar señalado: de los que están por ganar,
 * el que tiene más avance. Un secreto sin ganar no muestra su nombre ni su
 * criterio, y solo los sellos de varios pasos muestran su barra.
 */
export const selectSellos = createSelector([selectProgreso], (progreso) => {
  const sellos = progreso?.sellos ?? [];
  const siguiente = sellos
    .filter(porGanar)
    .reduce(
      (mejor, sello) =>
        mejor && mejor.actual / mejor.meta >= sello.actual / sello.meta ? mejor : sello,
      null,
    );
  return {
    lista: sellos.map((sello) => ({
      ...sello,
      siguiente: sello.id === siguiente?.id,
      oculto: sello.secreto && !sello.ganado,
      avance: porGanar(sello) && sello.meta > 1 ? sello.actual / sello.meta : null,
    })),
    ganados: sellos.filter((sello) => sello.ganado).length,
    total: sellos.length,
  };
});

export const selectSello = createSelector([selectSellos, selectSelloAbierto], (sellos, id) =>
  id ? (sellos.lista.find((sello) => sello.id === id) ?? null) : null,
);

/**
 * Los ajustes del perfil, como los muestra el formulario. Un cambio de tamaño
 * rige desde mañana: el formulario muestra el elegido y avisa del de hoy.
 */
export const selectAjustes = createSelector([selectYo], (yo) => {
  if (!yo) return null;
  const metaDeManana =
    yo.metaSiguiente && yo.metaSiguiente !== yo.metaDiaria ? yo.metaSiguiente : null;
  return {
    nombre: yo.nombre,
    metaDiaria: yo.metaDiaria,
    metaDeManana,
    metaElegida: metaDeManana ?? yo.metaDiaria,
    diaSinFlores: yo.diaSinFlores,
    invernada: yo.invernada,
    zonaHoraria: yo.zonaHoraria,
  };
});

/** La invernada en curso, si la hay, y las fechas que se pueden elegir para una nueva. */
export const selectInvernada = createSelector([selectYo, selectProgreso], (yo, progreso) => {
  const hoy = progreso?.hoy;
  if (!yo || !hoy) return null;
  return {
    hoy,
    vigenteHasta: yo.invernada && yo.invernada.hasta >= hoy ? yo.invernada.hasta : null,
    // Se propone una semana, contando hoy.
    propuesta: sumarDias(hoy, 6),
    maximo: sumarDias(hoy, DIAS_DE_INVERNADA - 1),
  };
});

export const selectGotasYRacha = createSelector([selectProgreso], (progreso) =>
  progreso ? { gotas: progreso.gotas, racha: progreso.racha } : null,
);
