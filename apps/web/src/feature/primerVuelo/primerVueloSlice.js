import { META_POR_DEFECTO } from "@panal/contratos/errores";
import { createSlice } from "@reduxjs/toolkit";
import { recuerdo } from "../../lib/almacen.js";

const INICIAL = { paso: 1, meta: META_POR_DEFECTO, actividadId: null, titulo: "", celdaId: null };

/** El paso pendiente se retoma si la persona sale y vuelve; al terminar, se olvida. */
export const recuerdoDelPrimerVuelo = recuerdo("panal:primer-vuelo", (estado) =>
  estado.primerVuelo === INICIAL ? null : JSON.stringify(estado.primerVuelo),
);

function guardado() {
  const texto = recuerdoDelPrimerVuelo.leido();
  try {
    return texto ? { ...INICIAL, ...JSON.parse(texto) } : INICIAL;
  } catch {
    // Un texto que no es JSON: el recorrido empieza de nuevo.
    return INICIAL;
  }
}

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
