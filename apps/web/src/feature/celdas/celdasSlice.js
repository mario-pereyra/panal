import { createSlice } from "@reduxjs/toolkit";

/**
 * Los filtros de la lista de celdas. La pestaña no vive aquí: va en la
 * dirección (`/celdas?ver=proximas`), para que se pueda compartir y volver con Atrás.
 */
const celdasSlice = createSlice({
  name: "celdas",
  initialState: () => ({
    filtros: { colmena: "todas", prioridad: "todas" },
  }),
  reducers: {
    filtrarPorColmena(estado, accion) {
      estado.filtros.colmena = accion.payload;
    },
    filtrarPorPrioridad(estado, accion) {
      estado.filtros.prioridad = accion.payload;
    },
    quitarFiltros(estado) {
      estado.filtros = { colmena: "todas", prioridad: "todas" };
    },
  },
});

export const { filtrarPorColmena, filtrarPorPrioridad, quitarFiltros } = celdasSlice.actions;
export default celdasSlice.reducer;
