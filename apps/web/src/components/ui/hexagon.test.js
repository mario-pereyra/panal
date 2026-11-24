import { describe, expect, test } from "vite-plus/test";
import { getHexagonPoints, getHoneycombLayout } from "./hexagon.js";

describe("hexagon geometry", () => {
  test("vertices match the honeycomb design", () => {
    expect(getHexagonPoints(38)).toBe("0,-38 32.9,-19 32.9,19 0,38 -32.9,19 -32.9,-19");
    expect(getHexagonPoints(13, "flat")).toBe("13,0 6.5,11.3 -6.5,11.3 -13,0 -6.5,-11.3 6.5,-11.3");
  });

  test("five-cell honeycomb places two cells above and three below, interlocked", () => {
    const { centers } = getHoneycombLayout(5);
    const [a, b, c, d, e] = centers;
    expect(a.y).toBe(b.y);
    expect(c.y).toBe(d.y);
    expect(d.y).toBe(e.y);
    expect(c.y).toBeGreaterThan(a.y);
    expect(a.x).toBeCloseTo((c.x + d.x) / 2, 0);
    expect(b.x).toBeCloseTo((d.x + e.x) / 2, 0);
  });

  test.each([1, 2, 3, 4, 5, 6, 7])("a honeycomb of %i cells fits inside its bounds", (goal) => {
    const { centers, width, height } = getHoneycombLayout(goal);
    expect(centers).toHaveLength(goal);
    for (const { x, y } of centers) {
      expect(x).toBeGreaterThanOrEqual(38);
      expect(x).toBeLessThanOrEqual(width - 38);
      expect(y).toBeGreaterThanOrEqual(38);
      expect(y).toBeLessThanOrEqual(height - 38);
    }
    const distinct = new Set(centers.map(({ x, y }) => `${x},${y}`));
    expect(distinct.size).toBe(goal);
  });
});
