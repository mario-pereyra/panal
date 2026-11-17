import {
  avanceDeColmena,
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
import { panalApi } from "../../api/panalApi.js";
import { colorDeAbeja } from "../../componentes/textos.js";
import { textoDeFranja } from "./textos.js";
import { selectAhora } from "../reloj/relojSelector.js";

/**
 * Selectores de "Hoy". Las pantallas no calculan nada: leen estos selectores
 * memorizados, que combinan el caché de la API con las reglas del motor.
 *
 * El servidor manda lo calculado hasta ayer (`progreso`); el paso de hoy lo da
 * el navegador con las mismas funciones, así la pantalla cambia al instante.
 */

const selectConsultaDelPanal = panalApi.endpoints.obtenerPanal.select();

/** Lo que respondió el servidor, o `undefined` mientras carga. */
export const selectPanal = (estado) => selectConsultaDelPanal(estado).data;

export const selectPersona = (estado) => selectPanal(estado)?.persona;

/** Las actividades que tocan hoy, cada una con su celda si ya está llena. */
export const selectCeldasDeHoy = createSelector([selectPanal], (panal) => {
  if (!panal) return [];
  const { hoy, actividades, celdasLlenas } = panal;
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
        prioridad: actividad.prioridad,
        regla: actividad.regla,
        vence: actividad.vence,
        venceHoy: actividad.vence === hoy,
        vencida,
        colmenaId: actividad.colmenaId,
        colmena: actividad.colmena?.nombre ?? null,
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

/** La colmena con actividad más reciente: avance, celdas con color y aporte por abeja. */
export const selectResumenColmenaActiva = createSelector([selectPanal], (panal) => {
  const colmena = panal?.colmena;
  if (!colmena) return null;

  const avance = avanceDeColmena(colmena.celdas);
  const colorDe = new Map(
    colmena.integrantes.map((abeja) => [abeja.id, colorDeAbeja(abeja.color)]),
  );
  const aporteDe = new Map(avance.aportes.map((aporte) => [aporte.personaId, aporte.celdas]));

  return {
    id: colmena.id,
    nombre: colmena.nombre,
    ...avance,
    otras: Math.max(0, panal.colmenasActivas - 1),
    celdas: colmena.celdas.map((celda) => ({
      id: celda.actividadId,
      color: celda.llenaPor ? (colorDe.get(celda.llenaPor) ?? "var(--lino-borde)") : null,
    })),
    integrantes: colmena.integrantes.map((abeja) => ({
      id: abeja.id,
      nombre: abeja.nombre,
      color: colorDe.get(abeja.id),
      celdas: aporteDe.get(abeja.id) ?? 0,
    })),
  };
});

/** El panal de constancia de las últimas cinco semanas. */
export const selectConstancia = createSelector([selectPanal, selectAjustes], (panal, ajustes) =>
  panal && ajustes ? constanciaDe(panal.celdasLlenas, ajustes, panal.hoy) : [],
);

/** La franja de la racha sobre la tarjeta principal, si hay una y no se cerró hoy. */
export const selectFranjaDeHoy = createSelector(
  [selectPanal, selectRacha, (estado) => estado.hoy.franjaCerradaEl],
  (panal, racha, cerradaEl) => {
    if (!panal || !racha || cerradaEl === panal.hoy) return null;
    const texto = textoDeFranja(racha);
    return texto ? { texto, tono: racha.perdidaAyer > 0 ? "ala" : "cera" } : null;
  },
);
