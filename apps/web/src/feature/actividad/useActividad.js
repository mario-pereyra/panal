import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router";
import { leerError } from "../../api/errores.js";
import { useFondo } from "../../componentes/useFondo.js";
import {
  useCambiarActividadMutation,
  useGuardarActividadMutation,
  useObtenerActividadesQuery,
  useObtenerColmenasQuery,
  useObtenerPanalQuery,
} from "../../api/panalApi.js";
import { useAvisar } from "../avisos/useAvisos.js";
import { useConexion } from "../conexion/useConexion.js";
import { descartarBorrador, guardarBorrador } from "./actividadSlice.js";
import {
  selectActividadAEditar,
  selectBorradorDeCelda,
  selectColmenasParaElegir,
  selectPuedeMarcarAlta,
} from "./actividadSelector.js";

/** Los campos del formulario: más cómodos de editar que la forma del contrato. */
export const VALORES_NUEVOS = {
  id: null,
  titulo: "",
  tipo: "unica",
  vence: "",
  alta: false,
  clase: "diaria",
  dias: [0, 2, 4],
  veces: 3,
  diaDelMes: 1,
  colmenaId: "",
  asignadaA: "",
};

function reglaDe(valores) {
  switch (valores.clase) {
    case "dias":
      return { clase: "dias", dias: valores.dias };
    case "veces":
      return { clase: "veces", veces: valores.veces };
    case "mes":
      return { clase: "mes", dia: valores.diaDelMes };
    default:
      return { clase: "diaria" };
  }
}

/** De los campos a la forma del contrato `actividad`. */
export function aActividad(valores) {
  const unica = valores.tipo === "unica";
  return {
    titulo: valores.titulo,
    tipo: valores.tipo,
    prioridad: unica && valores.alta ? "alta" : "normal",
    vence: unica && valores.vence ? valores.vence : null,
    regla: unica ? null : reglaDe(valores),
    colmenaId: valores.colmenaId || null,
    asignadaA: valores.colmenaId && valores.asignadaA ? valores.asignadaA : null,
  };
}

/** De una actividad guardada a los campos del formulario. */
function aValores(actividad) {
  const regla = actividad.regla ?? {};
  return {
    ...VALORES_NUEVOS,
    id: actividad.id,
    titulo: actividad.titulo,
    tipo: actividad.tipo,
    vence: actividad.vence ?? "",
    alta: actividad.prioridad === "alta",
    clase: regla.clase ?? "diaria",
    dias: regla.dias ?? VALORES_NUEVOS.dias,
    veces: regla.veces ?? VALORES_NUEVOS.veces,
    diaDelMes: regla.dia ?? VALORES_NUEVOS.diaDelMes,
    colmenaId: actividad.colmenaId ?? "",
    asignadaA: actividad.asignadaA ?? "",
  };
}

/**
 * Todo lo que necesita la ventana de actividad: si crea o edita, los valores
 * de partida (el borrador, si lo hay), las colmenas y cómo guardar.
 */
export function useActividad() {
  const { id } = useParams();
  const [parametros] = useSearchParams();
  const { salir: salirDeLaVentana } = useFondo();
  const dispatch = useDispatch();
  const avisar = useAvisar();
  const { enLinea } = useConexion();
  const clave = id ?? "nueva";
  const editando = Boolean(id);

  const panal = useObtenerPanalQuery();
  const activas = useObtenerActividadesQuery("activas");
  const archivadas = useObtenerActividadesQuery("archivadas", { skip: !editando });
  useObtenerColmenasQuery();
  const [guardarActividad, guardado] = useGuardarActividadMutation();
  const [cambiarActividad, cambio] = useCambiarActividadMutation();

  const actividad = useSelector((estado) => selectActividadAEditar(estado, id));
  const borrador = useSelector((estado) => selectBorradorDeCelda(estado, clave));
  const colmenas = useSelector(selectColmenasParaElegir);
  const puedeMarcarAlta = useSelector((estado) => selectPuedeMarcarAlta(estado, id));

  const colmenaPedida = parametros.get("colmena");
  const inicial = editando
    ? actividad
      ? aValores(actividad)
      : null
    : { ...VALORES_NUEVOS, colmenaId: colmenaPedida ?? "" };

  const buscando = editando && !actividad && (activas.isLoading || archivadas.isLoading);
  const noExiste = editando && !actividad && !buscando;

  /** Cerrar la ventana: vuelve a la pantalla de fondo o, si se abrió con un enlace directo, a su lugar. */
  const salir = () => salirDeLaVentana(colmenaPedida ? `/colmenas/${colmenaPedida}` : "/celdas");

  const recordar = (valores) => dispatch(guardarBorrador({ clave, valores }));
  const olvidar = () => dispatch(descartarBorrador(clave));

  /**
   * Guarda. Una actividad nueva lleva su identificador desde el borrador:
   * si el envío se repite, el servidor no crea otra.
   * @returns {Promise<{ ok: boolean, campos?: Record<string, string> }>}
   */
  const guardar = async (datos, valores) => {
    let resultado;
    if (editando) {
      // El tipo no cambia al editar, y una única no lleva regla.
      const { tipo: _tipo, regla, ...cambios } = datos;
      resultado = await cambiarActividad({ id, ...cambios, ...(regla ? { regla } : {}) });
    } else {
      const nuevoId = valores.id ?? crypto.randomUUID();
      if (!valores.id) recordar({ ...valores, id: nuevoId });
      resultado = await guardarActividad({ id: nuevoId, ...datos });
    }
    if (resultado.error) return { ok: false, campos: leerError(resultado.error).campos };
    olvidar();
    avisar({ texto: editando ? "Cambios guardados" : "Celda creada: ya está en tu panal" });
    return { ok: true };
  };

  const archivar = async () => {
    const resultado = await cambiarActividad({ id, archivada: true });
    if (resultado.error) return false;
    olvidar();
    avisar({
      texto: "Celda archivada",
      accion: {
        etiqueta: "Deshacer",
        mutacion: "cambiarActividad",
        argumentos: { id, archivada: false },
      },
    });
    return true;
  };

  return {
    editando,
    clave,
    inicial: borrador ?? inicial,
    hayBorrador: Boolean(borrador),
    buscando,
    noExiste,
    archivada: Boolean(actividad?.archivadaEl),
    hoy: panal.data?.hoy ?? activas.data?.hoy,
    colmenas,
    puedeMarcarAlta: puedeMarcarAlta || actividad?.prioridad === "alta",
    enLinea,
    guardando: guardado.isLoading || cambio.isLoading,
    error: leerError(guardado.error ?? cambio.error),
    recordar,
    olvidar,
    guardar,
    archivar,
    salir,
  };
}
