import { createSlice } from "@reduxjs/toolkit";

/** El periodo que se mira en Reportes. */
const reportesSlice = createSlice({
  name: "reportes",
  initialState: () => ({ periodo: "semana" }),
  reducers: {
    elegirPeriodo(estado, accion) {
      estado.periodo = accion.payload;
    },
  },
});

export const { elegirPeriodo } = reportesSlice.actions;
export default reportesSlice.reducer;
