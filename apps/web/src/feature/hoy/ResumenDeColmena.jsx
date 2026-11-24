import { Link } from "react-router";
import { Boton } from "../../componentes/ui/Controles.jsx";
import { RejillaDeColmena } from "../../componentes/panal/RejillaDeColmena.jsx";
import { Tarjeta } from "../../componentes/ui/Tarjeta.jsx";
import estilosDeHoy from "./Hoy.module.css";
import estilos from "./ResumenDeColmena.module.css";
import { porcentaje } from "../../lib/formato.js";
import { SIN_COLMENAS, textoDeAvance } from "../../nucleo/textos.js";
import {
  aporteDeAbeja,
  COLMENA,
  descripcionDeLaColmena,
  FUNDAR_UNA_COLMENA,
  tituloDeColmena,
  VER_TODAS_TUS_COLMENAS,
} from "./textos.js";

/** La colmena con actividad más reciente. */
export function ResumenDeColmena({ colmena }) {
  if (!colmena) {
    return (
      <Tarjeta titulo={COLMENA}>
        <div className={estilosDeHoy.vacio}>
          <p>{SIN_COLMENAS}</p>
          <Boton a="/colmenas">{FUNDAR_UNA_COLMENA}</Boton>
        </div>
      </Tarjeta>
    );
  }

  const avance = textoDeAvance(colmena.avance, colmena.integrantes.length);

  return (
    <Tarjeta
      titulo={tituloDeColmena(colmena.nombre)}
      dato={porcentaje(colmena.avance.porcentaje)}
      nota={avance}
      a={`/colmenas/${colmena.id}`}
    >
      <RejillaDeColmena celdas={colmena.celdas} descripcion={descripcionDeLaColmena(avance)} />
      <ul className={estilos.enjambre} role="list">
        {colmena.integrantes.map((abeja) => (
          <li key={abeja.id} className={estilos.abeja}>
            <span
              className={estilos.muestra}
              style={{ background: abeja.color }}
              aria-hidden="true"
            />
            <span className={estilos.nombre}>{abeja.nombre}</span>
            <span className={estilos.aporte}>{aporteDeAbeja(abeja.celdas)}</span>
          </li>
        ))}
      </ul>
      {colmena.otras > 0 && (
        <Link className={estilos.verTodas} to="/colmenas">
          {VER_TODAS_TUS_COLMENAS}
        </Link>
      )}
    </Tarjeta>
  );
}
