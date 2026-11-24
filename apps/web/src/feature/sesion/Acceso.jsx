import { Link } from "react-router";
import { LogoPanal } from "../../componentes/panal/iconos.jsx";
import { Zum } from "../../componentes/panal/Zum.jsx";
import { Principal, TituloDePestana } from "../../componentes/ui/Pagina.jsx";
import { PANAL } from "../../nucleo/textos.js";
import estilos from "./Acceso.module.css";
import { SALTAR_AL_FORMULARIO } from "./textos.js";

/**
 * La estructura de las pantallas de acceso: a un lado, en miel, Zum y una
 * frase; al otro, en papel, el formulario. En teléfono, la miel es una franja
 * arriba.
 *
 * Mientras no estén las escenas E01 y E02, Zum aparece en uno de sus estados.
 */
export function Acceso({ titulo, zum, lema, children }) {
  return (
    <div className={estilos.acceso}>
      <TituloDePestana>{titulo}</TituloDePestana>
      <a className="saltar" href="#contenido">
        {SALTAR_AL_FORMULARIO}
      </a>
      <aside className={estilos.miel}>
        <Link to="/entrar" className={estilos.marca}>
          <LogoPanal />
          <span>{PANAL}</span>
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
      <Principal className={estilos.papel}>
        <div className={estilos.formulario}>
          <h1 className={estilos.titulo}>{titulo}</h1>
          {children}
        </div>
      </Principal>
    </div>
  );
}
