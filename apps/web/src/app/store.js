import { configureStore } from "@reduxjs/toolkit";
import { panalApi } from "../api/panalApi.js";
import relojReducer from "../feature/reloj/relojSlice.js";

/**
 * El store de Panal.
 *
 * - `api`: lo que es verdad en el servidor (RTK Query).
 * - `reloj`: la hora, para que los selectores no la lean por su cuenta.
 *
 * Los demás slices (sesión, interfaz, celebraciones…) se suman con sus pantallas.
 */
export const store = configureStore({
  reducer: {
    [panalApi.reducerPath]: panalApi.reducer,
    reloj: relojReducer,
  },
  middleware: (porDefecto) => porDefecto().concat(panalApi.middleware),
});
