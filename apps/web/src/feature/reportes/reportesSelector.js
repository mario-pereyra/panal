import { lunesDe, sumarDias } from "@panal/motor";
import { createSelector } from "@reduxjs/toolkit";
import { selectPanal, selectReporte as selectReporteDelRango } from "../../store/api.js";
import { pintarAbeja } from "../../nucleo/panal/abejas.js";
import { selectConstancia } from "../../nucleo/panal/panalSelector.js";
import { diaConNombre, fechaCorta } from "../../lib/formato.js";
import { cumplimiento, ESTADO_DEL_DIA, TIPOS } from "./textos.js";

/** El servidor cuenta; aquí solo se da forma a lo que muestran las gráficas. */

export const selectPeriodo = (estado) => estado.reportes.periodo;

export const selectRangoDelPeriodo = createSelector(
  [selectPanal, selectPeriodo],
  (panal, periodo) => {
    const hoy = panal?.hoy;
    if (!hoy) return null;
    if (periodo === "mes") return { desde: sumarDias(hoy, -29), hasta: hoy };
    if (periodo === "trimestre") return { desde: sumarDias(hoy, -89), hasta: hoy };
    return { desde: lunesDe(hoy), hasta: hoy };
  },
);

const selectReporte = (estado) => selectReporteDelRango(estado, selectRangoDelPeriodo(estado));

export const selectTablaDeConstancia = createSelector([selectConstancia], (constancia) =>
  (constancia?.dias ?? []).map((dia) => [diaConNombre(dia.dia), dia.llenas]),
);

/**
 * Celdas por día, sin los días anteriores a la cuenta: con menos de una
 * semana de uso se ven solo los días que hay.
 */
export const selectCeldasPorDia = createSelector(
  [selectReporte, selectPanal, selectPeriodo],
  (reporte, panal, periodo) => {
    if (!reporte) return null;
    const desde = panal?.persona.creadaEl ?? reporte.desde;
    const dias = reporte.celdasPorDia.filter((dia) => dia.dia >= desde);
    const total = dias.reduce((suma, dia) => suma + dia.llenas, 0);
    // La semana se dibuja entera, de lunes a domingo: los días por venir, sin celdas.
    const porVenir = [];
    if (periodo === "semana" && dias.length > 0) {
      const domingo = sumarDias(lunesDe(dias[0].dia), 6);
      for (let dia = sumarDias(dias.at(-1).dia, 1); dia <= domingo; dia = sumarDias(dia, 1)) {
        porVenir.push({ dia, llenas: 0, futuro: true });
      }
    }
    return { dias, semana: [...dias, ...porVenir], total, anterior: reporte.periodoAnterior };
  },
);

export const selectTablaDeCeldasPorDia = createSelector(
  [selectCeldasPorDia, selectPeriodo],
  (porDia, periodo) =>
    (porDia?.dias ?? []).map((dia) => [
      periodo === "semana" ? diaConNombre(dia.dia) : fechaCorta(dia.dia),
      dia.llenas,
    ]),
);

export const selectCumplimientoPorRonda = createSelector([selectReporte], (reporte) =>
  (reporte?.rondas ?? []).map((ronda) => ({
    ...ronda,
    tocabaAlgunDia: ronda.dias.some((dia) => dia.tocaba),
  })),
);

const estadoDelDia = (dia) => {
  if (dia.llena) return ESTADO_DEL_DIA.llena;
  return dia.tocaba ? ESTADO_DEL_DIA.pendiente : ESTADO_DEL_DIA.noTocaba;
};

/** Todas las rondas traen la misma tira de siete días: la primera da las columnas. */
export const selectTablaDeRondas = createSelector([selectCumplimientoPorRonda], (rondas) => ({
  dias: (rondas[0]?.dias ?? []).map((dia) => diaConNombre(dia.dia)),
  filas: rondas.map((ronda) => [
    ronda.titulo,
    ...ronda.dias.map(estadoDelDia),
    cumplimiento(ronda),
  ]),
}));

export const selectRepartoPorTipo = createSelector([selectReporte], (reporte) =>
  reporte
    ? [
        { nombre: TIPOS.unicas, cantidad: reporte.reparto.unicas },
        { nombre: TIPOS.recurrentes, cantidad: reporte.reparto.recurrentes },
      ]
    : null,
);

export const selectAportePorColmena = createSelector([selectReporte], (reporte) =>
  (reporte?.colmenas ?? []).map((colmena) => {
    const total = colmena.aportes.reduce((suma, abeja) => suma + abeja.celdas, 0);
    return {
      ...colmena,
      total,
      aportes: colmena.aportes.map((abeja) => ({
        ...pintarAbeja(abeja),
        parte: total > 0 ? abeja.celdas / total : 0,
      })),
    };
  }),
);

export const selectSinHistorial = createSelector(
  [selectPanal, selectCeldasPorDia],
  (panal, porDia) =>
    Boolean(panal) && panal.celdasLlenas.length === 0 && (porDia?.total ?? 0) === 0,
);
