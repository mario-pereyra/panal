import { permisosSobreColmena } from "@panal/contratos";
import { CUADROS_POR_COLMENA, diaLogico, gotasDeCelda, umbralDeCuadro } from "@panal/motor";
import { createSelector } from "@reduxjs/toolkit";
import { selectDetalleDeColmena, selectListaDeColmenas, selectYo } from "../../store/api.js";
import { COLOR_DE_QUIEN_SALIO, pintarAbeja, pintarColmena } from "../../nucleo/panal/abejas.js";
import { permisosDe } from "../../nucleo/panal/filas.js";
import { detalleDeCelda } from "./textos.js";

const selectLista = (estado) => selectListaDeColmenas(estado)?.colmenas;

export const selectPestanaDeColmena = (estado) => estado.colmenas.pestanaDeColmena;

const resumen = (colmena) => ({ ...colmena, ...pintarColmena(colmena) });

export const selectColmenar = createSelector([selectLista], (lista) =>
  (lista ?? []).filter((colmena) => colmena.avance.cerrada).map(resumen),
);

/** Las archivadas sin llenar: fuera de la vista, pero su fundadora las puede recuperar. */
export const selectColmenasArchivadas = createSelector([selectLista], (lista) =>
  (lista ?? []).filter((colmena) => colmena.archivadaEn && !colmena.avance.cerrada),
);

export const selectColmena = createSelector([selectDetalleDeColmena, selectYo], (detalle, yo) => {
  if (!detalle) return null;
  const { colmena, enjambre, actividades, hoy } = detalle;
  const zona = yo?.zonaHoraria;
  const abejas = new Map(
    enjambre.map((abeja) => [
      abeja.id,
      {
        ...pintarAbeja(abeja),
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
    const vencida = Boolean(!llena && actividad.vence && actividad.vence < hoy);
    return {
      id: actividad.id,
      titulo: actividad.titulo,
      detalle: detalleDeCelda({
        llena,
        quien,
        asignada,
        mia,
        llenadaEl: actividad.llenadaEl,
        vence: actividad.vence,
      }),
      prioridad: actividad.prioridad,
      vence: actividad.vence,
      vencida,
      colmenaId: colmena.id,
      llena,
      celdaId: actividad.celdaId,
      mia,
      libre,
      // Solo quien la llenó la puede deshacer; vacía, la llena su abeja o cualquiera si está libre.
      sePuedeTocar: !cerrada && (llena ? actividad.llenaPor === miId : mia || libre),
      permisos: permisosDe(actividad, { miId, hoy }),
      gotas: gotasDeCelda({ tipo: "unica", prioridad: actividad.prioridad, vencida }),
      color: llena ? (quien?.color ?? COLOR_DE_QUIEN_SALIO) : null,
      inicial: quien?.inicial ?? null,
    };
  });

  return {
    hoy,
    ...colmena,
    cerrada,
    permisos: permisosSobreColmena(
      { fundadoraId: colmena.fundadoraId, archivada: Boolean(colmena.archivadaEn) },
      { personaId: miId, abejas: enjambre.length },
    ),
    pedirEnjambre: enjambre.length === 1 && !cerrada,
    miId,
    enjambre: [...abejas.values()],
    cuadros: Array.from({ length: CUADROS_POR_COLMENA }, (_, indice) =>
      filas
        .slice(umbralDeCuadro(indice, filas.length), umbralDeCuadro(indice + 1, filas.length))
        .map(({ id, color, inicial }) => ({ id, color, inicial })),
    ),
    filas,
  };
});

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
