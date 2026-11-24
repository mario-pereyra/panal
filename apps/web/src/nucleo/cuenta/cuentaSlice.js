import { createSlice } from "@reduxjs/toolkit";
import { recuerdo } from "../../lib/almacen.js";

/** La invitación pendiente se recuerda mientras dure la pestaña, aunque se recargue. */
export const recuerdoDeInvitacion = recuerdo(
  "panal:invitacion",
  (estado) => estado.cuenta.invitacionPendiente,
  "sesion",
);

/**
 * La cuenta en el navegador. Quién soy lo sabe el caché de la API (`obtenerYo`);
 * aquí queda la invitación abierta sin sesión, que espera a que la persona entre
 * o cree su panal.
 */
const cuentaSlice = createSlice({
  name: "cuenta",
  initialState: () => ({ invitacionPendiente: recuerdoDeInvitacion.leido() }),
  reducers: {
    guardarInvitacion(estado, accion) {
      estado.invitacionPendiente = accion.payload;
    },
    olvidarInvitacion(estado) {
      estado.invitacionPendiente = null;
    },
  },
});

export const { guardarInvitacion, olvidarInvitacion } = cuentaSlice.actions;
export default cuentaSlice.reducer;
