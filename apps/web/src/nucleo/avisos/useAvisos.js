import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { panalApi } from "../../store/api.js";
import { leerError } from "../../store/errores.js";
import { avisar, descartarAviso } from "./avisosSlice.js";
import { selectAvisoActual } from "./avisosSelector.js";

export function useAvisar() {
  const dispatch = useDispatch();
  return useCallback((aviso) => dispatch(avisar(aviso)), [dispatch]);
}

/**
 * Avisa cómo terminó una mutación y dice si salió bien. `error` puede ser una
 * función que arma el texto con el error ya leído; sin `exito`, un acierto no avisa.
 */
export function useAvisarResultado() {
  const avisarAhora = useAvisar();
  return useCallback(
    (resultado, { exito, error }) => {
      if (resultado.error) {
        const texto = typeof error === "function" ? error(leerError(resultado.error)) : error;
        avisarAhora({ texto, tono: "error" });
        return false;
      }
      if (exito) avisarAhora(typeof exito === "string" ? { texto: exito } : exito);
      return true;
    },
    [avisarAhora],
  );
}

/** Para la región de avisos: el aviso actual, descartarlo y ejecutar su acción. */
export function useAvisos() {
  const dispatch = useDispatch();
  const aviso = useSelector(selectAvisoActual);

  const descartar = useCallback(() => {
    if (aviso) dispatch(descartarAviso(aviso.id));
  }, [aviso, dispatch]);

  const ejecutarAccion = useCallback(() => {
    if (!aviso?.accion) return;
    const { mutacion, argumentos } = aviso.accion;
    dispatch(panalApi.endpoints[mutacion].initiate(argumentos));
    dispatch(descartarAviso(aviso.id));
  }, [aviso, dispatch]);

  return { aviso, descartar, ejecutarAccion };
}
