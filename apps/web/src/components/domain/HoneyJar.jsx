import { useId } from "react";
import { cn } from "../../lib/classNames.js";
import styles from "./HoneyJar.module.css";

const GLASS_PATH =
  "M14 16 h36 c6 3 9 8 9 14 v28 a10 10 0 0 1 -10 10 h-34 a10 10 0 0 1 -10 -10 v-28 c0 -6 3 -11 9 -14 Z";

export function HoneyJar({ percentage = 0, closed = false, size = 48, className }) {
  const clipId = useId();
  const normalized = closed
    ? 1
    : percentage > 1
      ? Math.min(1, Math.max(0, percentage / 100))
      : Math.min(1, Math.max(0, percentage));
  const fillHeight = Math.round(normalized * 52);
  const height = Math.round((size * 72) / 64);

  return (
    <svg
      className={cn(styles.jar, className)}
      data-closed={closed ? "" : undefined}
      viewBox="0 0 64 72"
      width={size}
      height={height}
      aria-hidden="true"
    >
      <clipPath id={clipId}>
        <path d={GLASS_PATH} />
      </clipPath>
      <rect
        className={styles.honey}
        x="4"
        y={68 - fillHeight}
        width="56"
        height={fillHeight}
        clipPath={`url(#${clipId})`}
      />
      <path d={GLASS_PATH} className={styles.glass} />
      <rect x="10" y="4" width="44" height="12" rx="4" className={styles.lid} />
    </svg>
  );
}
