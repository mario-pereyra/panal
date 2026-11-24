import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPanalDeHoy } from "../panal/panalSelector.js";
import { vaciarCelebraciones } from "./celebracionesSlice.js";
import { selectColaDeCelebraciones } from "./celebracionesSelector.js";

export function useCelebraciones() {
  const dispatch = useDispatch();
  const logros = useSelector(selectColaDeCelebraciones);
  const resumen = useSelector(selectPanalDeHoy);
  const cerrar = useCallback(() => dispatch(vaciarCelebraciones()), [dispatch]);
  // Solo hay logros después de llenar una celda, con el panal ya cargado.
  return { logros, meta: resumen?.meta, cerrar };
}
