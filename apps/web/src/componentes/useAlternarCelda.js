import { useCallback, useRef } from "react";
import { useLlenarCeldaMutation, useVaciarCeldaMutation } from "../api/panalApi.js";

/**
 * Llenar o vaciar una celda, desde Hoy, Celdas o una colmena.
 *
 * Mientras el servidor responde por una celda, se ignoran más toques sobre
 * ella: un doble toque no manda dos peticiones. El identificador de una celda
 * nueva nace aquí, así que repetir el envío no crea dos.
 *
 * @returns {(fila: { id: string, llena: boolean, celdaId?: string, vencida?: boolean, colmenaId?: string | null }) => Promise<void>}
 */
export function useAlternarCelda() {
  const [llenarCelda] = useLlenarCeldaMutation();
  const [vaciarCelda] = useVaciarCeldaMutation();
  const enCurso = useRef(new Set());

  return useCallback(
    async (fila) => {
      if (enCurso.current.has(fila.id)) return;
      enCurso.current.add(fila.id);
      try {
        if (fila.llena) await vaciarCelda({ id: fila.celdaId, colmenaId: fila.colmenaId });
        else
          await llenarCelda({
            id: crypto.randomUUID(),
            actividadId: fila.id,
            vencida: fila.vencida,
            colmenaId: fila.colmenaId,
          });
      } finally {
        enCurso.current.delete(fila.id);
      }
    },
    [llenarCelda, vaciarCelda],
  );
}
