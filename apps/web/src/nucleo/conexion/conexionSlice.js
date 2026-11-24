import { createSlice } from "@reduxjs/toolkit";
import { abiertaInstalada, conInstalacionWeb } from "../../../pwa/navegador.js";

// El evento de instalación y el service worker en espera no se pueden guardar en
// el store: los guarda `pwa/registro.js`, y aquí solo queda si existen.

const conexionSlice = createSlice({
  name: "conexion",
  initialState: () => ({
    enLinea: typeof navigator === "undefined" ? true : navigator.onLine,
    instalable: conInstalacionWeb() && !abiertaInstalada(),
    instalada: abiertaInstalada(),
    versionNueva: false,
  }),
  reducers: {
    cambiarConexion(estado, accion) {
      estado.enLinea = accion.payload;
    },
    marcarInstalable(estado, accion) {
      estado.instalable = accion.payload && !estado.instalada;
    },
    marcarInstalada(estado) {
      estado.instalada = true;
      estado.instalable = false;
    },
    marcarVersionNueva(estado) {
      estado.versionNueva = true;
    },
  },
});

export const { cambiarConexion, marcarInstalable, marcarInstalada, marcarVersionNueva } =
  conexionSlice.actions;
export default conexionSlice.reducer;
