import { createSlice } from "@reduxjs/toolkit";
import { recuerdo } from "../../lib/almacen.js";

/** La preferencia de movimiento es de este dispositivo, no de la cuenta. */
export const recuerdoDeMovimiento = recuerdo("panal:movimiento", (estado) =>
  estado.preferencias.movimiento === "reducido" ? "reducido" : null,
);

const preferenciasSlice = createSlice({
  name: "preferencias",
  initialState: () => ({
    movimiento: recuerdoDeMovimiento.leido() === "reducido" ? "reducido" : "sistema",
  }),
  reducers: {
    elegirMovimiento(estado, accion) {
      estado.movimiento = accion.payload;
    },
  },
});

export const { elegirMovimiento } = preferenciasSlice.actions;
export default preferenciasSlice.reducer;
