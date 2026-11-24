import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";
import { crearStore } from "../../store/index.js";
import { panalApi } from "../../store/api.js";
import { ponerEnHora } from "./relojSlice.js";

/** Martes 17 de noviembre de 2026 en La Paz (UTC−4), a la hora indicada. */
const aLas = (hora) => Date.parse(`2026-11-17T${hora}:00-04:00`);

// El navegador resuelve `/api` contra la página; aquí, contra un origen de prueba que responde vacío.
beforeEach(() => {
  const RequestDelNavegador = globalThis.Request;
  vi.stubGlobal(
    "Request",
    class extends RequestDelNavegador {
      constructor(url, opciones) {
        super(new URL(url, "http://panal.test"), opciones);
      }
    },
  );
  vi.stubGlobal("fetch", async () => Response.json({}));
});
afterEach(() => vi.unstubAllGlobals());

/** Cuántas veces se pidió el panal: cada pedido deja un `requestId` nuevo. */
async function contarPedidosDelPanal(desde, hasta) {
  const store = crearStore();
  await store.dispatch(
    panalApi.util.upsertQueryData("obtenerYo", undefined, { zonaHoraria: "America/La_Paz" }),
  );
  store.dispatch(ponerEnHora(desde));
  const suscripcion = store.dispatch(panalApi.endpoints.obtenerPanal.initiate());
  await suscripcion;
  const pedidoDe = () => panalApi.endpoints.obtenerPanal.select()(store.getState()).requestId;
  const antes = pedidoDe();
  store.dispatch(ponerEnHora(hasta));
  await new Promise((listo) => setTimeout(listo, 0));
  const despues = pedidoDe();
  suscripcion.unsubscribe();
  return antes === despues ? 0 : 1;
}

describe("cambio de día con la aplicación abierta", () => {
  test("al pasar las 03:00 se vuelve a pedir el panal", async () => {
    expect(await contarPedidosDelPanal(aLas("02:59"), aLas("03:01"))).toBe(1);
  });

  test("dentro del mismo día no se pide nada", async () => {
    expect(await contarPedidosDelPanal(aLas("10:00"), aLas("23:59"))).toBe(0);
  });
});
