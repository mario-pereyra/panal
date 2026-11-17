import { useDispatch, useSelector } from "react-redux";
import { useObtenerPanalQuery } from "../../api/panalApi.js";
import { useAlternarCelda } from "../../componentes/useAlternarCelda.js";
import {
  selectCeldasDeHoy,
  selectConstancia,
  selectEstadoDeZum,
  selectFranjaDeHoy,
  selectPanal,
  selectPanalDeHoy,
  selectRacha,
  selectResumenColmenaActiva,
} from "./hoySelector.js";
import { cerrarFranja } from "./hoySlice.js";

/**
 * Todo lo que necesita la pantalla "Hoy": los datos ya calculados y la acción
 * de llenar o vaciar una celda.
 */
export function useHoy() {
  const consulta = useObtenerPanalQuery();
  const alternarCelda = useAlternarCelda();

  const panal = useSelector(selectPanal);
  const celdas = useSelector(selectCeldasDeHoy);
  const resumen = useSelector(selectPanalDeHoy);
  const racha = useSelector(selectRacha);
  const zum = useSelector(selectEstadoDeZum);
  const colmena = useSelector(selectResumenColmenaActiva);
  const constancia = useSelector(selectConstancia);
  const franja = useSelector(selectFranjaDeHoy);
  const dispatch = useDispatch();

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
    franja,
    cerrarFranja: () => dispatch(cerrarFranja(panal.hoy)),
    alternarCelda,
  };
}
