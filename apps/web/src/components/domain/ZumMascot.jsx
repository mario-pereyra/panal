import { cn } from "../../lib/classNames.js";
import { ZUM_ALT_TEXT } from "../../lib/formatters.js";
import styles from "./ZumMascot.module.css";

const assetUrls = import.meta.glob("../../assets/zum/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

const getAssetUrl = (mood, width) => assetUrls[`../../assets/zum/${mood}-${width}.webp`];

export function ZumMascot({
  mood = "esperando",
  withBackground = false,
  priority = false,
  sizes = "240px",
  className,
}) {
  return (
    <span
      className={cn(styles.zum, className)}
      data-estado={mood}
      data-fondo={withBackground ? "" : undefined}
    >
      <img
        key={mood}
        className={styles.image}
        src={getAssetUrl(mood, 360)}
        srcSet={`${getAssetUrl(mood, 128)} 128w, ${getAssetUrl(mood, 360)} 360w, ${getAssetUrl(mood, 720)} 720w`}
        sizes={sizes}
        width="360"
        height="360"
        alt={ZUM_ALT_TEXT[mood] ?? ZUM_ALT_TEXT.esperando}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
      />
    </span>
  );
}
