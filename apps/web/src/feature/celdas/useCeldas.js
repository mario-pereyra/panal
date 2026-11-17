import { sumarDias } from "@panal/motor";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router";
import {
  useCambiarActividadMutation,
  useObtenerActividadesQuery,
  useObtenerPanalQuery,
} from "../../api/panalApi.js";
import { useAlternarCelda } from "../../componentes/useAlternarCelda.js";
import { useAvisar } from "../avisos/useAvisos.js";
import { useConexion } from "../conexion/useConexion.js";
import { filtrarPorColmena, filtrarPorPrioridad, quitarFiltros } from "./celdasSlice.js";
import {
  PESTANAS,
  selectCeldasPorPestana,
  selectColmenasDeCeldas,
  selectFiltrosDeCeldas,
  selectHayFiltros,
} from "./celdasSelector.js";

/** Todo lo que necesita "Celdas": la pestaña, las filas, los filtros y las acciones de cada fila. */
export function useCeldas() {
  const dispatch = useDispatch();
  const avisar = useAvisar();
  const { enLinea } = useConexion();
  const [parametros, setParametros] = useSearchParams();
  const pedida = parametros.get("ver");
  const pestana = PESTANAS.includes(pedida) ? pedida : "hoy";

  const panal = useObtenerPanalQuery();
  const activas = useObtenerActividadesQuery("activas");
  // Las archivadas se piden solo al abrir su pestaña.
  const archivadas = useObtenerActividadesQuery("archivadas", { skip: pestana !== "archivadas" });
  const [cambiarActividad] = useCambiarActividadMutation();
  const alternarCelda = useAlternarCelda();

  const pestanas = useSelector(selectCeldasPorPestana);
  const filtros = useSelector(selectFiltrosDeCeldas);
  const hayFiltros = useSelector(selectHayFiltros);
  const colmenas = useSelector(selectColmenasDeCeldas);

  const consulta = pestana === "archivadas" ? archivadas : activas;

  /** Archiva y ofrece deshacer. */
  const archivar = async (fila) => {
    const resultado = await cambiarActividad({ id: fila.id, archivada: true });
    if (resultado.error)
      avisar({ texto: "No se pudo archivar. Inténtalo otra vez.", tono: "error" });
    else
      avisar({
        texto: "Celda archivada",
        accion: {
          etiqueta: "Deshacer",
          mutacion: "cambiarActividad",
          argumentos: { id: fila.id, archivada: false },
        },
      });
  };

  const recuperar = async (fila) => {
    const resultado = await cambiarActividad({ id: fila.id, archivada: false });
    avisar(
      resultado.error
        ? { texto: "No se pudo recuperar. Inténtalo otra vez.", tono: "error" }
        : { texto: "Celda recuperada: vuelve a tu panal." },
    );
  };

  /** Pospone una única al día siguiente. */
  const posponer = async (fila) => {
    const hoy = panal.data?.hoy;
    if (!hoy) return;
    const base = fila.vence && fila.vence > hoy ? fila.vence : hoy;
    const resultado = await cambiarActividad({ id: fila.id, vence: sumarDias(base, 1) });
    avisar(
      resultado.error
        ? { texto: "No se pudo posponer. Inténtalo otra vez.", tono: "error" }
        : { texto: "Pospuesta para el día siguiente." },
    );
  };

  return {
    pestana,
    elegirPestana: (siguiente) => setParametros(siguiente === "hoy" ? {} : { ver: siguiente }),
    ...pestanas,
    cargando: consulta.isLoading || panal.isLoading,
    fallo: consulta.isError,
    reintentar: consulta.refetch,
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
