import {
  avanceDeColmena,
  constanciaDe,
  estadoDeZum,
  gotasDeCelda,
  horaLocal,
  oficioDe,
  rachaDe,
  resumenDelDia,
  tocaHoy,
} from "@panal/motor";
import { createSelector } from "@reduxjs/toolkit";
import { panalApi } from "../../api/panalApi.js";
import { selectAhora } from "../reloj/relojSelector.js";

/**
 * Selectores de "Hoy". Las pantallas no calculan nada: leen estos selectores
 * memorizados, que combinan el caché de la API con las reglas del motor.
 */

const selectConsultaDelPanal = panalApi.endpoints.obtenerPanal.select();

/** Lo que respondió el servidor, o `undefined` mientras carga. */
export const selectPanal = (estado) => selectConsultaDelPanal(estado).data;

export const selectPersona = (estado) => selectPanal(estado)?.persona;

/** Las actividades que tocan hoy, cada una con su celda si ya está llena. */
export const selectCeldasDeHoy = createSelector([selectPanal], (panal) => {
  if (!panal) return [];
  const { hoy, actividades, celdasLlenas, colmena } = panal;
  const llenasHoy = celdasLlenas.filter((celda) => celda.dia === hoy);

  return actividades.flatMap((actividad) => {
    const hechos = celdasLlenas.filter((celda) => celda.actividadId === actividad.id);
    const { toca, vencida } = tocaHoy(actividad, actividad.regla, hechos, hoy);
    if (!toca) return [];
    const celda = llenasHoy.find((llena) => llena.actividadId === actividad.id) ?? null;
    return [
      {
        id: actividad.id,
        titulo: actividad.titulo,
        tipo: actividad.tipo,
        regla: actividad.regla,
        vence: actividad.vence,
        venceHoy: actividad.vence === hoy,
        vencida,
        colmena: actividad.colmenaId === colmena?.id ? colmena.nombre : null,
        celdaId: celda?.id ?? null,
        llena: celda !== null,
        // Llena: lo que valió. Vacía: lo que valdría si se llenara ahora.
        gotas:
          celda?.gotas ??
          gotasDeCelda({ ...actividad, vencida }, { llenasAntes: llenasHoy.length }),
      },
    ];
  });
});

/** El panal de hoy: celdas llenas, meta, si cerró y gotas del día. */
export const selectPanalDeHoy = createSelector([selectPanal, selectCeldasDeHoy], (panal, celdas) =>
  panal
    ? resumenDelDia(
        { celdas: panal.celdasLlenas, programadas: celdas.length },
        panal.persona,
        panal.hoy,
      )
    : null,
);

export const selectRacha = createSelector([selectPanal], (panal) => {
  if (!panal) return null;
  const dias = [...new Set(panal.celdasLlenas.map((celda) => celda.dia))];
  return rachaDe(dias, panal.persona, panal.hoy);
});

export const selectOficio = createSelector([selectPersona, selectPanalDeHoy], (persona, resumen) =>
  persona && resumen ? oficioDe(persona.gotasHastaAyer + resumen.gotas) : null,
);

const selectHora = createSelector([selectAhora, selectPersona], (ahora, persona) =>
  persona ? horaLocal(ahora, persona.zonaHoraria) : 12,
);

export const selectEstadoDeZum = createSelector(
  [selectPanalDeHoy, selectRacha, selectHora],
  (resumen, racha, hora) =>
    resumen && racha ? estadoDeZum(resumen, racha, { hora }) : "esperando",
);

/** La colmena con actividad más reciente: avance, celdas con color y aporte por abeja. */
export const selectResumenColmenaActiva = createSelector([selectPanal], (panal) => {
  const colmena = panal?.colmena;
  if (!colmena) return null;

  const avance = avanceDeColmena(colmena.celdas);
  const colorDe = new Map(
    colmena.integrantes.map((integrante, indice) => [integrante.id, `var(--abeja-${indice + 1})`]),
  );
  const aporteDe = new Map(avance.aportes.map((aporte) => [aporte.personaId, aporte.celdas]));

  return {
    id: colmena.id,
    nombre: colmena.nombre,
    ...avance,
    celdas: colmena.celdas.map((celda) => ({
      id: celda.actividadId,
      color: celda.llenaPor ? colorDe.get(celda.llenaPor) : null,
    })),
    integrantes: colmena.integrantes.map((integrante) => ({
      id: integrante.id,
      nombre: integrante.nombre,
      color: colorDe.get(integrante.id),
      celdas: aporteDe.get(integrante.id) ?? 0,
    })),
  };
});

/** El panal de constancia de las últimas cinco semanas. */
export const selectConstancia = createSelector([selectPanal], (panal) =>
  panal ? constanciaDe(panal.celdasLlenas, panal.persona, panal.hoy) : [],
);
