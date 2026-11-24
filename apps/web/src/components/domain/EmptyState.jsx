import { cn } from "../../lib/classNames.js";
import { getHexagonPoints } from "../ui/hexagon.js";
import styles from "./EmptyState.module.css";

export function EmptyState({ title, description, action, className }) {
  const cellPoints = getHexagonPoints(26);
  const text = description ?? title;

  return (
    <div className={cn(styles.empty, className)}>
      <svg className={styles.illustration} viewBox="0 0 160 110" aria-hidden="true">
        <g className={styles.emptyCells}>
          <polygon points={cellPoints} transform="translate(52 36)" />
          <polygon points={cellPoints} transform="translate(100 36)" />
          <polygon points={cellPoints} transform="translate(76 77)" />
        </g>
        <g className={styles.flower} transform="translate(136 88)">
          <path d="M0 18 V2" />
          {[0, 72, 144, 216, 288].map((rotation) => (
            <ellipse
              key={rotation}
              cx="0"
              cy="-7"
              rx="4.5"
              ry="6.5"
              transform={`rotate(${rotation})`}
            />
          ))}
          <circle r="3.5" />
        </g>
      </svg>
      {title && description && <h3 className={styles.title}>{title}</h3>}
      {text && <p className={styles.description}>{text}</p>}
      {action}
    </div>
  );
}
