import { useId } from "react";
import { Link } from "react-router";
import { cn } from "../../lib/classNames.js";
import { ArrowLeftIcon } from "./icons.jsx";
import styles from "./Page.module.css";

export function Page({
  title,
  subtitle,
  action,
  backTo,
  backLabel = "Volver",
  className,
  children,
}) {
  return (
    <div className={cn(styles.page, className)}>
      {title && <title>{`${title} · Panal`}</title>}
      <header className={styles.header}>
        <div className={styles.titles}>
          {backTo && (
            <Link to={backTo} className={styles.backLink}>
              <ArrowLeftIcon /> {backLabel}
            </Link>
          )}
          {title && <h1 className={styles.title}>{title}</h1>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {action && <div className={styles.actions}>{action}</div>}
      </header>
      {children}
    </div>
  );
}

export function Section({ title, subtitle, action, className, children }) {
  const titleId = useId();

  return (
    <section
      className={cn(styles.section, className)}
      aria-labelledby={title ? titleId : undefined}
    >
      {(title || action) && (
        <header className={styles.sectionHeader}>
          {title && (
            <h2 id={titleId} className={styles.sectionTitle}>
              {title}
            </h2>
          )}
          {action}
        </header>
      )}
      {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
      {children}
    </section>
  );
}
