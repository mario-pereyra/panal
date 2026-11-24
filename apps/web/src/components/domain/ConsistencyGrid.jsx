import { cn } from "../../lib/classNames.js";
import { WEEKDAY_SHORT_LABELS } from "../../lib/formatters.js";
import { getHexagonPoints } from "../ui/hexagon.js";
import styles from "./ConsistencyGrid.module.css";

const RADIUS = 13;
const STEP_X = 23;
const STEP_Y = 26;
const MARGIN_X = 18;
const FIRST_ROW_Y = 34;
const HEX_POINTS = getHexagonPoints(RADIUS, "flat");

const LEVEL_LABELS = ["Sin celdas", "Al menos una", "La mitad o más", "Panal cerrado"];

export function ConsistencyGrid({ weeks = [], className }) {
  const safeWeeks = Array.isArray(weeks) ? weeks : [];
  const rowCount = Math.max(1, safeWeeks.length);
  const width = MARGIN_X * 2 + STEP_X * 6;
  const height = FIRST_ROW_Y + STEP_Y * (rowCount - 1) + RADIUS * 2 + 4;

  const days = safeWeeks.flat().filter((item) => !item.isFuture);
  const activeDays = days.filter((item) => (item.filled ?? item.level) > 0).length;
  const closedDays = days.filter((item) => item.level === 3).length;
  const description = `Panal de constancia de las últimas ${safeWeeks.length} semanas: ${activeDays} de ${days.length} días con celdas llenas, ${closedDays} de ellos con el panal cerrado.`;

  return (
    <div className={cn(styles.wrapper, className)}>
      <svg
        className={styles.consistencyGrid}
        role="img"
        aria-label={description}
        viewBox={`0 0 ${width} ${height}`}
      >
        {WEEKDAY_SHORT_LABELS.map((label, colIndex) => (
          <text
            key={colIndex}
            className={styles.weekdayLabel}
            x={MARGIN_X + STEP_X * colIndex}
            y="12"
          >
            {label}
          </text>
        ))}
        {safeWeeks.flatMap((week, rowIndex) =>
          week.map((dayItem, colIndex) => {
            const isFuture = Boolean(dayItem.isFuture ?? dayItem.futuro);
            const isToday = Boolean(dayItem.isToday ?? dayItem.esHoy);
            const level = dayItem.level ?? dayItem.nivel ?? 0;
            return (
              <polygon
                key={dayItem.day ?? dayItem.dia ?? `${rowIndex}-${colIndex}`}
                className={styles.dayCell}
                data-level={isFuture ? undefined : level}
                data-today={isToday ? "" : undefined}
                data-future={isFuture ? "" : undefined}
                points={HEX_POINTS}
                transform={`translate(${MARGIN_X + STEP_X * colIndex} ${
                  FIRST_ROW_Y + STEP_Y * rowIndex + (colIndex % 2 === 1 ? RADIUS : 0)
                })`}
              />
            );
          }),
        )}
      </svg>
      <ul className={styles.legend} role="list" aria-label="Leyenda">
        {LEVEL_LABELS.map((name, level) => (
          <li key={name}>
            <LegendSwatch level={level} />
            {name}
          </li>
        ))}
        <li>
          <LegendSwatch level={0} isToday />
          Hoy
        </li>
      </ul>
    </div>
  );
}

function LegendSwatch({ level, isToday = false }) {
  return (
    <svg className={styles.swatch} viewBox="-15 -13 30 26" aria-hidden="true">
      <polygon
        className={styles.dayCell}
        data-level={level}
        data-today={isToday ? "" : undefined}
        points={HEX_POINTS}
      />
    </svg>
  );
}
