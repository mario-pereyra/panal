import { createSlice } from "@reduxjs/toolkit";
import { leer } from "../../app/almacen.js";

export const CLAVE_DE_FRANJA = "panal:franja-cerrada";

/**
 * Lo que solo existe en la pantalla "Hoy": el día en que se cerró la franja de
 * la racha. Cerrada, no vuelve hasta que haya una franja de otro día.
 */
const hoySlice = createSlice({
  name: "hoy",
  initialState: () => ({ franjaCerradaEl: leer(CLAVE_DE_FRANJA) }),
  reducers: {
    cerrarFranja(estado, accion) {
      estado.franjaCerradaEl = accion.payload;
    },
  },
});

export const { cerrarFranja } = hoySlice.actions;
export default hoySlice.reducer;
