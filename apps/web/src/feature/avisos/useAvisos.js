import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { panalApi } from "../../api/panalApi.js";
import { avisar, descartarAviso } from "./avisosSlice.js";
import { selectAvisoActual } from "./avisosSelector.js";

/** Para cualquier pantalla: la función que muestra un aviso. */
export function useAvisar() {
  const dispatch = useDispatch();
  return useCallback((aviso) => dispatch(avisar(aviso)), [dispatch]);
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
