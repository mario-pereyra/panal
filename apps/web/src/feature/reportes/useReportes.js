import { useDispatch, useSelector } from "react-redux";
import { useObtenerPanalQuery, useObtenerReporteQuery } from "../../store/api.js";
import { selectConstancia, selectPersona, selectRacha } from "../../nucleo/panal/panalSelector.js";
import { elegirPeriodo } from "./reportesSlice.js";
import {
  selectAportePorColmena,
  selectCeldasPorDia,
  selectCumplimientoPorRonda,
  selectPeriodo,
  selectRangoDelPeriodo,
  selectRepartoPorTipo,
  selectSinHistorial,
  selectTablaDeCeldasPorDia,
  selectTablaDeConstancia,
  selectTablaDeRondas,
} from "./reportesSelector.js";

export function useReportes() {
  const dispatch = useDispatch();
  const panal = useObtenerPanalQuery();
  const rango = useSelector(selectRangoDelPeriodo);
  const consulta = useObtenerReporteQuery(rango ?? undefined, { skip: !rango });
  const celdasPorDia = useSelector(selectCeldasPorDia);

  return {
    periodo: useSelector(selectPeriodo),
    elegirPeriodo: (valor) => dispatch(elegirPeriodo(valor)),
    cargando: panal.isLoading || (consulta.isLoading && !consulta.data),
    actualizando: consulta.isFetching,
    // Si una recarga falla, se siguen mostrando los datos que ya había.
    fallo: (panal.isError || consulta.isError) && !celdasPorDia,
    reintentar: () => {
      panal.refetch();
      if (rango) consulta.refetch();
    },
    persona: useSelector(selectPersona),
    racha: useSelector(selectRacha),
    constancia: useSelector(selectConstancia),
    tablaDeConstancia: useSelector(selectTablaDeConstancia),
    celdasPorDia,
    tablaDeCeldasPorDia: useSelector(selectTablaDeCeldasPorDia),
    rondas: useSelector(selectCumplimientoPorRonda),
    tablaDeRondas: useSelector(selectTablaDeRondas),
    reparto: useSelector(selectRepartoPorTipo),
    colmenas: useSelector(selectAportePorColmena),
    sinHistorial: useSelector(selectSinHistorial),
  };
}
