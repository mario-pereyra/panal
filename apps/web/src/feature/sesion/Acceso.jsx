import { Link } from "react-router";
import { LogoPanal } from "../../componentes/iconos.jsx";
import { Zum } from "../../componentes/Zum.jsx";
import estilos from "./Acceso.module.css";

/**
 * La estructura de las pantallas de acceso: a un lado, en miel, Zum y una
 * frase; al otro, en papel, el formulario. En teléfono, la miel es una franja
 * arriba.
 *
 * Mientras no estén las escenas E01 y E02, Zum aparece en uno de sus estados.
 *
 * @param {object} props
 * @param {string} props.titulo
 * @param {"esperando" | "animando" | "feliz"} props.zum
 * @param {import("react").ReactNode} props.lema Lo que va bajo Zum.
 */
export function Acceso({ titulo, zum, lema, children }) {
  return (
    <div className={estilos.acceso}>
      <title>{`${titulo} · Panal`}</title>
      <a className="saltar" href="#contenido">
        Saltar al formulario
      </a>
      <aside className={estilos.miel}>
        <Link to="/entrar" className={estilos.marca} aria-label="Panal">
          <LogoPanal />
          <span aria-hidden="true">Panal</span>
        </Link>
        <Zum
          className={estilos.zum}
          estado={zum}
          conFondo
          principal
          tamanos="(min-width: 900px) 280px, 140px"
        />
        <div className={estilos.lema}>{lema}</div>
      </aside>
      <main id="contenido" className={estilos.papel} tabIndex={-1}>
        <div className={estilos.formulario}>
          <h1 className={estilos.titulo}>{titulo}</h1>
          {children}
        </div>
      </main>
    </div>
  );
}
