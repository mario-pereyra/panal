import { FORMER_MEMBER_COLOR, getBeeColor } from "../../core/dashboard/beeColors.js";
import { cn } from "../../lib/classNames.js";
import { getHexagonPoints } from "../ui/hexagon.js";
import styles from "./HiveGrid.module.css";

const RADIUS = 16;
const COLUMNS = 6;
const STEP_X = 36;
const STEP_Y = 31;
const MARGIN_X = 20;
const MARGIN_Y = 22;

function resolveColor(colorValue) {
  if (typeof colorValue === "number") return getBeeColor(colorValue);
  if (typeof colorValue === "string" && colorValue) return colorValue;
  return getBeeColor(0);
}

export function HiveGrid({
  activities = [],
  cells,
  members = [],
  interactive = false,
  onSelectCell,
  description = "Panal de la colmena",
  className,
}) {
  const rawItems = activities.length > 0 ? activities : (cells ?? []);
  const memberColorMap = new Map(
    members.map((member, index) => [
      member.id,
      resolveColor(member.colorIndex ?? member.color ?? index),
    ]),
  );

  const resolvedCells = rawItems.map((item, index) => {
    const id = item.id ?? item.activityId ?? String(index);
    const fillerId = item.filledBy ?? item.userId ?? null;
    let color = null;
    if (typeof item.color === "string") {
      color = item.color;
    } else if (typeof item.color === "number") {
      color = getBeeColor(item.color);
    } else if (fillerId) {
      color = memberColorMap.get(fillerId) ?? FORMER_MEMBER_COLOR;
    } else if (item.filled) {
      color = getBeeColor(0);
    }
    return { id, color, raw: item };
  });

  const rows = Math.max(1, Math.ceil(resolvedCells.length / COLUMNS));
  const width = MARGIN_X * 2 + STEP_X * (COLUMNS - 1) + STEP_X / 2;
  const height = MARGIN_Y * 2 + STEP_Y * (rows - 1);
  const points = getHexagonPoints(RADIUS);

  return (
    <svg
      className={cn(styles.hiveGrid, className)}
      role="img"
      aria-label={description}
      viewBox={`0 0 ${width} ${height}`}
    >
      {resolvedCells.map((cell, index) => {
        const row = Math.floor(index / COLUMNS);
        const col = index % COLUMNS;
        const x = MARGIN_X + STEP_X * col + (row % 2 === 1 ? STEP_X / 2 : 0);
        const y = MARGIN_Y + STEP_Y * row;
        return (
          <polygon
            key={cell.id}
            points={points}
            transform={`translate(${x} ${y})`}
            className={cn(
              cell.color ? styles.filledCell : styles.emptyCell,
              interactive && onSelectCell && styles.interactiveCell,
            )}
            style={cell.color ? { fill: cell.color } : undefined}
            onClick={interactive && onSelectCell ? () => onSelectCell(cell.raw) : undefined}
          />
        );
      })}
    </svg>
  );
}
