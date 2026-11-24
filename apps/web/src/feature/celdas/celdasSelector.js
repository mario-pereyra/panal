import { DIAS_DE_HECHAS } from "@panal/contratos";
import { agruparPor, avanceDeLaSemana, reglaToca, sumarDias, vivaEl } from "@panal/motor";
import { createSelector } from "@reduxjs/toolkit";
import { selectActividades, selectPanal } from "../../store/api.js";
import { filaDeActividad } from "../../nucleo/panal/filas.js";
import { selectCeldasDeHoy } from "../../nucleo/panal/panalSelector.js";
import { cuandoEs } from "../../nucleo/textos.js";
import { MAS_ADELANTE } from "./textos.js";

/** Días hacia adelante que mira la pestaña "Próximas". */
const DIAS_DE_HORIZONTE = 7;

export const PESTANAS = ["hoy", "proximas", "recurrentes", "hechas", "archivadas"];

const selectActivas = (estado) => selectActividades(estado, "activas");
const selectHechas = (estado) => selectActividades(estado, "hechas");
const selectArchivadas = (estado) => selectActividades(estado, "archivadas");

export const selectFiltrosDeCeldas = (estado) => estado.celdas.filtros;

/** Las colmenas que aparecen en mis actividades, para el filtro. */
export const selectColmenasDeCeldas = createSelector([selectActivas], (lista) => {
  const colmenas = new Map();
  for (const actividad of lista?.actividades ?? []) {
    if (actividad.colmena) colmenas.set(actividad.colmena.id, actividad.colmena.nombre);
  }
  return [...colmenas].map(([id, nombre]) => ({ id, nombre }));
});

function pasaLosFiltros(actividad, filtros) {
  if (filtros.prioridad === "alta" && actividad.prioridad !== "alta") return false;
  if (filtros.colmena === "personales") return !actividad.colmenaId;
  if (filtros.colmena !== "todas") return actividad.colmenaId === filtros.colmena;
  return true;
}

/** Lo que toca un día que no es hoy: únicas que vencen ese día y recurrentes de días fijos. */
function tocaElDia(actividad, dia) {
  if (actividad.tipo === "unica") return actividad.vence === dia;
  const { clase } = actividad.regla ?? {};
  if (clase !== "dias" && clase !== "mes") return false;
  return vivaEl(actividad, dia) && reglaToca(actividad.regla, dia);
}

/**
 * Las pestañas, ya filtradas, con sus conteos. Cada pestaña es una lista de
 * grupos de filas; solo los de "Próximas" llevan título.
 */
export const selectCeldasPorPestana = createSelector(
  [
    selectCeldasDeHoy,
    selectActivas,
    selectHechas,
    selectArchivadas,
    selectPanal,
    selectFiltrosDeCeldas,
  ],
  (deHoy, activas, hechas, archivadas, panal, filtros) => {
    const hoy = panal?.hoy ?? activas?.hoy;
    const quien = { miId: panal?.persona.id, hoy };
    const lista = (activas?.actividades ?? []).filter((actividad) =>
      pasaLosFiltros(actividad, filtros),
    );
    const hechosDe = agruparPor(panal?.celdasLlenas ?? [], (celda) => celda.actividadId);

    const filasDeHoy = deHoy.filter((fila) => pasaLosFiltros(fila, filtros));

    const proximas = [];
    if (hoy) {
      for (let salto = 1; salto <= DIAS_DE_HORIZONTE; salto += 1) {
        const dia = sumarDias(hoy, salto);
        const filas = lista
          .filter((actividad) => tocaElDia(actividad, dia))
          .map((actividad) => filaDeActividad(actividad, quien));
        if (filas.length > 0) proximas.push({ dia, titulo: cuandoEs(dia, hoy), filas });
      }
      const masAdelante = lista
        .filter(
          (actividad) =>
            actividad.tipo === "unica" && actividad.vence > sumarDias(hoy, DIAS_DE_HORIZONTE),
        )
        .sort((a, b) => a.vence.localeCompare(b.vence))
        .map((actividad) => filaDeActividad(actividad, quien));
      if (masAdelante.length > 0)
        proximas.push({ dia: "despues", titulo: MAS_ADELANTE, filas: masAdelante });
    }

    const recurrentes = lista
      .filter((actividad) => actividad.tipo === "recurrente")
      .map((actividad) => {
        const semana = hoy
          ? avanceDeLaSemana(actividad, hechosDe.get(actividad.id) ?? [], hoy)
          : null;
        return filaDeActividad(actividad, quien, { semana });
      });

    // Lo que llené los últimos días, por día, para poder deshacerlo. Las únicas
    // terminadas ya no están entre las activas: vienen en "hechas".
    const porId = new Map(
      [...(activas?.actividades ?? []), ...(hechas?.actividades ?? [])].map((actividad) => [
        actividad.id,
        actividad,
      ]),
    );
    const gruposDeHechas = [];
    if (hoy) {
      const desde = sumarDias(hoy, -DIAS_DE_HECHAS);
      const llenas = (panal?.celdasLlenas ?? []).filter(
        (celda) => celda.dia >= desde && celda.dia < hoy,
      );
      const porDia = [...agruparPor(llenas, (celda) => celda.dia)].sort(([a], [b]) =>
        b.localeCompare(a),
      );
      for (const [dia, celdas] of porDia) {
        const filas = celdas.flatMap((celda) => {
          const actividad = porId.get(celda.actividadId);
          if (!actividad || !pasaLosFiltros(actividad, filtros)) return [];
          return [
            filaDeActividad(actividad, quien, {
              llena: true,
              celdaId: celda.id,
              gotas: celda.gotas,
            }),
          ];
        });
        if (filas.length > 0) gruposDeHechas.push({ dia, titulo: cuandoEs(dia, hoy), filas });
      }
    }

    const filasArchivadas = (archivadas?.actividades ?? [])
      .filter((actividad) => pasaLosFiltros(actividad, filtros))
      .map((actividad) => filaDeActividad(actividad, quien, { gotas: null }));

    return {
      grupos: {
        hoy: [{ filas: filasDeHoy }],
        proximas,
        recurrentes: [{ filas: recurrentes }],
        hechas: gruposDeHechas,
        archivadas: [{ filas: filasArchivadas }],
      },
      conteos: {
        hoy: filasDeHoy.length,
        proximas: proximas.reduce((suma, grupo) => suma + grupo.filas.length, 0),
        recurrentes: recurrentes.length,
        hechas: hechas
          ? gruposDeHechas.reduce((suma, grupo) => suma + grupo.filas.length, 0)
          : null,
        archivadas: archivadas ? filasArchivadas.length : null,
      },
    };
  },
);

export const selectHayFiltros = createSelector(
  [selectFiltrosDeCeldas],
  (filtros) => filtros.colmena !== "todas" || filtros.prioridad !== "todas",
);
