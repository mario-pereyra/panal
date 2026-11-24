import {
  avanzarDia,
  constanciaDe,
  estadoDeZum,
  gotasDeCelda,
  gotasDelVuelo,
  horaLocal,
  oficioDe,
  rachaParaHoy,
  resumenDelDia,
  tocaHoy,
} from "@panal/motor";
import { createSelector } from "@reduxjs/toolkit";
import { selectListaDeColmenas, selectPanal } from "../../store/api.js";
import { selectAhora } from "../reloj/relojSelector.js";
import { pintarColmena } from "./abejas.js";
import { filaDeActividad } from "./filas.js";

/**
 * El panal del día, que comparten Hoy, Celdas, Reportes, la celebración y la
 * cabecera. Combinan el caché de la API con las reglas del motor.
 *
 * El servidor manda lo calculado hasta ayer (`progreso`); el paso de hoy lo da
 * el navegador con las mismas funciones, así la pantalla cambia al instante.
 */

export const selectPersona = (estado) => selectPanal(estado)?.persona;

/** Las actividades que tocan hoy, cada una con su celda si ya está llena. */
export const selectCeldasDeHoy = createSelector([selectPanal], (panal) => {
  if (!panal) return [];
  const { hoy, actividades, celdasLlenas } = panal;
  const llenasHoy = celdasLlenas.filter((celda) => celda.dia === hoy);
  const quien = { miId: panal.persona.id, hoy };

  return actividades.flatMap((actividad) => {
    const hechos = celdasLlenas.filter((celda) => celda.actividadId === actividad.id);
    const { toca, vencida } = tocaHoy(actividad, actividad.regla, hechos, hoy);
    if (!toca) return [];
    const celda = llenasHoy.find((llena) => llena.actividadId === actividad.id) ?? null;
    return [
      filaDeActividad(actividad, quien, {
        archivada: false,
        venceHoy: actividad.vence === hoy,
        vencida,
        celdaId: celda?.id ?? null,
        llena: celda !== null,
        // Llena: lo que valió. Vacía: lo que valdría si se llenara ahora.
        gotas:
          celda?.gotas ??
          gotasDeCelda({ ...actividad, vencida }, { llenasAntes: llenasHoy.length }),
      }),
    ];
  });
});

/** Los ajustes para el motor: los de hoy y desde qué día rigió cada uno. */
const selectAjustes = createSelector([selectPanal], (panal) =>
  panal ? { ...panal.persona, historial: panal.tramosDeAjustes } : null,
);

/** El panal de hoy: celdas llenas, meta, si cerró y gotas de las celdas. */
export const selectPanalDeHoy = createSelector(
  [selectPanal, selectAjustes, selectCeldasDeHoy],
  (panal, ajustes, celdas) =>
    panal && ajustes
      ? resumenDelDia(
          { celdas: panal.celdasLlenas, programadas: celdas.length },
          ajustes,
          panal.hoy,
        )
      : null,
);

/** El vuelo con el paso de hoy ya dado: racha, reservas, cierres e hitos. */
const selectVueloDeHoy = createSelector([selectPanal, selectPanalDeHoy], (panal, resumen) =>
  panal && resumen
    ? avanzarDia(panal.progreso.vueloHastaAyer, {
        dia: panal.hoy,
        llenas: resumen.llenas,
        programadas: resumen.programadas,
        cerrado: resumen.cerrado,
        descanso: resumen.descanso,
        // Hoy todavía no termina: un día en blanco no gasta reservas hasta mañana.
        terminado: false,
      })
    : null,
);

export const selectRacha = createSelector(
  [selectPanal, selectPanalDeHoy, selectVueloDeHoy],
  (panal, resumen, vuelo) => (vuelo ? rachaParaHoy(vuelo, panal.hoy, resumen.llenas > 0) : null),
);

/** Gotas de hoy: las celdas, el cierre, un hito de racha y los bonos que calculó el servidor. */
export const selectGotasDeHoy = createSelector(
  [selectPanal, selectPanalDeHoy, selectVueloDeHoy],
  (panal, resumen, vuelo) => {
    if (!vuelo) return 0;
    const delVuelo = gotasDelVuelo(vuelo) - gotasDelVuelo(panal.progreso.vueloHastaAyer);
    return resumen.gotasDeCeldas + delVuelo + panal.progreso.bonosDeHoy;
  },
);

export const selectOficio = createSelector([selectPanal, selectGotasDeHoy], (panal, deHoy) =>
  panal ? oficioDe(panal.progreso.gotasHastaAyer + deHoy) : null,
);

const selectHora = createSelector([selectAhora, selectPersona], (ahora, persona) =>
  persona ? horaLocal(ahora, persona.zonaHoraria) : 12,
);

export const selectEstadoDeZum = createSelector(
  [selectPanalDeHoy, selectRacha, selectHora],
  (resumen, racha, hora) =>
    resumen && racha ? estadoDeZum(resumen, racha, { hora }) : "esperando",
);

/** El panal de constancia y lo que se cuenta en él, sin los días por venir. */
export const selectConstancia = createSelector([selectPanal, selectAjustes], (panal, ajustes) => {
  if (!panal || !ajustes) return null;
  const semanas = constanciaDe(panal.celdasLlenas, ajustes, panal.hoy);
  const dias = semanas.flat().filter((dia) => !dia.futuro);
  return {
    semanas,
    dias,
    conCeldas: dias.filter((dia) => dia.llenas > 0).length,
    cerrados: dias.filter((dia) => dia.nivel === 3).length,
  };
});

/** Las colmenas en marcha: ni archivadas ni cerradas, con su enjambre pintado. */
export const selectColmenasActivas = createSelector([selectListaDeColmenas], (respuesta) =>
  (respuesta?.colmenas ?? [])
    .filter((colmena) => !colmena.archivadaEn && !colmena.avance.cerrada)
    .map((colmena) => ({ ...colmena, ...pintarColmena(colmena) })),
);
