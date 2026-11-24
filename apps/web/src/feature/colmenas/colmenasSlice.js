import { createSlice } from "@reduxjs/toolkit";

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
