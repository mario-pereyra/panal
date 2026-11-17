import { createSlice } from "@reduxjs/toolkit";
import { leer } from "../../app/almacen.js";

/** Dónde se recuerda una invitación abierta sin sesión, mientras dura la pestaña. */
export const CLAVE_DE_INVITACION = "panal:invitacion";

/**
 * La sesión en la pantalla. Quién soy lo sabe el caché de la API (`obtenerYo`);
 * aquí queda lo que solo existe en el navegador: la invitación que espera a que
 * la persona entre o cree su panal.
 */
const sesionSlice = createSlice({
  name: "sesion",
  initialState: () => ({ invitacionPendiente: leer(CLAVE_DE_INVITACION, "sesion") }),
  reducers: {
    guardarInvitacion(estado, accion) {
      estado.invitacionPendiente = accion.payload;
    },
    olvidarInvitacion(estado) {
      estado.invitacionPendiente = null;
    },
  },
});

export const { guardarInvitacion, olvidarInvitacion } = sesionSlice.actions;
export default sesionSlice.reducer;
