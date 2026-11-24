import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { CloseIcon } from "../../components/ui/icons.jsx";
import { announce } from "../../lib/a11y.js";
import { panalApi } from "../../store/api.js";
import styles from "./ToastList.module.css";
import { useToasts } from "./useToasts.js";

const TOAST_DURATION_MS = 6000;

export function ToastList() {
  const dispatch = useDispatch();
  const { toasts, dismissToast } = useToasts();
  const currentToast = toasts[0] ?? null;
  const toastRef = useRef(null);
  const timerRef = useRef(0);

  useEffect(() => {
    if (!currentToast) return undefined;
    const element = toastRef.current;
    if (element && typeof element.showPopover === "function" && !element.matches(":popover-open")) {
      element.showPopover();
    }
    const announcement = currentToast.action
      ? `${currentToast.message}. Acciones disponibles.`
      : currentToast.message;
    announce(announcement);

    timerRef.current = setTimeout(() => dismissToast(currentToast.id), TOAST_DURATION_MS);
    return () => clearTimeout(timerRef.current);
  }, [currentToast, dismissToast]);

  const pauseTimer = () => clearTimeout(timerRef.current);

  const resumeTimer = () => {
    pauseTimer();
    if (!currentToast || toastRef.current?.contains(document.activeElement)) return;
    timerRef.current = setTimeout(() => dismissToast(currentToast.id), TOAST_DURATION_MS);
  };

  const closeWith = (callback) => {
    const hadFocus = toastRef.current?.contains(document.activeElement);
    callback();
    if (hadFocus) document.getElementById("contenido")?.focus({ preventScroll: true });
  };

  const handleAction = () => {
    if (!currentToast?.action) return;
    const { action } = currentToast;
    if (typeof action.onClick === "function") {
      action.onClick();
    } else if (typeof action.onAction === "function") {
      action.onAction();
    } else if (action.mutation && panalApi.endpoints[action.mutation]) {
      dispatch(panalApi.endpoints[action.mutation].initiate(action.args));
    }
    dismissToast(currentToast.id);
  };

  return (
    <section aria-label="Avisos">
      {currentToast && (
        <div
          key={currentToast.id}
          ref={toastRef}
          className={styles.toast}
          data-tone={currentToast.tone}
          popover="manual"
          onPointerEnter={pauseTimer}
          onPointerLeave={resumeTimer}
          onFocus={pauseTimer}
          onBlur={resumeTimer}
        >
          <p className={styles.message}>{currentToast.message}</p>
          {currentToast.action && (
            <button type="button" className={styles.action} onClick={() => closeWith(handleAction)}>
              {currentToast.action.label ?? "Deshacer"}
            </button>
          )}
          <button
            type="button"
            className={styles.close}
            onClick={() => closeWith(() => dismissToast(currentToast.id))}
            aria-label="Cerrar este aviso"
          >
            <CloseIcon />
          </button>
        </div>
      )}
    </section>
  );
}
