import { createSlice } from "@reduxjs/toolkit";

/** Qué celdas de la colmena se están mirando en su detalle. */
const colmenasSlice = createSlice({
  name: "colmenas",
  initialState: () => ({ pestanaDeColmena: "pendientes" }),
  reducers: {
    elegirPestanaDeColmena(estado, accion) {
      estado.pestanaDeColmena = accion.payload;
    },
  },
});

export const { elegirPestanaDeColmena } = colmenasSlice.actions;
export default colmenasSlice.reducer;
