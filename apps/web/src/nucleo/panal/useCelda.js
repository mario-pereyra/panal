import { useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  useCambiarActividadMutation,
  useLlenarCeldaMutation,
  useVaciarCeldaMutation,
} from "../../store/api.js";
import { useAvisarResultado } from "../avisos/useAvisos.js";
import { encolarCelebraciones } from "../celebraciones/celebracionesSlice.js";
import { CELDA_ARCHIVADA, celdaNoGuardada, DESHACER, NO_SE_ARCHIVO } from "./textos.js";

/**
 * Llenar o vaciar una celda. Mientras el servidor responde por una celda se
 * ignoran más toques sobre ella, y el identificador nace aquí: un doble toque
 * no manda dos peticiones ni crea dos celdas.
 */
export function useAlternarCelda() {
  const dispatch = useDispatch();
  const avisarResultado = useAvisarResultado();
  const [llenarCelda] = useLlenarCeldaMutation();
  const [vaciarCelda] = useVaciarCeldaMutation();
  const enCurso = useRef(new Set());

  return useCallback(
    async (fila) => {
      if (enCurso.current.has(fila.id)) return;
      enCurso.current.add(fila.id);
      try {
        const resultado = fila.llena
          ? await vaciarCelda({ id: fila.celdaId, colmenaId: fila.colmenaId })
          : await llenarCelda({
              id: crypto.randomUUID(),
              actividadId: fila.id,
              vencida: fila.vencida,
              colmenaId: fila.colmenaId,
            });
        const bien = avisarResultado(resultado, { error: celdaNoGuardada });
        const logros = resultado.data?.celebraciones ?? [];
        if (bien && logros.length > 0) dispatch(encolarCelebraciones(logros));
      } finally {
        enCurso.current.delete(fila.id);
      }
    },
    [dispatch, avisarResultado, llenarCelda, vaciarCelda],
  );
}

export function useArchivarActividad() {
  const avisarResultado = useAvisarResultado();
  const [cambiarActividad] = useCambiarActividadMutation();
  return useCallback(
    async (id) =>
      avisarResultado(await cambiarActividad({ id, archivada: true }), {
        exito: {
          texto: CELDA_ARCHIVADA,
          accion: {
            etiqueta: DESHACER,
            mutacion: "cambiarActividad",
            argumentos: { id, archivada: false },
          },
        },
        error: NO_SE_ARCHIVO,
      }),
    [avisarResultado, cambiarActividad],
  );
}
