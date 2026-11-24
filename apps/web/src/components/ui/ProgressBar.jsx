import { cn } from "../../lib/classNames.js";
import styles from "./ProgressBar.module.css";

export function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = false,
  variant = "honey",
  color,
  className,
}) {
  const safeMax = max > 0 ? max : 100;
  const rawRatio =
    safeMax === 100 && value > 0 && value <= 1 && !Number.isInteger(value)
      ? value
      : value / safeMax;
  const percentage = Math.round(Math.min(1, Math.max(0, rawRatio)) * 100);
  const fillStyle = {
    inlineSize: `${percentage}%`,
    ...(color ? { background: color } : {}),
  };

  return (
    <div className={cn(styles.wrapper, className)}>
      {(label || showValue) && (
        <div className={styles.header}>
          {label && <span>{label}</span>}
          {showValue && <span className={styles.value}>{`${percentage} %`}</span>}
        </div>
      )}
      <span className={styles.bar} data-variant={variant} aria-hidden="true">
        <span style={fillStyle} />
      </span>
    </div>
  );
}
