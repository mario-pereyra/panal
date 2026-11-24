import { sumarDias } from "@panal/motor";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router";
import {
  useCambiarActividadMutation,
  useObtenerActividadesQuery,
  useObtenerPanalQuery,
} from "../../store/api.js";
import { useAlternarCelda, useArchivarActividad } from "../../nucleo/panal/useCelda.js";
import { useAvisarResultado } from "../../nucleo/avisos/useAvisos.js";
import { useConexion } from "../../nucleo/conexion/useConexion.js";
import { filtrarPorColmena, filtrarPorPrioridad, quitarFiltros } from "./celdasSlice.js";
import {
  PESTANAS,
  selectCeldasPorPestana,
  selectColmenasDeCeldas,
  selectFiltrosDeCeldas,
  selectHayFiltros,
} from "./celdasSelector.js";
import { AVISOS_AL_POSPONER, AVISOS_AL_RECUPERAR } from "./textos.js";

export function useCeldas() {
  const dispatch = useDispatch();
  const avisarResultado = useAvisarResultado();
  const { enLinea } = useConexion();
  const [parametros] = useSearchParams();
  const pedida = parametros.get("ver");
  const pestana = PESTANAS.includes(pedida) ? pedida : "hoy";

  const panal = useObtenerPanalQuery();
  const activas = useObtenerActividadesQuery("activas");
  const hechas = useObtenerActividadesQuery("hechas", { skip: pestana !== "hechas" });
  const archivadas = useObtenerActividadesQuery("archivadas", { skip: pestana !== "archivadas" });
  const [cambiarActividad] = useCambiarActividadMutation();
  const alternarCelda = useAlternarCelda();
  const archivarActividad = useArchivarActividad();

  const { grupos, conteos } = useSelector(selectCeldasPorPestana);
  const filtros = useSelector(selectFiltrosDeCeldas);
  const hayFiltros = useSelector(selectHayFiltros);
  const colmenas = useSelector(selectColmenasDeCeldas);

  const consulta = { hechas, archivadas }[pestana] ?? activas;

  const archivar = (fila) => archivarActividad(fila.id);

  const recuperar = async (fila) =>
    avisarResultado(await cambiarActividad({ id: fila.id, archivada: false }), AVISOS_AL_RECUPERAR);

  const posponer = async (fila) => {
    const hoy = panal.data?.hoy;
    if (!hoy) return;
    const base = fila.vence && fila.vence > hoy ? fila.vence : hoy;
    avisarResultado(
      await cambiarActividad({ id: fila.id, vence: sumarDias(base, 1) }),
      AVISOS_AL_POSPONER,
    );
  };

  return {
    pestana,
    grupos: grupos[pestana],
    conteos,
    cargando: consulta.isLoading || panal.isLoading,
    fallo: consulta.isError || panal.isError,
    reintentar: () => {
      consulta.refetch();
      panal.refetch();
    },
    enLinea,
    filtros,
    hayFiltros,
    colmenas,
    filtrarPorColmena: (valor) => dispatch(filtrarPorColmena(valor)),
    filtrarPorPrioridad: (valor) => dispatch(filtrarPorPrioridad(valor)),
    quitarFiltros: () => dispatch(quitarFiltros()),
    alternarCelda,
    archivar,
    recuperar,
    posponer,
  };
}
