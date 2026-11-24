import { Link } from "react-router";
import { cn } from "../../lib/classNames.js";
import styles from "./Button.module.css";
import { useModalRoute } from "./useModalRoute.js";

const VARIANT_CLASSES = {
  primary: styles.primary,
  tinta: styles.primary,
  secondary: styles.secondary,
  outline: styles.secondary,
  claro: styles.secondary,
  danger: styles.danger,
  peligro: styles.danger,
  ghost: styles.ghost,
  sutil: styles.ghost,
};

const SIZE_CLASSES = {
  sm: styles.sm,
  chico: styles.sm,
  md: null,
  normal: null,
  lg: styles.lg,
};

export function ModalLink({ to, className, children, ...props }) {
  const { backgroundLocation } = useModalRoute();
  return (
    <Link
      to={to}
      state={{ backgroundLocation, fondo: backgroundLocation }}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  to,
  modal = false,
  disabled,
  type = "button",
  className,
  children,
  ...props
}) {
  const buttonClass = cn(
    styles.button,
    VARIANT_CLASSES[variant] ?? styles.primary,
    SIZE_CLASSES[size],
    className,
  );

  if (to) {
    const LinkComponent = modal ? ModalLink : Link;
    return (
      <LinkComponent
        to={to}
        className={buttonClass}
        aria-disabled={disabled ? "true" : undefined}
        {...props}
      >
        {children}
      </LinkComponent>
    );
  }

  return (
    <button type={type} disabled={disabled} className={buttonClass} {...props}>
      {children}
    </button>
  );
}

export function Tabs({ label, items = [], activeValue, onChange, className }) {
  return (
    <nav className={cn(styles.tabs, className)} aria-label={label}>
      <ul role="list">
        {items.map((item) => {
          const isActive = activeValue === item.value;
          return (
            <li key={item.value}>
              {item.to ? (
                <Link
                  to={item.to}
                  replace
                  className={styles.tab}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onChange?.(item.value)}
                >
                  {item.label}
                  {item.count != null && <span className={styles.tabCount}>{item.count}</span>}
                </Link>
              ) : (
                <button
                  type="button"
                  className={styles.tab}
                  data-active={isActive ? "" : undefined}
                  aria-pressed={isActive}
                  onClick={() => onChange?.(item.value)}
                >
                  {item.label}
                  {item.count != null && <span className={styles.tabCount}>{item.count}</span>}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
