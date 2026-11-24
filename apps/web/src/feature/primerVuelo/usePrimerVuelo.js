import { gotasDeCelda } from "@panal/motor";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { zonaDelDispositivo } from "../../lib/dispositivo.js";
import { leerError } from "../../store/errores.js";
import {
  useCambiarPerfilMutation,
  useCompletarPrimerVueloMutation,
  useGuardarActividadMutation,
  useLlenarCeldaMutation,
} from "../../store/api.js";
import {
  actividadCreada,
  celdaLlenada,
  elegirMeta,
  irAlPaso,
  terminarRecorrido,
} from "./primerVueloSlice.js";
import { selectPrimerVuelo } from "./primerVueloSelector.js";

/** Lo primero que vale una celda: una recurrente diaria. */
const GOTAS_DE_LA_PRIMERA = gotasDeCelda({ tipo: "recurrente" });

/**
 * Cada paso del primer vuelo se guarda en el servidor antes de seguir; si
 * falla, se queda en el mismo paso con lo elegido.
 */
export function usePrimerVuelo() {
  const dispatch = useDispatch();
  const navegar = useNavigate();
  const recorrido = useSelector(selectPrimerVuelo);
  const [cambiarPerfil, perfil] = useCambiarPerfilMutation();
  const [guardarActividad, actividad] = useGuardarActividadMutation();
  const [llenarCelda, celda] = useLlenarCeldaMutation();
  const [completar, terminado] = useCompletarPrimerVueloMutation();

  const confirmarMeta = async () => {
    const resultado = await cambiarPerfil({
      metaDiaria: recorrido.meta,
      zonaHoraria: zonaDelDispositivo(),
    });
    if (!resultado.error) dispatch(irAlPaso(2));
  };

  const crearPrimeraCelda = async ({ titulo }) => {
    const id = recorrido.actividadId ?? crypto.randomUUID();
    const resultado = await guardarActividad({
      id,
      titulo,
      tipo: "recurrente",
      regla: { clase: "diaria" },
    });
    if (!resultado.error) dispatch(actividadCreada({ id, titulo }));
  };

  const llenarPrimeraCelda = async () => {
    if (recorrido.celdaId || celda.isLoading) return;
    const id = crypto.randomUUID();
    const resultado = await llenarCelda({ id, actividadId: recorrido.actividadId });
    // Si ya estaba llena (volvió tras salir), cuenta igual.
    if (!resultado.error || leerError(resultado.error).codigo === "celda_ya_llena")
      dispatch(celdaLlenada(id));
  };

  const irAMiPanal = async () => {
    const resultado = await completar({ metaDiaria: recorrido.meta });
    if (resultado.error) return;
    dispatch(terminarRecorrido());
    navegar("/", { replace: true });
  };

  const error = leerError(
    perfil.error ?? actividad.error ?? (recorrido.celdaId ? null : celda.error) ?? terminado.error,
  );

  return {
    ...recorrido,
    gotas: GOTAS_DE_LA_PRIMERA,
    guardando: perfil.isLoading || actividad.isLoading || celda.isLoading || terminado.isLoading,
    error,
    elegirMeta: (meta) => dispatch(elegirMeta(meta)),
    volver: () => dispatch(irAlPaso(Math.max(1, recorrido.paso - 1))),
    confirmarMeta,
    crearPrimeraCelda,
    llenarPrimeraCelda,
    irAMiPanal,
  };
}
