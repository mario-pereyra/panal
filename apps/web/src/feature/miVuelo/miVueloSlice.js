import { createSlice } from "@reduxjs/toolkit";
import { leer } from "../../app/almacen.js";

export const CLAVE_DE_MOVIMIENTO = "panal:movimiento";

const movimientoGuardado = () =>
  leer(CLAVE_DE_MOVIMIENTO) === "reducido" ? "reducido" : "sistema";

/**
 * Lo que solo vive en la pantalla "Mi vuelo": el sello abierto y la
 * preferencia de movimiento, que es de este dispositivo y no del servidor.
 */
const miVueloSlice = createSlice({
  name: "miVuelo",
  initialState: () => ({ selloAbierto: null, movimiento: movimientoGuardado() }),
  reducers: {
    abrirSello(estado, accion) {
      estado.selloAbierto = accion.payload;
    },
    cerrarSello(estado) {
      estado.selloAbierto = null;
    },
    elegirMovimiento(estado, accion) {
      estado.movimiento = accion.payload;
    },
  },
});

export const { abrirSello, cerrarSello, elegirMovimiento } = miVueloSlice.actions;
export default miVueloSlice.reducer;
