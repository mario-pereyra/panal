import { cn } from "../../lib/classNames.js";
import { ZumMascot } from "./ZumMascot.jsx";
import styles from "./ZumScreen.module.css";

export function ZumScreen({
  mood = "esperando",
  title,
  description,
  action,
  secondaryAction,
  className,
  children,
}) {
  return (
    <main id="contenido" className={cn(styles.screen, className)} tabIndex={-1}>
      {title && <title>{`${title} · Panal`}</title>}
      <section className={styles.card}>
        <ZumMascot className={styles.zum} mood={mood} priority sizes="160px" />
        {title && <h1 className={styles.title}>{title}</h1>}
        {description && <p className={styles.description}>{description}</p>}
        {children}
        {(action || secondaryAction) && (
          <div className={styles.actions}>
            {action}
            {secondaryAction}
          </div>
        )}
      </section>
    </main>
  );
}
