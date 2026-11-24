import { getWeekday } from "@panal/motor";
import { HoneyJar } from "../../components/domain/HoneyJar.jsx";
import { getHexagonPoints } from "../../components/ui/hexagon.js";
import { WEEKDAY_SHORT_LABELS } from "../../lib/formatters.js";
import styles from "./ReportCharts.module.css";

const getWeekdayLabel = (day) => WEEKDAY_SHORT_LABELS[getWeekday(day)];

export function DailyColumnsChart({ days, goal = 5, description }) {
  const isCompact = days.length <= 14;
  const maxFilled = Math.max(goal, ...days.map((entry) => entry.filled), 1);
  const stepX = isCompact ? 44 : 14;
  const height = 160;
  const baseline = height - 22;
  const scale = (baseline - 14) / maxFilled;
  const width = stepX * days.length + 12;
  const radius = Math.min(14, (scale * 1.15) / 2);
  const hexPoints = getHexagonPoints(radius);

  return (
    <svg
      className={styles.columnas}
      role="img"
      aria-label={description}
      viewBox={`0 0 ${width} ${height}`}
    >
      <line
        className={styles.lineaDeMeta}
        x1="4"
        x2={width - 4}
        y1={baseline - goal * scale}
        y2={baseline - goal * scale}
      />
      {days.map((entry, index) => {
        const x = 6 + stepX * index + stepX / 2;
        const isClosed = entry.closed || entry.filled >= (entry.goal ?? goal);
        return (
          <g key={entry.day}>
            {isCompact ? (
              Array.from({ length: entry.filled }, (_, cellIndex) => (
                <polygon
                  key={cellIndex}
                  className={styles.celdaDeColumna}
                  data-cerrada={isClosed ? "" : undefined}
                  points={hexPoints}
                  transform={`translate(${x + (cellIndex % 2 === 0 ? -radius * 0.45 : radius * 0.45)} ${baseline - scale * (cellIndex + 0.5)})`}
                />
              ))
            ) : (
              <rect
                className={styles.barra}
                data-cerrada={isClosed ? "" : undefined}
                x={x - stepX * 0.32}
                y={baseline - entry.filled * scale}
                width={stepX * 0.64}
                height={Math.max(0, entry.filled * scale)}
                rx="3"
              />
            )}
            {(isCompact || index % 7 === 0) && (
              <text
                className={styles.rotulo}
                data-futuro={entry.isFuture ? "" : undefined}
                x={x}
                y={height - 6}
              >
                {isCompact ? getWeekdayLabel(entry.day) : entry.day.slice(8)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function BreakdownJarsChart({ jars, description }) {
  return (
    <div className={styles.tarros} role="img" aria-label={description}>
      {jars.map((jar) => (
        <div key={jar.name} className={styles.itemTarro}>
          <HoneyJar
            percentage={jar.percentage}
            closed={jar.percentage >= 100 && jar.count > 0}
            size={64}
          />
          <span className={styles.cifraDeTarro}>{jar.count}</span>
          <span className={styles.rotuloDeTarro}>{jar.name}</span>
        </div>
      ))}
    </div>
  );
}

export function AccessibleDataTable({ title, columns, rows }) {
  return (
    <details className={styles.comoTabla}>
      <summary>Ver como tabla</summary>
      <div className={styles.desplazable}>
        <table>
          <caption className="solo-lectores">{title}</caption>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row[0])}>
                {row.map((value, index) =>
                  index === 0 ? (
                    <th key={index} scope="row">
                      {value}
                    </th>
                  ) : (
                    <td key={index}>{value}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
