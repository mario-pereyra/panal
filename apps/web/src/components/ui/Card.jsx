import { useId } from "react";
import { Link } from "react-router";
import { cn } from "../../lib/classNames.js";
import styles from "./Card.module.css";

const PADDING_CLASSES = {
  none: styles.paddingNone,
  sm: styles.paddingSm,
  md: styles.paddingMd,
  lg: styles.paddingLg,
};

const VARIANT_CLASSES = {
  honey: styles.variantHoney,
  wax: styles.variantWax,
  wing: styles.variantWing,
  subtle: styles.variantSubtle,
};

export function Card({
  as: Component = "div",
  variant,
  padding = "md",
  title,
  meta,
  subtitle,
  to,
  className,
  children,
  ...props
}) {
  const titleId = useId();
  const cardClass = cn(
    styles.card,
    PADDING_CLASSES[padding] ?? styles.paddingMd,
    variant && VARIANT_CLASSES[variant],
    className,
  );

  if (title) {
    return (
      <article className={cardClass} aria-labelledby={titleId} {...props}>
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {to ? (
              <Link to={to} className={styles.link}>
                {title}
              </Link>
            ) : (
              title
            )}
          </h2>
          {meta != null && <span className={styles.meta}>{meta}</span>}
        </header>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {children}
      </article>
    );
  }

  return (
    <Component className={cardClass} {...props}>
      {children}
    </Component>
  );
}
