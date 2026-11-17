import { useSelector } from "react-redux";
import { Suspense } from "react";
import { Link, NavLink, Outlet } from "react-router";
import { useObtenerPanalQuery } from "../api/panalApi.js";
import { Ficha } from "../componentes/Controles.jsx";
import { LimiteDeError, Silueta } from "../componentes/Estados.jsx";
import {
  IconoCeldas,
  IconoColmenas,
  IconoGota,
  IconoHoy,
  IconoMas,
  IconoReportes,
  LogoPanal,
} from "../componentes/iconos.jsx";
import { useFondo } from "../componentes/useFondo.js";
import { Avisos } from "../feature/avisos/Avisos.jsx";
import { Celebracion } from "../feature/celebraciones/Celebracion.jsx";
import { FranjaDeVersion } from "../feature/conexion/FranjaDeVersion.jsx";
import { FranjaSinConexion } from "../feature/conexion/FranjaSinConexion.jsx";
import { selectGotasDeHoy, selectOficio, selectPersona } from "../feature/hoy/hoySelector.js";
import { useReloj } from "../feature/reloj/useReloj.js";
import estilos from "./Estructura.module.css";

/**
 * Lo que comparten todas las pantallas: la cabecera, la navegación y el
 * espacio del contenido. En teléfono la navegación baja al borde inferior.
 */
export function Estructura() {
  useReloj();
  useObtenerPanalQuery();
  const persona = useSelector(selectPersona);
  const oficio = useSelector(selectOficio);
  const gotasDeHoy = useSelector(selectGotasDeHoy);
  const { fondo } = useFondo();

  return (
    <div className={estilos.estructura}>
      <a className="saltar" href="#contenido">
        Saltar al contenido
      </a>

      <header className={estilos.cabecera}>
        <Link to="/" className={estilos.marca} aria-label="Panal, ir a Hoy">
          <LogoPanal />
          <span>Panal</span>
        </Link>

        <nav className={estilos.secciones} aria-label="Secciones">
          <ul className={estilos.lista} role="list">
            <li>
              <NavLink to="/" end className={estilos.seccion}>
                <IconoHoy className={estilos.icono} />
                Hoy
              </NavLink>
            </li>
            <li>
              <NavLink to="/celdas" className={estilos.seccion}>
                <IconoCeldas className={estilos.icono} />
                Celdas
              </NavLink>
            </li>
            <li className={estilos.itemCrear}>
              <Link
                to="/celdas/nueva"
                state={{ fondo }}
                className={estilos.crear}
                aria-label="Nueva actividad"
              >
                <IconoMas className={estilos.icono} />
              </Link>
            </li>
            <li>
              <NavLink to="/colmenas" className={estilos.seccion}>
                <IconoColmenas className={estilos.icono} />
                Colmenas
              </NavLink>
            </li>
            <li>
              <NavLink to="/reportes" className={estilos.seccion}>
                <IconoReportes className={estilos.icono} />
                Reportes
              </NavLink>
            </li>
          </ul>
        </nav>

        {persona && oficio && (
          <div className={estilos.perfil}>
            <span className={estilos.oficio}>
              Nivel {oficio.nivel} · {oficio.nombre}
            </span>
            <Ficha className={estilos.gotasDeHoy} icono={<IconoGota />}>
              {gotasDeHoy}
              <span className="solo-lectores"> gotas hoy</span>
            </Ficha>
            <Link
              to="/mi-vuelo"
              className={estilos.avatar}
              aria-label={`Mi vuelo: el perfil de ${persona.nombre}`}
            >
              {persona.nombre.charAt(0).toUpperCase()}
            </Link>
          </div>
        )}
      </header>

      <div className={estilos.franjas}>
        <FranjaSinConexion />
        <FranjaDeVersion />
      </div>

      {/* tabIndex -1: al cerrar un aviso, el foco vuelve aquí y no se pierde en el documento. */}
      <main id="contenido" className={estilos.contenido} tabIndex={-1}>
        {/* Cada pantalla se descarga la primera vez que se visita. */}
        <LimiteDeError key={fondo.pathname}>
          <Suspense fallback={<Silueta etiqueta="Abriendo la pantalla" />}>
            <Outlet />
          </Suspense>
        </LimiteDeError>
      </main>

      <Avisos />
      <Celebracion />
    </div>
  );
}
