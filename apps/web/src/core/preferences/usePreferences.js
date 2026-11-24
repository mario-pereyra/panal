import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { prefersReducedMotion } from "../../lib/device.js";
import {
  selectReduceMotion,
  setReduceMotion as setReduceMotionAction,
} from "./preferencesSlice.js";

export function useReducedMotion() {
  const dispatch = useDispatch();
  const reduceMotion = useSelector(selectReduceMotion);
  const systemReduceMotion = prefersReducedMotion();
  const effectiveReduceMotion = Boolean(reduceMotion || systemReduceMotion);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (reduceMotion) {
      document.documentElement.dataset.movimiento = "reducido";
    } else {
      delete document.documentElement.dataset.movimiento;
    }
  }, [reduceMotion]);

  const setReduceMotion = useCallback(
    (value) => dispatch(setReduceMotionAction(value)),
    [dispatch],
  );

  return {
    reduceMotion,
    systemReduceMotion,
    effectiveReduceMotion,
    setReduceMotion,
  };
}
