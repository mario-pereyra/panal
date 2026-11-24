import { getBeeColor, getInitial } from "../../core/dashboard/beeColors.js";
import { cn } from "../../lib/classNames.js";
import styles from "./MemberAvatar.module.css";

const SIZE_CLASSES = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

export function MemberAvatar({ name, color = 0, isOwner = false, size = "md", className }) {
  const background = typeof color === "number" ? getBeeColor(color) : color || getBeeColor(0);

  return (
    <span
      className={cn(styles.avatar, SIZE_CLASSES[size] ?? styles.md, className)}
      data-owner={isOwner ? "" : undefined}
      style={{ background }}
      aria-hidden="true"
    >
      {getInitial(name || "?")}
    </span>
  );
}
