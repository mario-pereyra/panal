import { createSlice } from "@reduxjs/toolkit";
import { recuerdo } from "../../lib/almacen.js";

/** Cerrada hoy, la franja de la racha no vuelve a aparecer al recargar. */
export const recuerdoDeFranja = recuerdo(
  "panal:franja-cerrada",
  (estado) => estado.hoy.franjaCerradaEl,
);

/**
 * Lo que solo existe en la pantalla "Hoy": el día en que se cerró la franja de
 * la racha. Cerrada, no vuelve hasta que haya una franja de otro día.
 */
const hoySlice = createSlice({
  name: "hoy",
  initialState: () => ({ franjaCerradaEl: recuerdoDeFranja.leido() }),
  reducers: {
    cerrarFranja(estado, accion) {
      estado.franjaCerradaEl = accion.payload;
    },
  },
});

export const { cerrarFranja } = hoySlice.actions;
export default hoySlice.reducer;
