import { useSelector } from "react-redux";
import { Link, NavLink, Outlet } from "react-router";
import { useObtenerPanalQuery } from "../api/panalApi.js";
import { Ficha } from "../componentes/Controles.jsx";
import {
  IconoCeldas,
  IconoColmenas,
  IconoGota,
  IconoHoy,
  IconoMas,
  IconoReportes,
  LogoPanal,
} from "../componentes/iconos.jsx";
import { selectOficio, selectPanalDeHoy, selectPersona } from "../feature/hoy/hoySelector.js";
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
  const resumen = useSelector(selectPanalDeHoy);

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
              <NavLink to="/celdas" end className={estilos.seccion}>
                <IconoCeldas className={estilos.icono} />
                Celdas
              </NavLink>
            </li>
            <li className={estilos.itemCrear}>
              <Link to="/celdas/nueva" className={estilos.crear} aria-label="Nueva actividad">
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

        {persona && oficio && resumen && (
          <div className={estilos.perfil}>
            <span className={estilos.oficio}>
              Nivel {oficio.nivel} · {oficio.nombre}
            </span>
            <Ficha className={estilos.gotasDeHoy} icono={<IconoGota />}>
              {resumen.gotas}
              <span className="solo-lectores"> gotas hoy</span>
            </Ficha>
            <Link
              to="/mi-vuelo"
              className={estilos.avatar}
              style={{ background: persona.color }}
              aria-label={`Mi vuelo: el perfil de ${persona.nombre}`}
            >
              {persona.nombre.charAt(0).toUpperCase()}
            </Link>
          </div>
        )}
      </header>

      <main id="contenido" className={estilos.contenido}>
        <Outlet />
      </main>
    </div>
  );
}
