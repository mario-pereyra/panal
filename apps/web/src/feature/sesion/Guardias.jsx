import { Navigate, Outlet, useLocation } from "react-router";
import { Silueta } from "../../componentes/Estados.jsx";
import { SinConexion } from "../errores/Errores.jsx";
import { useInvitacionPendiente, useYo } from "./useSesion.js";

/**
 * Las tres zonas de Panal (docs/proyecto/03-pantallas.md, sección 1): acceso,
 * recorrido inicial y aplicación. Estas rutas deciden a cuál pertenece cada
 * persona según su sesión.
 */

/** La silueta de pantalla completa mientras se comprueba la sesión o llega una pantalla. */
export function Arranque() {
  return (
    <main className="arranque">
      <Silueta etiqueta="Abriendo tu panal" bloques={[52, 340, 320]} />
    </main>
  );
}

/** Aplicación y primer vuelo: sin sesión, a "Entrar"; sin primer vuelo, al recorrido inicial. */
export function ConSesion() {
  const { yo, cargando, sinConexion, reintentar } = useYo();
  const ubicacion = useLocation();

  if (cargando) return <Arranque />;
  if (sinConexion) return <SinConexion alReintentar={reintentar} />;
  if (!yo) return <Navigate to="/entrar" replace state={{ desde: ubicacion }} />;

  const enPrimerVuelo = ubicacion.pathname === "/primer-vuelo";
  if (!yo.primerVueloEn && !enPrimerVuelo) return <Navigate to="/primer-vuelo" replace />;
  if (yo.primerVueloEn && enPrimerVuelo) return <Navigate to="/" replace />;
  return <Outlet />;
}

/** Entrar y crear: con sesión, sigue a la invitación pendiente o a donde iba. */
export function SinSesion() {
  const { yo, cargando } = useYo();
  const invitacion = useInvitacionPendiente();
  const ubicacion = useLocation();

  if (cargando) return <Arranque />;
  if (yo) {
    const desde = ubicacion.state?.desde;
    const destino = invitacion
      ? `/unirme/${invitacion}`
      : desde
        ? `${desde.pathname}${desde.search ?? ""}`
        : "/";
    return <Navigate to={destino} replace />;
  }
  return <Outlet />;
}

/** Para las ventanas con ruta propia: solo se dibujan con sesión. */
export function SoloConSesion() {
  const { yo } = useYo();
  return yo?.primerVueloEn ? <Outlet /> : null;
}
