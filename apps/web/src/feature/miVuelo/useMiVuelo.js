import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { leerError } from "../../api/errores.js";
import { useCambiarPerfilMutation, useObtenerProgresoQuery } from "../../api/panalApi.js";
import { useAvisar } from "../avisos/useAvisos.js";
import { useConexion } from "../conexion/useConexion.js";
import { useSalir, useYo } from "../sesion/useSesion.js";
import { abrirSello, cerrarSello, elegirMovimiento } from "./miVueloSlice.js";
import {
  selectAjustes,
  selectGotasYRacha,
  selectMovimiento,
  selectOficioDeVuelo,
  selectSello,
  selectSellos,
} from "./miVueloSelector.js";

/** Todo lo que muestra y cambia Mi vuelo. */
export function useMiVuelo() {
  const dispatch = useDispatch();
  const avisar = useAvisar();
  const { yo } = useYo();
  const consulta = useObtenerProgresoQuery();
  const [cambiarPerfil, cambio] = useCambiarPerfilMutation();
  const conexion = useConexion();
  const { cerrarSesion, saliendo } = useSalir();

  /** Guarda un ajuste al momento y confirma con un aviso. */
  const guardarAjuste = async (cambios, confirmacion = "Ajuste guardado") => {
    const resultado = await cambiarPerfil(cambios);
    if (resultado.error) {
      avisar({
        texto: `No se guardó el ajuste. ${leerError(resultado.error).mensaje}`,
        tono: "error",
      });
      return false;
    }
    avisar({ texto: confirmacion });
    return true;
  };

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
    guardarAjuste,
    guardando: cambio.isLoading,
    movimiento: useSelector(selectMovimiento),
    elegirMovimiento: (valor) => dispatch(elegirMovimiento(valor)),
    ...conexion,
    cerrarSesion,
    saliendo,
  };
}

/**
 * Aplica la preferencia de movimiento a toda la página. Se usa una vez, en la
 * raíz: `base.css` apaga animaciones y transiciones con `data-movimiento`.
 */
export function useAplicarMovimiento() {
  const movimiento = useSelector(selectMovimiento);
  useEffect(() => {
    if (movimiento === "reducido") document.documentElement.dataset.movimiento = "reducido";
    else delete document.documentElement.dataset.movimiento;
  }, [movimiento]);
}
