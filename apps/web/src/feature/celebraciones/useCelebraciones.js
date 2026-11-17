import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPanalDeHoy } from "../hoy/hoySelector.js";
import { vaciarCelebraciones } from "./celebracionesSlice.js";
import { selectColaDeCelebraciones } from "./celebracionesSelector.js";

/** Lo que muestra la ventana de celebración y cómo cerrarla. */
export function useCelebraciones() {
  const dispatch = useDispatch();
  const logros = useSelector(selectColaDeCelebraciones);
  const resumen = useSelector(selectPanalDeHoy);
  const cerrar = useCallback(() => dispatch(vaciarCelebraciones()), [dispatch]);
  return { logros, meta: resumen?.meta ?? 5, cerrar };
}
