import { describe, expect, test } from "vite-plus/test";
import { panalDe, puntosDeHexagono } from "./hexagono.js";

describe("geometría del hexágono", () => {
  test("los vértices coinciden con los del diseño", () => {
    expect(puntosDeHexagono(38)).toBe("0,-38 32.9,-19 32.9,19 0,38 -32.9,19 -32.9,-19");
    expect(puntosDeHexagono(13, "plano")).toBe(
      "13,0 6.5,11.3 -6.5,11.3 -13,0 -6.5,-11.3 6.5,-11.3",
    );
  });

  test("el panal de cinco: dos celdas arriba y tres abajo, intercaladas", () => {
    const { centros } = panalDe(5);
    const [a, b, c, d, e] = centros;
    expect(a.y).toBe(b.y);
    expect(c.y).toBe(d.y);
    expect(d.y).toBe(e.y);
    expect(c.y).toBeGreaterThan(a.y);
    // Cada celda de arriba queda justo entre dos de abajo.
    expect(a.x).toBeCloseTo((c.x + d.x) / 2, 0);
    expect(b.x).toBeCloseTo((d.x + e.x) / 2, 0);
  });

  test.each([1, 2, 3, 4, 5, 6, 7])("un panal de %i celdas cabe en su dibujo", (cantidad) => {
    const { centros, ancho, alto } = panalDe(cantidad);
    expect(centros).toHaveLength(cantidad);
    for (const { x, y } of centros) {
      expect(x).toBeGreaterThanOrEqual(38);
      expect(x).toBeLessThanOrEqual(ancho - 38);
      expect(y).toBeGreaterThanOrEqual(38);
      expect(y).toBeLessThanOrEqual(alto - 38);
    }
    // Ninguna celda pisa a otra.
    const distintas = new Set(centros.map(({ x, y }) => `${x},${y}`));
    expect(distintas.size).toBe(cantidad);
  });
});
