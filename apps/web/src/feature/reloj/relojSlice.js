import { createSlice } from "@reduxjs/toolkit";

/**
 * El reloj de la aplicación. Los selectores no pueden leer la hora por su cuenta
 * (dejarían de ser predecibles), así que "ahora" es un dato más del store.
 */
const relojSlice = createSlice({
  name: "reloj",
  initialState: () => ({ ahora: Date.now() }),
  reducers: {
    marcarAhora(estado, accion) {
      estado.ahora = accion.payload;
    },
  },
});

export const { marcarAhora } = relojSlice.actions;
export default relojSlice.reducer;
