import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { panalApi } from "../api/panalApi.js";
import actividadReducer from "../feature/actividad/actividadSlice.js";
import avisosReducer from "../feature/avisos/avisosSlice.js";
import celdasReducer from "../feature/celdas/celdasSlice.js";
import celebracionesReducer from "../feature/celebraciones/celebracionesSlice.js";
import colmenasReducer from "../feature/colmenas/colmenasSlice.js";
import conexionReducer from "../feature/conexion/conexionSlice.js";
import hoyReducer from "../feature/hoy/hoySlice.js";
import miVueloReducer from "../feature/miVuelo/miVueloSlice.js";
import primerVueloReducer from "../feature/primerVuelo/primerVueloSlice.js";
import relojReducer from "../feature/reloj/relojSlice.js";
import reportesReducer from "../feature/reportes/reportesSlice.js";
import sesionReducer from "../feature/sesion/sesionSlice.js";
import { escuchas } from "./escuchas.js";

/**
 * El store de Panal (docs/proyecto/05-datos-y-api.md, sección 6).
 *
 * - `api`: lo que es verdad en el servidor (RTK Query).
 * - Un slice por funcionalidad con lo que solo existe en la pantalla: la
 *   pestaña, los filtros, un borrador, la cola de logros, los avisos, la red.
 * - `reloj`: la hora, para que los selectores no la lean por su cuenta.
 */
export function crearStore() {
  const store = configureStore({
    reducer: {
      [panalApi.reducerPath]: panalApi.reducer,
      sesion: sesionReducer,
      hoy: hoyReducer,
      celdas: celdasReducer,
      actividad: actividadReducer,
      colmenas: colmenasReducer,
      reportes: reportesReducer,
      miVuelo: miVueloReducer,
      primerVuelo: primerVueloReducer,
      celebraciones: celebracionesReducer,
      avisos: avisosReducer,
      conexion: conexionReducer,
      reloj: relojReducer,
    },
    middleware: (porDefecto) =>
      porDefecto().prepend(escuchas.middleware).concat(panalApi.middleware),
  });
  // Volver a la pestaña o recuperar la red pone al día lo que se ve.
  setupListeners(store.dispatch);
  return store;
}

export const store = crearStore();
