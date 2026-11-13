import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { marcarAhora } from "./relojSlice.js";

const CADA_MS = 30_000;

/**
 * Mantiene el reloj del store en hora. Se usa una sola vez, en la estructura
 * de la aplicación. Al volver a la pestaña se pone en hora de inmediato.
 */
export function useReloj() {
  const dispatch = useDispatch();

  useEffect(() => {
    const ponerEnHora = () => dispatch(marcarAhora(Date.now()));
    const alVolver = () => {
      if (document.visibilityState === "visible") ponerEnHora();
    };
    const intervalo = setInterval(ponerEnHora, CADA_MS);
    document.addEventListener("visibilitychange", alVolver);
    return () => {
      clearInterval(intervalo);
      document.removeEventListener("visibilitychange", alVolver);
    };
  }, [dispatch]);
}
