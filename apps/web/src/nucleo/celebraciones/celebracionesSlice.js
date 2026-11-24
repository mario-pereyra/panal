import { createSlice } from "@reduxjs/toolkit";

/**
 * Logros por mostrar. Los encola quien llena una celda (`nucleo/panal/useCelda.js`)
 * con lo que respondió el servidor; la ventana de celebración los muestra
 * juntos y vacía la cola al cerrarse.
 */
const celebracionesSlice = createSlice({
  name: "celebraciones",
  initialState: () => ({ cola: [] }),
  reducers: {
    encolarCelebraciones(estado, accion) {
      estado.cola.push(...accion.payload);
    },
    vaciarCelebraciones(estado) {
      estado.cola = [];
    },
  },
});

export const { encolarCelebraciones, vaciarCelebraciones } = celebracionesSlice.actions;
export default celebracionesSlice.reducer;
