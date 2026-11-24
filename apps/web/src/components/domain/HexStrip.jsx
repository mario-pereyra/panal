import { cn } from "../../lib/classNames.js";
import { getHexagonPoints } from "../ui/hexagon.js";
import styles from "./HexStrip.module.css";

function resolveItemStatus(item) {
  if (typeof item === "string") return item;
  if (item?.status) return item.status;
  if (item?.filled || item?.done) return "done";
  if (item?.rest) return "rest";
  if (item?.due === false || item?.scheduled === false) return "off";
  return "missed";
}

export function HexStrip({ count = 5, filledCount = 0, items, size = 22, className }) {
  const cells = Array.isArray(items)
    ? items.map((item, index) => ({
        key: item?.day ?? item?.id ?? index,
        status: resolveItemStatus(item),
      }))
    : Array.from({ length: Math.max(0, count) }, (_, index) => ({
        key: index,
        status: index < filledCount ? "done" : "missed",
      }));

  const radius = Math.round(size * 0.46 * 10) / 10;
  const step = size + 3;
  const width = Math.max(1, cells.length) * step + 2;
  const height = size + 4;
  const points = getHexagonPoints(radius);

  return (
    <svg
      className={cn(styles.strip, className)}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      aria-hidden="true"
    >
      {cells.map((cell, index) => (
        <polygon
          key={cell.key}
          className={styles.cell}
          data-status={cell.status}
          points={points}
          transform={`translate(${1 + step * index + step / 2} ${height / 2})`}
        />
      ))}
    </svg>
  );
}
