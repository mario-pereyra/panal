import { describe, expect, test } from "vite-plus/test";
import { panalApi } from "../api/panalApi.js";
import { marcarAhora } from "../feature/reloj/relojSlice.js";
import { escuchas } from "./escuchas.js";
import { crearStore } from "./store.js";

/** Martes 17 de noviembre de 2026 en La Paz (UTC−4), a la hora indicada. */
const aLas = (hora) => Date.parse(`2026-11-17T${hora}:00-04:00`);

/**
 * Un store con la persona cargada y el reloj en `desde`, y la lista de
 * etiquetas que se invalidan a partir de ahí.
 */
async function preparar(desde) {
  const store = crearStore();
  await store.dispatch(
    panalApi.util.upsertQueryData("obtenerYo", undefined, { zonaHoraria: "America/La_Paz" }),
  );
  store.dispatch(marcarAhora(desde));
  const invalidadas = [];
  const dejar = escuchas.startListening({
    predicate: (accion) => accion.type === panalApi.util.invalidateTags.type,
    effect: (accion) => invalidadas.push(accion.payload),
  });
  return { store, invalidadas, dejar };
}

describe("cambio de día con la aplicación abierta", () => {
  test("al pasar las 03:00 se vuelve a pedir lo que depende de hoy", async () => {
    const { store, invalidadas, dejar } = await preparar(aLas("02:59"));
    store.dispatch(marcarAhora(aLas("03:01")));
    dejar();
    expect(invalidadas).toHaveLength(1);
    expect(invalidadas[0]).toContain("Panal");
  });

  test("dentro del mismo día no se pide nada", async () => {
    const { store, invalidadas, dejar } = await preparar(aLas("10:00"));
    store.dispatch(marcarAhora(aLas("23:59")));
    dejar();
    expect(invalidadas).toHaveLength(0);
  });
});
