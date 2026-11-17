import { createSlice } from "@reduxjs/toolkit";
import { leer } from "../../app/almacen.js";

export const CLAVE_DEL_PRIMER_VUELO = "panal:primer-vuelo";

const INICIAL = { paso: 1, meta: 5, actividadId: null, titulo: "", celdaId: null };

function guardado() {
  const texto = leer(CLAVE_DEL_PRIMER_VUELO);
  try {
    return texto ? { ...INICIAL, ...JSON.parse(texto) } : INICIAL;
  } catch {
    // Un texto que no es JSON: el recorrido empieza de nuevo.
    return INICIAL;
  }
}

/**
 * El recorrido inicial: en qué paso va y lo elegido. Se recuerda en el
 * navegador para retomar el paso pendiente si la persona sale y vuelve.
 */
const primerVueloSlice = createSlice({
  name: "primerVuelo",
  initialState: guardado,
  reducers: {
    elegirMeta(estado, accion) {
      estado.meta = accion.payload;
    },
    irAlPaso(estado, accion) {
      estado.paso = accion.payload;
    },
    actividadCreada(estado, accion) {
      estado.actividadId = accion.payload.id;
      estado.titulo = accion.payload.titulo;
      estado.paso = 3;
    },
    celdaLlenada(estado, accion) {
      estado.celdaId = accion.payload;
    },
    terminarRecorrido() {
      return INICIAL;
    },
  },
});

export const { elegirMeta, irAlPaso, actividadCreada, celdaLlenada, terminarRecorrido } =
  primerVueloSlice.actions;
export default primerVueloSlice.reducer;
