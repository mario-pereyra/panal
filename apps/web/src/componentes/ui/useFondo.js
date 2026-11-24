import { useLocation, useNavigate } from "react-router";

/**
 * Las ventanas con ruta propia (nueva actividad, invitar) se abren sobre la
 * pantalla desde la que se llegó. Esa pantalla viaja en el estado de la
 * navegación como `fondo`; si ya hay una ventana abierta, se conserva el fondo
 * original. Para abrir una, `EnlaceAVentana` o `Boton ventana`; para cerrarla,
 * `salir(destino)`: vuelve atrás o, si se llegó con un enlace directo, a `destino`.
 */
export function useFondo() {
  const ubicacion = useLocation();
  const navegar = useNavigate();
  const fondoGuardado = ubicacion.state?.fondo;
  return {
    fondo: fondoGuardado ?? ubicacion,
    salir: (destino) => (fondoGuardado ? navegar(-1) : navegar(destino, { replace: true })),
  };
}
