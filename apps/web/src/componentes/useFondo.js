import { useLocation, useNavigate } from "react-router";

/**
 * Las ventanas con ruta propia (nueva actividad, invitar) se abren sobre la
 * pantalla desde la que se llegó. Esa pantalla viaja en el estado de la
 * navegación como `fondo`; si ya hay una ventana abierta, se conserva el fondo
 * original.
 *
 * Para abrir una ventana: `const { fondo } = useFondo()` y `estado={{ fondo }}`.
 * Para cerrarla: `salir(destino)`.
 *
 * @returns {{ fondo: import("react-router").Location, salir: (destino: string) => void }}
 */
export function useFondo() {
  const ubicacion = useLocation();
  const navegar = useNavigate();
  const fondoGuardado = ubicacion.state?.fondo;
  return {
    fondo: fondoGuardado ?? ubicacion,
    // Si se llegó desde una pantalla, se vuelve a ella; con un enlace directo, a `destino`.
    salir: (destino) => (fondoGuardado ? navegar(-1) : navegar(destino, { replace: true })),
  };
}
