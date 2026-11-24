import { useDispatch, useSelector } from "react-redux";
import { useCambiarPerfilMutation, useObtenerProgresoQuery } from "../../store/api.js";
import { useAvisarResultado } from "../../nucleo/avisos/useAvisos.js";
import { useConexion } from "../../nucleo/conexion/useConexion.js";
import { useSalir, useYo } from "../../nucleo/cuenta/useCuenta.js";
import { useMovimiento } from "../../nucleo/preferencias/usePreferencias.js";
import { abrirSello, cerrarSello } from "./miVueloSlice.js";
import { AJUSTE_GUARDADO, ajusteNoGuardado } from "./textos.js";
import {
  selectAjustes,
  selectGotasYRacha,
  selectInvernada,
  selectOficioDeVuelo,
  selectSello,
  selectSellos,
} from "./miVueloSelector.js";

export function useMiVuelo() {
  const dispatch = useDispatch();
  const avisarResultado = useAvisarResultado();
  const movimiento = useMovimiento();
  const { yo } = useYo();
  const consulta = useObtenerProgresoQuery();
  const [cambiarPerfil, cambio] = useCambiarPerfilMutation();
  const conexion = useConexion();
  const { cerrarSesion, saliendo } = useSalir();

  const guardarAjuste = async (cambios, confirmacion = AJUSTE_GUARDADO) =>
    avisarResultado(await cambiarPerfil(cambios), {
      exito: confirmacion,
      error: (error) => ajusteNoGuardado(error.mensaje),
    });

  return {
    yo,
    cargando: consulta.isLoading,
    fallo: consulta.isError && !consulta.data,
    reintentar: consulta.refetch,
    oficio: useSelector(selectOficioDeVuelo),
    sellos: useSelector(selectSellos),
    sello: useSelector(selectSello),
    abrirSello: (id) => dispatch(abrirSello(id)),
    cerrarSello: () => dispatch(cerrarSello()),
    resumen: useSelector(selectGotasYRacha),
    ajustes: useSelector(selectAjustes),
    invernada: useSelector(selectInvernada),
    guardarAjuste,
    guardando: cambio.isLoading,
    ...movimiento,
    ...conexion,
    cerrarSesion,
    saliendo,
  };
}
