import { useDispatch, useSelector } from "react-redux";
import { selectPanal, useObtenerPanalQuery } from "../../store/api.js";
import { useAlternarCelda } from "../../nucleo/panal/useCelda.js";
import {
  selectCeldasDeHoy,
  selectConstancia,
  selectEstadoDeZum,
  selectPanalDeHoy,
  selectRacha,
} from "../../nucleo/panal/panalSelector.js";
import { selectFranjaDeHoy, selectResumenColmenaActiva } from "./hoySelector.js";
import { cerrarFranja } from "./hoySlice.js";

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
