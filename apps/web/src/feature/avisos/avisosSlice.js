import { createSlice, nanoid } from "@reduxjs/toolkit";

/**
 * Avisos temporales: confirmaciones ("Celda archivada", con "Deshacer") y
 * errores al guardar. Se muestran de uno en uno, en el orden en que llegan.
 *
 * Un aviso puede traer una acción para deshacer. Se guarda como datos (qué
 * mutación y con qué argumentos), no como función: el store solo guarda datos.
 *
 * @typedef {object} Aviso
 * @property {string} id
 * @property {string} texto
 * @property {"exito" | "error"} tono
 * @property {{ etiqueta: string, mutacion: string, argumentos: unknown } | null} accion
 */

const avisosSlice = createSlice({
  name: "avisos",
  initialState: () => ({ cola: /** @type {Aviso[]} */ ([]) }),
  reducers: {
    avisar: {
      reducer(estado, accion) {
        estado.cola.push(accion.payload);
      },
      prepare({ texto, tono = "exito", accion = null }) {
        return { payload: { id: nanoid(), texto, tono, accion } };
      },
    },
    descartarAviso(estado, accion) {
      estado.cola = estado.cola.filter((aviso) => aviso.id !== accion.payload);
    },
  },
});

export const { avisar, descartarAviso } = avisosSlice.actions;
export default avisosSlice.reducer;
