import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import actividadReducer from "../feature/actividad/actividadSlice.js";
import celdasReducer from "../feature/celdas/celdasSlice.js";
import colmenasReducer from "../feature/colmenas/colmenasSlice.js";
import hoyReducer, { recuerdoDeFranja } from "../feature/hoy/hoySlice.js";
import miVueloReducer from "../feature/miVuelo/miVueloSlice.js";
import primerVueloReducer, {
  recuerdoDelPrimerVuelo,
} from "../feature/primerVuelo/primerVueloSlice.js";
import reportesReducer from "../feature/reportes/reportesSlice.js";
import { recordarEnElNavegador } from "../lib/almacen.js";
import avisosReducer from "../nucleo/avisos/avisosSlice.js";
import celebracionesReducer from "../nucleo/celebraciones/celebracionesSlice.js";
import conexionReducer from "../nucleo/conexion/conexionSlice.js";
import cuentaReducer, { recuerdoDeInvitacion } from "../nucleo/cuenta/cuentaSlice.js";
import preferenciasReducer, {
  recuerdoDeMovimiento,
} from "../nucleo/preferencias/preferenciasSlice.js";
import relojReducer from "../nucleo/reloj/relojSlice.js";
import { panalApi } from "./api.js";

/**
 * El store de Panal (docs/proyecto/05-datos-y-api.md, sección 6).
 *
 * - `api`: lo que es verdad en el servidor (RTK Query, `store/api.js`).
 * - `nucleo/`: el estado que comparten varias pantallas.
 * - `feature/`: un slice por pantalla con lo que solo existe en ella.
 */
export function crearStore() {
  const store = configureStore({
    reducer: {
      [panalApi.reducerPath]: panalApi.reducer,
      cuenta: cuentaReducer,
      reloj: relojReducer,
      avisos: avisosReducer,
      conexion: conexionReducer,
      celebraciones: celebracionesReducer,
      preferencias: preferenciasReducer,
      hoy: hoyReducer,
      celdas: celdasReducer,
      actividad: actividadReducer,
      colmenas: colmenasReducer,
      reportes: reportesReducer,
      miVuelo: miVueloReducer,
      primerVuelo: primerVueloReducer,
    },
    middleware: (porDefecto) => porDefecto().concat(panalApi.middleware),
  });
  setupListeners(store.dispatch);
  recordarEnElNavegador(store, [
    recuerdoDeInvitacion,
    recuerdoDeMovimiento,
    recuerdoDeFranja,
    recuerdoDelPrimerVuelo,
  ]);
  return store;
}

export const store = crearStore();
