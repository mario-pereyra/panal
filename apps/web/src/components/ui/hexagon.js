const roundTenth = (value) => Math.round(value * 10) / 10;

export function getHexagonPoints(radius, cxOrOrientation = 0, cy = 0) {
  const isFlat = cxOrOrientation === "plano" || cxOrOrientation === "flat";
  const cx = typeof cxOrOrientation === "number" ? cxOrOrientation : 0;
  const startAngle = isFlat ? 0 : -90;

  return Array.from({ length: 6 }, (_, index) => {
    const angle = ((startAngle + 60 * index) * Math.PI) / 180;
    return `${roundTenth(cx + radius * Math.cos(angle))},${roundTenth(cy + radius * Math.sin(angle))}`;
  }).join(" ");
}

export const HONEYCOMB_ROWS = {
  1: [1],
  2: [2],
  3: [1, 2],
  4: [2, 2],
  5: [2, 3],
  6: [3, 3],
  7: [2, 3, 2],
};

export const HONEYCOMB_RADIUS = 38;
const GAP = 10;
const MARGIN = 6;

export function getHoneycombLayout(goal = 5) {
  const safeGoal = Math.min(7, Math.max(1, Number(goal) || 5));
  const radius = HONEYCOMB_RADIUS;
  const rows = HONEYCOMB_ROWS[safeGoal];
  const stepX = Math.sqrt(3) * radius + GAP;
  const stepY = 1.5 * radius + GAP * 0.9;
  const equalRowLengths = rows.length > 1 && rows.every((cells) => cells === rows[0]);

  const rawCenters = [];
  rows.forEach((cells, rowIndex) => {
    const shift = equalRowLengths ? (rowIndex % 2 === 0 ? -1 : 1) * (stepX / 4) : 0;
    for (let colIndex = 0; colIndex < cells; colIndex += 1) {
      rawCenters.push({
        x: (colIndex - (cells - 1) / 2) * stepX + shift,
        y: rowIndex * stepY,
      });
    }
  });

  const halfWidth = (Math.sqrt(3) / 2) * radius;
  const left = Math.min(...rawCenters.map((center) => center.x)) - halfWidth - MARGIN;
  const right = Math.max(...rawCenters.map((center) => center.x)) + halfWidth + MARGIN;
  const top = -radius - MARGIN;
  const bottom = (rows.length - 1) * stepY + radius + MARGIN;

  const centers = rawCenters.map((center) => ({
    x: roundTenth(center.x - left),
    y: roundTenth(center.y - top),
  }));
  const width = Math.ceil(right - left);
  const height = Math.ceil(bottom - top);

  return {
    centers,
    width,
    height,
  };
}
