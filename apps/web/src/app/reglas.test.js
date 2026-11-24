import { METAS_DIARIAS } from "@panal/contratos";
import { CLASES_DE_REGLA, ESTADOS_DE_ZUM } from "@panal/motor";
import { describe, expect, test } from "vite-plus/test";
import { DESCRIPCIONES_DE_ZUM } from "../componentes/panal/textos.js";
import { CLASES } from "../feature/actividad/textos.js";
import { TAMANOS_DE_PANAL } from "../feature/miVuelo/textos.js";
import { TAMANOS } from "../feature/primerVuelo/textos.js";

/**
 * La interfaz pone nombre a las reglas del motor y de los contratos. Si una
 * regla cambia (un estado de Zum nuevo, otra meta), estas pruebas avisan de la
 * lista que quedó atrás.
 */
describe("las listas de la interfaz cubren las reglas", () => {
  test("cada estado de Zum tiene su descripción", () => {
    expect(Object.keys(DESCRIPCIONES_DE_ZUM).sort()).toEqual([...ESTADOS_DE_ZUM].sort());
  });

  test("cada clase de repetición tiene su opción", () => {
    expect(CLASES.map((clase) => clase.valor)).toEqual(CLASES_DE_REGLA);
  });

  test("los tamaños del panal son las metas que acepta el servidor", () => {
    expect(TAMANOS_DE_PANAL.map((tamano) => tamano.valor)).toEqual(METAS_DIARIAS);
    expect(TAMANOS.map((tamano) => tamano.meta)).toEqual(METAS_DIARIAS);
  });
});
