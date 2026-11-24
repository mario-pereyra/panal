import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToast, removeToast, selectToasts } from "./toastsSlice.js";

export function useToasts() {
  const dispatch = useDispatch();
  const toasts = useSelector(selectToasts);

  const showToast = useCallback((toast, tone) => dispatch(addToast(toast, tone)), [dispatch]);

  const dismissToast = useCallback((id) => dispatch(removeToast(id)), [dispatch]);

  return {
    toasts,
    showToast,
    dismissToast,
  };
}
