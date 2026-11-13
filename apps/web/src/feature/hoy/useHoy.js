import { useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import {
  useLlenarCeldaMutation,
  useObtenerPanalQuery,
  useVaciarCeldaMutation,
} from "../../api/panalApi.js";
import {
  selectCeldasDeHoy,
  selectConstancia,
  selectEstadoDeZum,
  selectPanal,
  selectPanalDeHoy,
  selectRacha,
  selectResumenColmenaActiva,
} from "./hoySelector.js";

/**
 * Todo lo que necesita la pantalla "Hoy": los datos ya calculados y la acción
 * de llenar o vaciar una celda.
 */
export function useHoy() {
  const consulta = useObtenerPanalQuery();
  const [llenarCelda] = useLlenarCeldaMutation();
  const [vaciarCelda] = useVaciarCeldaMutation();

  const panal = useSelector(selectPanal);
  const celdas = useSelector(selectCeldasDeHoy);
  const resumen = useSelector(selectPanalDeHoy);
  const racha = useSelector(selectRacha);
  const zum = useSelector(selectEstadoDeZum);
  const colmena = useSelector(selectResumenColmenaActiva);
  const constancia = useSelector(selectConstancia);

  // Mientras el servidor responde por una celda, se ignoran más toques sobre ella.
  const enCurso = useRef(new Set());

  const alternarCelda = useCallback(
    async (fila) => {
      if (enCurso.current.has(fila.id)) return;
      enCurso.current.add(fila.id);
      try {
        if (fila.llena) await vaciarCelda(fila.celdaId);
        else {
          // El identificador nace aquí: repetir el envío no crea dos celdas.
          await llenarCelda({
            id: crypto.randomUUID(),
            actividadId: fila.id,
            vencida: fila.vencida,
          });
        }
      } finally {
        enCurso.current.delete(fila.id);
      }
    },
    [llenarCelda, vaciarCelda],
  );

  return {
    cargando: consulta.isLoading,
    fallo: consulta.isError,
    reintentar: consulta.refetch,
    hoy: panal?.hoy,
    persona: panal?.persona,
    zum,
    resumen,
    celdas,
    racha,
    colmena,
    constancia,
    alternarCelda,
  };
}
