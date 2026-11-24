import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ponerEnHora } from "./relojSlice.js";

const CADA_MS = 30_000;

/**
 * Mantiene el reloj del store en hora. Se usa una sola vez, en la estructura
 * de la aplicación. Al volver a la pestaña se pone en hora de inmediato.
 */
export function useReloj() {
  const dispatch = useDispatch();

  useEffect(() => {
    const marcar = () => dispatch(ponerEnHora(Date.now()));
    const alVolver = () => {
      if (document.visibilityState === "visible") marcar();
    };
    const intervalo = setInterval(marcar, CADA_MS);
    document.addEventListener("visibilitychange", alVolver);
    return () => {
      clearInterval(intervalo);
      document.removeEventListener("visibilitychange", alVolver);
    };
  }, [dispatch]);
}
