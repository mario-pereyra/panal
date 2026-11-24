import { actividad as esquemaDeActividad } from "@panal/contratos";
import { gotasDeCelda } from "@panal/motor";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router";
import { leerError } from "../../store/errores.js";
import { useFondo } from "../../componentes/ui/useFondo.js";
import { useFormulario } from "../../componentes/ui/useFormulario.js";
import {
  selectYo,
  useGuardarActividadMutation,
  useObtenerActividadesQuery,
  useObtenerColmenasQuery,
  useObtenerPanalQuery,
} from "../../store/api.js";
import { useAvisar } from "../../nucleo/avisos/useAvisos.js";
import { permisosDe } from "../../nucleo/panal/filas.js";
import { useArchivarActividad } from "../../nucleo/panal/useCelda.js";
import { useConexion } from "../../nucleo/conexion/useConexion.js";
import { descartarBorrador, guardarBorrador } from "./actividadSlice.js";
import {
  selectActividadAEditar,
  selectBorradorDeCelda,
  selectPuedeMarcarAlta,
} from "./actividadSelector.js";
import { selectColmenasActivas } from "../../nucleo/panal/panalSelector.js";
import { CAMBIOS_GUARDADOS, CELDA_CREADA, TIPOS } from "./textos.js";

/** Los campos del formulario: más cómodos de editar que la forma del contrato. */
const VALORES_NUEVOS = {
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
function aActividad(valores) {
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
  const archivarActividad = useArchivarActividad();

  const actividad = useSelector((estado) => selectActividadAEditar(estado, id));
  const yo = useSelector(selectYo);
  const borrador = useSelector((estado) => selectBorradorDeCelda(estado, clave));
  const colmenas = useSelector(selectColmenasActivas);
  const puedeMarcarAlta = useSelector((estado) => selectPuedeMarcarAlta(estado, id));

  // Una actividad nueva nace con su identificador: si el envío se repite tras
  // un fallo, el servidor no crea otra.
  const [idNuevo] = useState(() => crypto.randomUUID());
  const colmenaPedida = parametros.get("colmena");
  const inicial = editando
    ? actividad
      ? aValores(actividad)
      : null
    : { ...VALORES_NUEVOS, id: idNuevo, colmenaId: colmenaPedida ?? "" };

  const hoy = panal.data?.hoy ?? activas.data?.hoy;
  const permisos = actividad && yo && hoy ? permisosDe(actividad, { miId: yo.id, hoy }) : null;
  const buscando = editando && (actividad ? !permisos : activas.isLoading || archivadas.isLoading);
  const noExiste = editando && !buscando && !permisos?.editar;

  /** Cerrar la ventana: vuelve a la pantalla de fondo o, si se abrió con un enlace directo, a su lugar. */
  const salir = () => salirDeLaVentana(colmenaPedida ? `/colmenas/${colmenaPedida}` : "/celdas");

  const recordar = useCallback(
    (valores) => dispatch(guardarBorrador({ clave, valores })),
    [dispatch, clave],
  );
  const olvidar = () => dispatch(descartarBorrador(clave));

  const guardar = async (datos, valores) => {
    const resultado = await guardarActividad({ id: valores.id, ...datos });
    if (resultado.error) return { ok: false, campos: leerError(resultado.error).campos };
    olvidar();
    avisar({ texto: editando ? CAMBIOS_GUARDADOS : CELDA_CREADA });
    return { ok: true };
  };

  const archivar = async () => {
    const bien = await archivarActividad(id);
    if (bien) olvidar();
    return bien;
  };

  return {
    editando,
    clave,
    inicial: borrador ?? inicial,
    hayBorrador: Boolean(borrador),
    buscando,
    noExiste,
    archivada: Boolean(actividad?.archivadaEl),
    hoy,
    puedeArchivar: Boolean(permisos?.archivar),
    puedeCambiarDeTipo: !editando || Boolean(permisos?.cambiarDeTipo),
    colmenas,
    puedeMarcarAlta: puedeMarcarAlta || actividad?.prioridad === "alta",
    enLinea,
    guardando: guardado.isLoading,
    error: leerError(guardado.error),
    recordar,
    olvidar,
    guardar,
    archivar,
    salir,
  };
}

/**
 * El formulario abierto de la ventana: sus valores, lo que se deduce de ellos
 * y el borrador al día. Va dentro del formulario, que se monta de nuevo al
 * cambiar de celda.
 */
export function useFormularioDeActividad(actividad) {
  const formulario = useFormulario(esquemaDeActividad, actividad.inicial, {
    convertir: aActividad,
  });
  const { valores, cambiar } = formulario;
  const { puedeCambiarDeTipo, colmenas, recordar } = actividad;

  const [deInicio] = useState(valores);
  useEffect(() => {
    if (valores !== deInicio) recordar(valores);
  }, [valores, deInicio, recordar]);

  const deducido = useMemo(() => {
    const datos = aActividad(valores);
    return {
      unica: datos.tipo === "unica",
      regla: datos.regla,
      gotas: gotasDeCelda(datos),
      enColmena: Boolean(datos.colmenaId),
      colmena: colmenas.find((una) => una.id === datos.colmenaId) ?? null,
      tipos: puedeCambiarDeTipo ? TIPOS : TIPOS.filter((tipo) => tipo.valor === datos.tipo),
    };
  }, [valores, colmenas, puedeCambiarDeTipo]);

  return {
    ...formulario,
    ...deducido,
    conCambios: !formulario.sinCambios || actividad.hayBorrador,
    elegirColmena: (colmenaId) => cambiar({ colmenaId, asignadaA: "", tipo: "unica" }),
  };
}
