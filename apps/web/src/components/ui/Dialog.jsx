import { createContext, use, useCallback, useEffect, useId, useRef } from "react";
import { cn } from "../../lib/classNames.js";
import styles from "./Dialog.module.css";
import { CloseIcon } from "./icons.jsx";

const DialogCloseContext = createContext(() => {});

export const useCloseDialog = () => use(DialogCloseContext);

export function Dialog({
  open = true,
  onClose,
  beforeClose,
  closeOnBackdrop = false,
  size = "md",
  title,
  subtitle,
  footer,
  className,
  children,
}) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const subtitleId = useId();
  const startedOutside = useRef(false);

  const closeDialog = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!open) return null;

  const isOutside = (event) => {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return false;
    return (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    );
  };

  const lacksClosedBy =
    typeof HTMLDialogElement !== "undefined" && !("closedBy" in HTMLDialogElement.prototype);

  const handlePointerDown = (event) => {
    startedOutside.current = isOutside(event);
  };

  const handlePointerUp = (event) => {
    if (!startedOutside.current || !isOutside(event)) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (typeof dialog.requestClose === "function") {
      dialog.requestClose();
    } else {
      const cancelEvent = new Event("cancel", { cancelable: true });
      dialog.dispatchEvent(cancelEvent);
      if (!cancelEvent.defaultPrevented) dialog.close();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={cn(styles.dialog, className)}
      data-size={size}
      aria-labelledby={titleId}
      aria-describedby={subtitle ? subtitleId : undefined}
      {...{ closedby: closeOnBackdrop ? "any" : "closerequest" }}
      onCancel={(event) => beforeClose?.(event.nativeEvent)}
      onClose={onClose}
      onPointerDown={closeOnBackdrop && lacksClosedBy ? handlePointerDown : undefined}
      onPointerUp={closeOnBackdrop && lacksClosedBy ? handlePointerUp : undefined}
    >
      <DialogCloseContext value={closeDialog}>
        <header className={styles.header}>
          <div className={styles.titles}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            {subtitle && (
              <p id={subtitleId} className={styles.subtitle}>
                {subtitle}
              </p>
            )}
          </div>
          <button type="button" className={styles.close} onClick={closeDialog} aria-label="Cerrar">
            <CloseIcon />
          </button>
        </header>
        <div className={styles.body}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </DialogCloseContext>
    </dialog>
  );
}
