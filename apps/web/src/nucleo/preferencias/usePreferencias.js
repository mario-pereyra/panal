import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { elegirMovimiento } from "./preferenciasSlice.js";
import { selectMovimiento } from "./preferenciasSelector.js";

export function useMovimiento() {
  const dispatch = useDispatch();
  return {
    movimiento: useSelector(selectMovimiento),
    elegirMovimiento: (valor) => dispatch(elegirMovimiento(valor)),
  };
}

/** `base.css` apaga animaciones y transiciones con `data-movimiento`. */
export function useAplicarMovimiento() {
  const movimiento = useSelector(selectMovimiento);
  useEffect(() => {
    if (movimiento === "reducido") document.documentElement.dataset.movimiento = "reducido";
    else delete document.documentElement.dataset.movimiento;
  }, [movimiento]);
}
