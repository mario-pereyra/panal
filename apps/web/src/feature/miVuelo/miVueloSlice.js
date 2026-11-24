import { createSlice } from "@reduxjs/toolkit";

const miVueloSlice = createSlice({
  name: "miVuelo",
  initialState: () => ({ selloAbierto: null }),
  reducers: {
    abrirSello(estado, accion) {
      estado.selloAbierto = accion.payload;
    },
    cerrarSello(estado) {
      estado.selloAbierto = null;
    },
  },
});

export const { abrirSello, cerrarSello } = miVueloSlice.actions;
export default miVueloSlice.reducer;
