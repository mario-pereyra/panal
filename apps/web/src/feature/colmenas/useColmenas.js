import { diaLogico } from "@panal/motor";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { leerError } from "../../store/errores.js";
import {
  selectYo,
  useCambiarColmenaMutation,
  useCrearInvitacionMutation,
  useFundarColmenaMutation,
  useObtenerColmenaQuery,
  useObtenerColmenasQuery,
  useObtenerInvitacionQuery,
  useObtenerPanalQuery,
  useSalirDeColmenaMutation,
} from "../../store/api.js";
import { useAlternarCelda } from "../../nucleo/panal/useCelda.js";
import { useAvisar, useAvisarResultado } from "../../nucleo/avisos/useAvisos.js";
import { useConexion } from "../../nucleo/conexion/useConexion.js";
import {
  CAMBIOS_GUARDADOS,
  COLMENA_AJENA,
  ahoraFunda,
  ERROR_AL_CARGAR_COLMENA,
  fundaste,
  quedoArchivada,
  saliste,
  textoDeVencimiento,
  volvio,
  yaNoEsta,
} from "./textos.js";
import { elegirPestanaDeColmena } from "./colmenasSlice.js";
import {
  selectCeldasDeColmena,
  selectColmena,
  selectColmenar,
  selectColmenasArchivadas,
  selectPestanaDeColmena,
} from "./colmenasSelector.js";
import { selectColmenasActivas } from "../../nucleo/panal/panalSelector.js";

export function useColmenas() {
  const consulta = useObtenerColmenasQuery();
  const panal = useObtenerPanalQuery();
  return {
    cargando: consulta.isLoading,
    fallo: consulta.isError,
    reintentar: consulta.refetch,
    hoy: panal.data?.hoy,
    activas: useSelector(selectColmenasActivas),
    colmenar: useSelector(selectColmenar),
    archivadas: useSelector(selectColmenasArchivadas),
  };
}

export function useColmena(id) {
  const dispatch = useDispatch();
  const navegar = useNavigate();
  const avisarResultado = useAvisarResultado();
  const { enLinea } = useConexion();
  const consulta = useObtenerColmenaQuery(id);
  const colmena = useSelector((estado) => selectColmena(estado, id));
  const celdas = useSelector((estado) => selectCeldasDeColmena(estado, id));
  const pestana = useSelector(selectPestanaDeColmena);
  const alternarCelda = useAlternarCelda();
  const [salirDeColmena, salida] = useSalirDeColmenaMutation();
  const [cambiarColmena, cambio] = useCambiarColmenaMutation();

  const error = leerError(consulta.error);
  let fallo = null;
  if (error?.codigo === "sin_permiso" || error?.codigo === "no_existe") fallo = COLMENA_AJENA;
  else if (error) fallo = { titulo: ERROR_AL_CARGAR_COLMENA, reintentar: consulta.refetch };

  const dejar = (resultado, exito) => {
    const bien = avisarResultado(resultado, { exito, error: (motivo) => motivo.mensaje });
    if (bien) navegar("/colmenas", { replace: true });
    return bien;
  };
  const salir = async () =>
    dejar(
      await salirDeColmena({ colmenaId: id, personaId: colmena.miId }),
      saliste(colmena.nombre),
    );
  const archivar = async () =>
    dejar(await cambiarColmena({ id, archivada: true }), quedoArchivada(colmena.nombre));

  const quedarse = (resultado, exito) =>
    avisarResultado(resultado, { exito, error: (motivo) => motivo.mensaje });
  const recuperar = async () =>
    quedarse(await cambiarColmena({ id, archivada: false }), volvio(colmena.nombre));
  const traspasar = async (abeja) =>
    quedarse(await cambiarColmena({ id, fundadoraId: abeja.id }), ahoraFunda(abeja.nombre));
  const quitar = async (abeja) =>
    quedarse(await salirDeColmena({ colmenaId: id, personaId: abeja.id }), yaNoEsta(abeja.nombre));

  return {
    colmena,
    celdas,
    pestana,
    elegirPestana: (valor) => dispatch(elegirPestanaDeColmena(valor)),
    cargando: consulta.isLoading,
    fallo,
    enLinea,
    alternarCelda,
    salir,
    archivar,
    recuperar,
    traspasar,
    quitar,
    ocupada: salida.isLoading || cambio.isLoading,
  };
}

export function useFormularioDeColmena(colmena) {
  const navegar = useNavigate();
  const avisar = useAvisar();
  const { enLinea } = useConexion();
  const hoy = useObtenerPanalQuery().data?.hoy;
  const [fundarColmena, fundada] = useFundarColmenaMutation();
  const [cambiarColmena, cambiada] = useCambiarColmenaMutation();

  const guardar = async (datos) => {
    const resultado = colmena
      ? await cambiarColmena({ id: colmena.id, ...datos })
      : await fundarColmena(datos);
    if (resultado.error) return { ok: false, campos: leerError(resultado.error).campos };
    if (colmena) avisar({ texto: CAMBIOS_GUARDADOS });
    else {
      avisar({ texto: fundaste(datos.nombre) });
      navegar(`/colmenas/${resultado.data.colmena.id}`);
    }
    return { ok: true };
  };

  return {
    guardar,
    guardando: fundada.isLoading || cambiada.isLoading,
    error: leerError(fundada.error ?? cambiada.error),
    enLinea,
    hoy,
  };
}

export function useInvitacion(colmenaId) {
  const consulta = useObtenerInvitacionQuery(colmenaId);
  const detalle = useObtenerColmenaQuery(colmenaId);
  const colmena = useSelector((estado) => selectColmena(estado, colmenaId));
  const yo = useSelector(selectYo);
  const [crearInvitacion, creacion] = useCrearInvitacionMutation();
  const invitacion = consulta.data?.invitacion ?? null;
  const sinEnlace = consulta.isSuccess && !invitacion;

  // La primera vez no hay enlace: se crea al abrir la ventana. La ref evita
  // pedirlo dos veces cuando StrictMode monta el efecto dos veces en desarrollo.
  const pedido = useRef(false);
  useEffect(() => {
    if (sinEnlace && !pedido.current) {
      pedido.current = true;
      crearInvitacion(colmenaId);
    }
  }, [sinEnlace, crearInvitacion, colmenaId]);

  return {
    invitacion,
    vencimiento:
      invitacion && colmena && yo
        ? textoDeVencimiento(diaLogico(invitacion.venceEn, yo.zonaHoraria), colmena.hoy)
        : null,
    cargando: consulta.isLoading || detalle.isLoading,
    error: leerError(consulta.error ?? creacion.error),
    colmena,
    crear: () => crearInvitacion(colmenaId),
    creando: creacion.isLoading,
  };
}
