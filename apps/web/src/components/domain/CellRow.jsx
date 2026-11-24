import { useId } from "react";
import { cn } from "../../lib/classNames.js";
import { ModalLink } from "../ui/Button.jsx";
import { getHexagonPoints } from "../ui/hexagon.js";
import styles from "./CellRow.module.css";

export function CellRow({ row, onToggle, disabled = false, menu, editLink, className, ...props }) {
  const titleId = useId();
  const subtitleId = useId();

  const title = row?.title ?? props.title ?? "";
  const subtitle = row?.subtitle ?? row?.detail ?? props.subtitle ?? "";
  const drops = row !== undefined ? row.drops : props.drops;
  const filled = Boolean(row?.filled ?? props.filled);
  const overdue = Boolean(row?.overdue ?? props.overdue);
  const isHighPriority = Boolean(
    row?.priority === "high" || row?.highPriority || props.highPriority,
  );

  return (
    <li className={cn(styles.row, className)} data-filled={filled ? "" : undefined}>
      {onToggle ? (
        <label className={styles.checkboxLabel}>
          <input
            className={styles.checkboxInput}
            type="checkbox"
            checked={filled}
            disabled={disabled}
            onChange={() => onToggle(row)}
            aria-labelledby={titleId}
            aria-describedby={subtitleId}
          />
          <svg className={styles.checkboxSvg} aria-hidden="true" viewBox="-22 -22 44 44">
            <polygon className={styles.hexOutline} points={getHexagonPoints(18)} />
            <path className={styles.checkMark} d="M-7 0 l5 6 l9 -11" pathLength="1" />
          </svg>
        </label>
      ) : (
        <svg className={styles.staticHex} viewBox="-22 -22 44 44" aria-hidden="true">
          <polygon points={getHexagonPoints(16)} />
        </svg>
      )}
      <div className={styles.texts}>
        {editLink ? (
          <ModalLink to={editLink} id={titleId} className={cn(styles.title, styles.link)}>
            {title}
          </ModalLink>
        ) : (
          <span id={titleId} className={styles.title}>
            {title}
          </span>
        )}
        <span id={subtitleId} className={styles.subtitle}>
          {subtitle}
          {isHighPriority && <span className={styles.badge}>Prioridad alta</span>}
          {overdue && <span className={styles.badge}>Vencida</span>}
        </span>
      </div>
      {drops != null && (
        <span className={styles.drops}>
          +{drops}
          <span className="solo-lectores"> gotas</span>
        </span>
      )}
      {menu}
    </li>
  );
}
