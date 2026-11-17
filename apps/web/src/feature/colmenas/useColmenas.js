import { diaLogico } from "@panal/motor";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { leerError } from "../../api/errores.js";
import {
  useAceptarInvitacionMutation,
  useCambiarColmenaMutation,
  useCrearInvitacionMutation,
  useFundarColmenaMutation,
  useObtenerColmenaQuery,
  useObtenerColmenasQuery,
  useObtenerInvitacionQuery,
  useObtenerPanalQuery,
  useSalirDeColmenaMutation,
  useVerInvitacionQuery,
} from "../../api/panalApi.js";
import { useAlternarCelda } from "../../componentes/useAlternarCelda.js";
import { useAvisar } from "../avisos/useAvisos.js";
import { useConexion } from "../conexion/useConexion.js";
import { guardarInvitacion, olvidarInvitacion } from "../sesion/sesionSlice.js";
import { selectYo } from "../sesion/sesionSelector.js";
import { useYo } from "../sesion/useSesion.js";
import { textoDeVencimiento } from "./textos.js";
import { elegirPestanaDeColmena } from "./colmenasSlice.js";
import {
  selectCeldasDeColmena,
  selectColmena,
  selectColmenar,
  selectColmenasActivas,
  selectPestanaDeColmena,
} from "./colmenasSelector.js";

/** P07. Las colmenas en marcha y el colmenar. */
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
  };
}

/** P08. El detalle de una colmena y lo que se puede hacer en ella. */
export function useColmena(id) {
  const dispatch = useDispatch();
  const navegar = useNavigate();
  const avisar = useAvisar();
  const { enLinea } = useConexion();
  const consulta = useObtenerColmenaQuery(id);
  const colmena = useSelector((estado) => selectColmena(estado, id));
  const celdas = useSelector((estado) => selectCeldasDeColmena(estado, id));
  const pestana = useSelector(selectPestanaDeColmena);
  const alternar = useAlternarCelda();
  const [salirDeColmena, salida] = useSalirDeColmenaMutation();
  const [cambiarColmena, cambio] = useCambiarColmenaMutation();

  const alternarCelda = (fila) => {
    if (fila.sePuedeTocar) alternar({ ...fila, colmenaId: id });
  };

  const salir = async () => {
    const resultado = await salirDeColmena({ colmenaId: id, personaId: colmena.miId });
    if (resultado.error) {
      avisar({ texto: leerError(resultado.error).mensaje, tono: "error" });
      return false;
    }
    avisar({ texto: `Saliste de ${colmena.nombre}.` });
    navegar("/colmenas", { replace: true });
    return true;
  };

  const archivar = async () => {
    const resultado = await cambiarColmena({ id, archivada: true });
    if (resultado.error) {
      avisar({ texto: leerError(resultado.error).mensaje, tono: "error" });
      return false;
    }
    avisar({ texto: `${colmena.nombre} quedó archivada.` });
    navegar("/colmenas", { replace: true });
    return true;
  };

  return {
    colmena,
    celdas,
    pestana,
    elegirPestana: (valor) => dispatch(elegirPestanaDeColmena(valor)),
    cargando: consulta.isLoading,
    error: leerError(consulta.error),
    reintentar: consulta.refetch,
    enLinea,
    alternarCelda,
    salir,
    archivar,
    ocupada: salida.isLoading || cambio.isLoading,
  };
}

/** Fundar una colmena o editar una: el mismo formulario. */
export function useFormularioDeColmena(colmena) {
  const navegar = useNavigate();
  const avisar = useAvisar();
  const { enLinea } = useConexion();
  const [fundarColmena, fundada] = useFundarColmenaMutation();
  const [cambiarColmena, cambiada] = useCambiarColmenaMutation();

  /** @returns {Promise<{ ok: boolean, campos?: Record<string, string> }>} */
  const guardar = async (datos) => {
    const resultado = colmena
      ? await cambiarColmena({ id: colmena.id, ...datos })
      : await fundarColmena(datos);
    if (resultado.error) return { ok: false, campos: leerError(resultado.error).campos };
    if (colmena) avisar({ texto: "Cambios guardados" });
    else {
      const nueva = resultado.data?.colmena ?? resultado.data;
      avisar({ texto: `Fundaste ${datos.nombre}. Ahora invita a tu enjambre.` });
      if (nueva?.id) navegar(`/colmenas/${nueva.id}`);
    }
    return { ok: true };
  };

  return {
    guardar,
    guardando: fundada.isLoading || cambiada.isLoading,
    error: leerError(fundada.error ?? cambiada.error),
    enLinea,
  };
}

/** P09. El enlace de invitación de una colmena. */
export function useInvitacion(colmenaId) {
  const consulta = useObtenerInvitacionQuery(colmenaId);
  const detalle = useObtenerColmenaQuery(colmenaId);
  const colmena = useSelector((estado) => selectColmena(estado, colmenaId));
  const yo = useSelector(selectYo);
  const [crearInvitacion, creacion] = useCrearInvitacionMutation();
  const invitacion = consulta.data?.invitacion ?? null;
  return {
    invitacion,
    vencimiento:
      invitacion && colmena && yo
        ? textoDeVencimiento(diaLogico(invitacion.venceEn, yo.zonaHoraria), colmena.hoy)
        : null,
    cargando: consulta.isLoading || detalle.isLoading,
    sinEnlace: consulta.isSuccess && !consulta.data?.invitacion,
    error: leerError(consulta.error ?? creacion.error),
    colmena,
    crear: () => crearInvitacion(colmenaId),
    creando: creacion.isLoading,
  };
}

/**
 * P13. Ver una invitación y aceptarla. Sin sesión, guarda el código para
 * seguir después de entrar o de crear el panal.
 * @param {string} codigo
 */
export function useUnirme(codigo) {
  const dispatch = useDispatch();
  const navegar = useNavigate();
  const { yo, cargando: cargandoYo } = useYo();
  const vista = useVerInvitacionQuery(codigo);
  const [aceptar, aceptacion] = useAceptarInvitacionMutation();
  const sinSesion = !cargandoYo && !yo;
  const yaSoyIntegrante = Boolean(vista.data?.yaSoyIntegrante);

  useEffect(() => {
    if (sinSesion && vista.data) dispatch(guardarInvitacion(codigo));
  }, [sinSesion, vista.data, codigo, dispatch]);

  // Quien ya pertenece no necesita la invitación pendiente.
  useEffect(() => {
    if (yaSoyIntegrante) dispatch(olvidarInvitacion());
  }, [yaSoyIntegrante, dispatch]);

  const unirme = async () => {
    const resultado = await aceptar(codigo);
    if (resultado.error && leerError(resultado.error).codigo !== "ya_eres_integrante") return;
    dispatch(olvidarInvitacion());
    navegar(`/colmenas/${vista.data.colmena.id}`, { replace: true });
  };

  return {
    yo,
    cargando: vista.isLoading || cargandoYo,
    error: leerError(vista.error),
    invitacion: vista.data,
    yaSoyIntegrante,
    unirme,
    uniendo: aceptacion.isLoading,
    errorAlUnirme: leerError(aceptacion.error),
  };
}
