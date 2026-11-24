import { Suspense } from "react";
import { Link, NavLink, Outlet } from "react-router";
import {
  IconoCeldas,
  IconoColmenas,
  IconoGota,
  IconoHoy,
  IconoReportes,
  LogoPanal,
} from "../componentes/panal/iconos.jsx";
import { EnlaceAVentana, Ficha } from "../componentes/ui/Controles.jsx";
import { LimiteDeError, Silueta } from "../componentes/ui/Estados.jsx";
import { IconoMas } from "../componentes/ui/iconos.jsx";
import { Principal } from "../componentes/ui/Pagina.jsx";
import { useFondo } from "../componentes/ui/useFondo.js";
import { Avisos } from "../nucleo/avisos/Avisos.jsx";
import { Celebracion } from "../nucleo/celebraciones/Celebracion.jsx";
import { FranjaDeVersion } from "../nucleo/conexion/FranjaDeVersion.jsx";
import { FranjaSinConexion } from "../nucleo/conexion/FranjaSinConexion.jsx";
import { inicialDe } from "../nucleo/panal/abejas.js";
import { useResumenDelDia } from "../nucleo/panal/usePanal.js";
import { useReloj } from "../nucleo/reloj/useReloj.js";
import { NUEVA_ACTIVIDAD, PANAL, textoDeNivel } from "../nucleo/textos.js";
import estilos from "./Estructura.module.css";
import {
  ABRIENDO_LA_PANTALLA,
  GOTAS_HOY,
  IR_A_HOY,
  NOMBRES_DE_SECCION,
  perfilDe,
  SALTAR_AL_CONTENIDO,
  SECCIONES,
} from "./textos.js";

/**
 * Lo que comparten todas las pantallas: la cabecera, la navegación y el
 * espacio del contenido. En teléfono la navegación baja al borde inferior.
 */
export function Estructura() {
  useReloj();
  const { persona, oficio, gotasDeHoy } = useResumenDelDia();
  const { fondo } = useFondo();

  return (
    <div className={estilos.estructura}>
      <a className="saltar" href="#contenido">
        {SALTAR_AL_CONTENIDO}
      </a>

      <header className={estilos.cabecera}>
        <Link to="/" className={estilos.marca} aria-label={IR_A_HOY}>
          <LogoPanal />
          <span>{PANAL}</span>
        </Link>

        <nav className={estilos.secciones} aria-label={SECCIONES}>
          <ul className={estilos.lista} role="list">
            <Seccion a="/" end Icono={IconoHoy} nombre={NOMBRES_DE_SECCION.hoy} />
            <Seccion a="/celdas" Icono={IconoCeldas} nombre={NOMBRES_DE_SECCION.celdas} />
            <li className={estilos.itemCrear}>
              <EnlaceAVentana
                to="/celdas/nueva"
                className={estilos.crear}
                aria-label={NUEVA_ACTIVIDAD}
              >
                <IconoMas className={estilos.icono} />
              </EnlaceAVentana>
            </li>
            <Seccion a="/colmenas" Icono={IconoColmenas} nombre={NOMBRES_DE_SECCION.colmenas} />
            <Seccion a="/reportes" Icono={IconoReportes} nombre={NOMBRES_DE_SECCION.reportes} />
          </ul>
        </nav>

        {persona && oficio && (
          <div className={estilos.perfil}>
            <span className={estilos.oficio}>{textoDeNivel(oficio)}</span>
            <Ficha className={estilos.gotasDeHoy} icono={<IconoGota />}>
              {gotasDeHoy}
              <span className="solo-lectores">{GOTAS_HOY}</span>
            </Ficha>
            <Link to="/mi-vuelo" className={estilos.avatar} aria-label={perfilDe(persona.nombre)}>
              {inicialDe(persona.nombre)}
            </Link>
          </div>
        )}
      </header>

      <div className={estilos.franjas}>
        <FranjaSinConexion />
        <FranjaDeVersion />
      </div>

      <Principal className={estilos.contenido}>
        <LimiteDeError key={fondo.pathname}>
          <Suspense
            fallback={<Silueta etiqueta={ABRIENDO_LA_PANTALLA} bloques={[180, 320, 320]} />}
          >
            <Outlet />
          </Suspense>
        </LimiteDeError>
      </Principal>

      <Avisos />
      <Celebracion />
    </div>
  );
}

function Seccion({ a, end = false, Icono, nombre }) {
  return (
    <li>
      <NavLink to={a} end={end} className={estilos.seccion}>
        {({ isActive }) => (
          <>
            <Icono className={estilos.icono} lleno={isActive} />
            {nombre}
          </>
        )}
      </NavLink>
    </li>
  );
}
