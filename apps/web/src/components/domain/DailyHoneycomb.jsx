import { cn } from "../../lib/classNames.js";
import { pluralize } from "../../lib/formatters.js";
import { getHexagonPoints, getHoneycombLayout, HONEYCOMB_RADIUS } from "../ui/hexagon.js";
import styles from "./DailyHoneycomb.module.css";

function buildDefaultLabel({ goal, filled, closed, rest }) {
  if (rest) return "Panal de hoy en descanso";
  if (closed || filled >= goal) {
    return `Panal de hoy cerrado: ${filled} de ${goal} celdas llenas`;
  }
  const empty = Math.max(0, goal - filled);
  return `Panal de hoy: ${filled} ${pluralize(filled, "celda llena", "celdas llenas")} y ${empty} ${pluralize(empty, "vacía", "vacías")}`;
}

export function DailyHoneycomb({
  goal = 5,
  filled = 0,
  closed = false,
  rest = false,
  label,
  className,
}) {
  const { centers, width, height } = getHoneycombLayout(goal);
  const points = getHexagonPoints(HONEYCOMB_RADIUS);
  const ariaLabel = label ?? buildDefaultLabel({ goal, filled, closed, rest });

  return (
    <svg
      className={cn(styles.dailyHoneycomb, className)}
      data-closed={closed ? "" : undefined}
      data-rest={rest ? "" : undefined}
      role="img"
      aria-label={ariaLabel}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      {centers.map((center, index) => (
        <g
          key={index}
          className={styles.cell}
          data-filled={index < filled ? "" : undefined}
          transform={`translate(${center.x} ${center.y})`}
        >
          <polygon points={points} />
          <path d="M-12 0 l8 9 l16 -18" pathLength="1" />
        </g>
      ))}
    </svg>
  );
}
