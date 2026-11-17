import { lunesDe, sumarDias } from "@panal/motor";
import { createSelector } from "@reduxjs/toolkit";
import { panalApi } from "../../api/panalApi.js";
import { colorDeAbeja } from "../../componentes/textos.js";
import { selectPanal } from "../hoy/hoySelector.js";

/**
 * Selectores de Reportes (P10). El servidor cuenta; aquí solo se da forma
 * a lo que muestran las gráficas.
 */

export const PERIODOS = [
  { valor: "semana", etiqueta: "Esta semana" },
  { valor: "mes", etiqueta: "30 días" },
  { valor: "trimestre", etiqueta: "90 días" },
];

export const selectPeriodo = (estado) => estado.reportes.periodo;

/** Las fechas del periodo elegido, contadas desde hoy. */
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

const selectReporte = (estado) => {
  const rango = selectRangoDelPeriodo(estado);
  return rango ? panalApi.endpoints.obtenerReporte.select(rango)(estado).data : undefined;
};

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

export const selectCumplimientoPorRonda = createSelector(
  [selectReporte],
  (reporte) => reporte?.rondas ?? [],
);

export const selectRepartoPorTipo = createSelector([selectReporte], (reporte) =>
  reporte
    ? [
        { nombre: "Únicas", cantidad: reporte.reparto.unicas },
        { nombre: "Recurrentes", cantidad: reporte.reparto.recurrentes },
      ]
    : [],
);

export const selectAportePorColmena = createSelector([selectReporte], (reporte) =>
  (reporte?.colmenas ?? []).map((colmena) => {
    const total = colmena.aportes.reduce((suma, abeja) => suma + abeja.celdas, 0);
    return {
      ...colmena,
      total,
      aportes: colmena.aportes.map((abeja) => ({
        ...abeja,
        color: colorDeAbeja(abeja.color),
        parte: total > 0 ? abeja.celdas / total : 0,
      })),
    };
  }),
);

/** Si la persona todavía no llenó ninguna celda: Reportes muestra su estado vacío. */
export const selectSinHistorial = createSelector(
  [selectPanal, selectCeldasPorDia],
  (panal, porDia) =>
    Boolean(panal) && panal.celdasLlenas.length === 0 && (porDia?.total ?? 0) === 0,
);
