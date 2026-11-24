import { Component, useId } from "react";
import { cn } from "../../lib/classNames.js";
import { Button } from "./Button.jsx";
import styles from "./FeedbackStates.module.css";

export function Skeleton({ lines = 3, label = "Cargando…", blocks, className }) {
  const heights = Array.isArray(blocks)
    ? blocks
    : Array.from({ length: Math.max(1, lines) }, (_, index) => (index === 0 ? 180 : 120));

  return (
    <div className={cn(styles.skeleton, className)} role="status">
      <span className="solo-lectores">{label}</span>
      {heights.map((height, index) => (
        <div key={index} className={styles.block} style={{ minBlockSize: `${height}px` }} />
      ))}
    </div>
  );
}

export function EmptyCard({ title, description, action, className, children }) {
  const titleId = useId();
  return (
    <section
      className={cn(styles.emptyCard, className)}
      aria-labelledby={title ? titleId : undefined}
    >
      {title && (
        <h2 id={titleId} className={styles.errorTitle}>
          {title}
        </h2>
      )}
      {description && <p>{description}</p>}
      {children}
      {action}
    </section>
  );
}

export function LoadError({
  title = "No pudimos abrir esta pantalla",
  message,
  onRetry,
  className,
  children,
}) {
  const titleId = useId();
  return (
    <section className={cn(styles.error, className)} aria-labelledby={titleId}>
      <h2 id={titleId} className={styles.errorTitle}>
        {title}
      </h2>
      <p>
        {message ?? children ?? "Tu panal sigue a salvo. Revisa tu conexión y vuelve a intentarlo."}
      </p>
      {onRetry && <Button onClick={onRetry}>Reintentar</Button>}
    </section>
  );
}

export class ErrorBoundary extends Component {
  state = { error: null, hasRetried: false };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  handleRetry = () => {
    if (this.state.hasRetried) {
      window.location.reload();
      return;
    }
    this.setState({ error: null, hasRetried: true });
  };

  render() {
    if (!this.state.error) return this.props.children;
    return <LoadError onRetry={this.handleRetry} />;
  }
}
