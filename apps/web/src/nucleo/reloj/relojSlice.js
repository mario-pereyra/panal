import { diaLogico } from "@panal/motor";
import { createSlice } from "@reduxjs/toolkit";
import { panalApi, selectYo } from "../../store/api.js";

/**
 * El reloj de la aplicación. Los selectores no pueden leer la hora por su cuenta
 * (dejarían de ser predecibles), así que "ahora" es un dato más del store.
 */
const relojSlice = createSlice({
  name: "reloj",
  initialState: () => ({ ahora: Date.now() }),
  reducers: {
    marcarAhora(estado, accion) {
      estado.ahora = accion.payload;
    },
  },
});

const { marcarAhora } = relojSlice.actions;
export default relojSlice.reducer;

const DEPENDE_DEL_DIA = ["Panal", "Actividades", "Colmenas", "Progreso", "Reporte"];

/** Si con la aplicación abierta pasan las 03:00, cambia el día de Panal y se vuelve a pedir lo que depende de "hoy". */
export const ponerEnHora = (ahora) => (dispatch, getState) => {
  const antes = getState().reloj.ahora;
  dispatch(marcarAhora(ahora));
  const zona = selectYo(getState())?.zonaHoraria;
  if (zona && diaLogico(antes, zona) !== diaLogico(ahora, zona)) {
    dispatch(panalApi.util.invalidateTags(DEPENDE_DEL_DIA));
  }
};
