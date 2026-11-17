import { diaLogico, gotasDeCelda } from "@panal/motor";
import { createSelector } from "@reduxjs/toolkit";
import { panalApi } from "../../api/panalApi.js";
import { colorDeAbeja, fechaCorta } from "../../componentes/textos.js";
import { selectYo } from "../sesion/sesionSelector.js";

/**
 * Selectores de Colmenas (P07), Colmena (P08) e Invitar (P09).
 */

const selectListaDeColmenas = (estado) =>
  panalApi.endpoints.obtenerColmenas.select()(estado).data?.colmenas;
const selectDetalle = (estado, id) => panalApi.endpoints.obtenerColmena.select(id)(estado).data;

export const selectPestanaDeColmena = (estado) => estado.colmenas.pestanaDeColmena;

/** Celdas de una colmena con el color de quien las llenó. */
function celdasConColor(colmena) {
  const colorDe = new Map(
    colmena.integrantes.map((abeja) => [abeja.id, colorDeAbeja(abeja.color)]),
  );
  return colmena.celdas.map((celda) => ({
    id: celda.actividadId,
    color: celda.llenaPor ? (colorDe.get(celda.llenaPor) ?? "var(--lino-borde)") : null,
  }));
}

function resumen(colmena) {
  return {
    ...colmena,
    integrantes: colmena.integrantes.map((abeja) => ({
      ...abeja,
      color: colorDeAbeja(abeja.color),
    })),
    celdasConColor: celdasConColor(colmena),
  };
}

/** Las colmenas en marcha: no archivadas y sin cerrar. */
export const selectColmenasActivas = createSelector([selectListaDeColmenas], (lista) =>
  (lista ?? []).filter((colmena) => !colmena.archivadaEn && !colmena.avance.cerrada).map(resumen),
);

/** El colmenar: las colmenas cerradas al cien por cien. */
export const selectColmenar = createSelector([selectListaDeColmenas], (lista) =>
  (lista ?? []).filter((colmena) => colmena.avance.cerrada).map(resumen),
);

/** El detalle de una colmena, listo para P08. */
export const selectColmena = createSelector([selectDetalle, selectYo], (detalle, yo) => {
  if (!detalle) return null;
  const { colmena, enjambre, actividades, hoy } = detalle;
  const zona = yo?.zonaHoraria;
  const abejas = new Map(
    enjambre.map((abeja) => [
      abeja.id,
      {
        ...abeja,
        color: colorDeAbeja(abeja.color),
        inicial: abeja.nombre.charAt(0).toUpperCase(),
        // El día de llegada en la zona de quien mira, no el de UTC.
        unidaEl: zona ? diaLogico(abeja.unidaEn, zona) : null,
      },
    ]),
  );
  const miId = yo?.id ?? null;
  const cerrada = Boolean(colmena.avance.cerrada || colmena.archivadaEn);

  const filas = actividades.map((actividad) => {
    const quien = actividad.llenaPor ? abejas.get(actividad.llenaPor) : null;
    const asignada = actividad.asignadaA ? abejas.get(actividad.asignadaA) : null;
    const llena = Boolean(actividad.llenaPor);
    const mia = actividad.asignadaA === miId;
    const libre = !actividad.asignadaA;
    let detalle;
    if (llena)
      detalle = `Llenada por ${quien?.nombre ?? "una abeja que ya salió"} el ${fechaCorta(actividad.llenadaEl)}`;
    else if (asignada) detalle = mia ? "Asignada a ti" : `Asignada a ${asignada.nombre}`;
    else detalle = "Libre: la llena quien llegue primero";
    if (actividad.vence && !llena) detalle += ` · vence el ${fechaCorta(actividad.vence)}`;
    return {
      id: actividad.id,
      titulo: actividad.titulo,
      detalle,
      prioridad: actividad.prioridad,
      vence: actividad.vence,
      vencida: Boolean(!llena && actividad.vence && actividad.vence < hoy),
      colmenaId: colmena.id,
      llena,
      celdaId: actividad.celdaId,
      mia,
      libre,
      // Solo quien la llenó la puede deshacer; vacía, la llena su abeja o cualquiera si está libre.
      sePuedeTocar: !cerrada && (llena ? actividad.llenaPor === miId : mia || libre),
      gotas: gotasDeCelda({ tipo: "unica", prioridad: actividad.prioridad }),
      color: quien?.color ?? null,
      inicial: quien?.inicial ?? null,
    };
  });

  return {
    hoy,
    ...colmena,
    soyFundadora: colmena.fundadoraId === miId,
    cerrada,
    miId,
    enjambre: [...abejas.values()],
    celdas: filas.map((fila) => ({ id: fila.id, color: fila.color, inicial: fila.inicial })),
    filas,
  };
});

/** Las celdas de la colmena en la pestaña elegida. */
export const selectCeldasDeColmena = createSelector(
  [selectColmena, selectPestanaDeColmena],
  (colmena, pestana) => {
    if (!colmena) return [];
    switch (pestana) {
      case "mias":
        return colmena.filas.filter((fila) => fila.mia);
      case "libres":
        return colmena.filas.filter((fila) => fila.libre && !fila.llena);
      case "llenas":
        return colmena.filas.filter((fila) => fila.llena);
      default:
        return colmena.filas.filter((fila) => !fila.llena);
    }
  },
);
