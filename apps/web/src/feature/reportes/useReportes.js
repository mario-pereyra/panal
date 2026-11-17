import { useDispatch, useSelector } from "react-redux";
import { useObtenerPanalQuery, useObtenerReporteQuery } from "../../api/panalApi.js";
import { selectConstancia, selectPersona, selectRacha } from "../hoy/hoySelector.js";
import { elegirPeriodo } from "./reportesSlice.js";
import {
  selectAportePorColmena,
  selectCeldasPorDia,
  selectCumplimientoPorRonda,
  selectPeriodo,
  selectRangoDelPeriodo,
  selectRepartoPorTipo,
  selectSinHistorial,
} from "./reportesSelector.js";

/** Todo lo que muestra Reportes. */
export function useReportes() {
  const dispatch = useDispatch();
  const panal = useObtenerPanalQuery();
  const rango = useSelector(selectRangoDelPeriodo);
  const consulta = useObtenerReporteQuery(rango ?? undefined, { skip: !rango });

  return {
    periodo: useSelector(selectPeriodo),
    elegirPeriodo: (valor) => dispatch(elegirPeriodo(valor)),
    cargando: panal.isLoading || (consulta.isLoading && !consulta.data),
    actualizando: consulta.isFetching,
    fallo: panal.isError || consulta.isError,
    reintentar: () => {
      panal.refetch();
      if (rango) consulta.refetch();
    },
    persona: useSelector(selectPersona),
    racha: useSelector(selectRacha),
    constancia: useSelector(selectConstancia),
    celdasPorDia: useSelector(selectCeldasPorDia),
    rondas: useSelector(selectCumplimientoPorRonda),
    reparto: useSelector(selectRepartoPorTipo),
    colmenas: useSelector(selectAportePorColmena),
    sinHistorial: useSelector(selectSinHistorial),
  };
}
