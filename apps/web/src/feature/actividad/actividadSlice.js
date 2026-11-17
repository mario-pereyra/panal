import { createSlice } from "@reduxjs/toolkit";

/**
 * Borradores del formulario de actividad: lo escrito se guarda mientras se
 * escribe. Si la ventana se cierra sin querer o el guardado falla, al volver
 * a abrirla está todo como se dejó. La clave es el identificador de la
 * actividad, o "nueva".
 */
const actividadSlice = createSlice({
  name: "actividad",
  initialState: () => ({ borradores: {} }),
  reducers: {
    guardarBorrador(estado, accion) {
      const { clave, valores } = accion.payload;
      estado.borradores[clave] = valores;
    },
    descartarBorrador(estado, accion) {
      delete estado.borradores[accion.payload];
    },
  },
});

export const { guardarBorrador, descartarBorrador } = actividadSlice.actions;
export default actividadSlice.reducer;
