import { useState } from "react";
import { Link } from "react-router";
import { Boton } from "../../componentes/ui/Controles.jsx";
import { ErrorAlCargar, Silueta } from "../../componentes/ui/Estados.jsx";
import { EstadoVacio } from "../../componentes/panal/EstadoVacio.jsx";
import { Pagina } from "../../componentes/ui/Pagina.jsx";
import { RejillaDeColmena } from "../../componentes/panal/RejillaDeColmena.jsx";
import { Tarjeta } from "../../componentes/ui/Tarjeta.jsx";
import { porcentaje } from "../../lib/formato.js";
import { SIN_COLMENAS, textoDeAvance, textoDeEntrega } from "../../nucleo/textos.js";
import estilos from "./Colmenas.module.css";
import { FundarColmena } from "./FundarColmena.jsx";
import { Avatares } from "./Graficas.jsx";
import {
  ARCHIVADAS,
  CARGANDO_COLMENAS,
  COLMENAS,
  descripcionDeTarjeta,
  EL_COLMENAR,
  ERROR_AL_CARGAR_COLMENAS,
  FUNDAR_UNA_COLMENA,
  NINGUNA_EN_MARCHA,
  NOTA_DE_ARCHIVADAS,
  NOTA_DEL_COLMENAR,
  textoDeCuadro,
  textoDeEnjambre,
} from "./textos.js";
import { useColmenas } from "./useColmenas.js";

/** P07. Colmenas: los proyectos en marcha y el colmenar. */
export function Colmenas() {
  const colmenas = useColmenas();
  const [fundando, setFundando] = useState(false);

  return (
    <Pagina
      titulo={COLMENAS}
      acciones={<Boton onClick={() => setFundando(true)}>{FUNDAR_UNA_COLMENA}</Boton>}
    >
      {colmenas.cargando ? (
        <Silueta etiqueta={CARGANDO_COLMENAS} bloques={[300, 300]} />
      ) : colmenas.fallo ? (
        <ErrorAlCargar titulo={ERROR_AL_CARGAR_COLMENAS} alReintentar={colmenas.reintentar} />
      ) : colmenas.activas.length === 0 &&
        colmenas.colmenar.length === 0 &&
        colmenas.archivadas.length === 0 ? (
        <section className={estilos.vacia}>
          <EstadoVacio
            frase={SIN_COLMENAS}
            accion={<Boton onClick={() => setFundando(true)}>{FUNDAR_UNA_COLMENA}</Boton>}
          />
        </section>
      ) : (
        <>
          {colmenas.activas.length > 0 ? (
            <div className={estilos.rejilla}>
              {colmenas.activas.map((colmena) => (
                <TarjetaDeColmena key={colmena.id} colmena={colmena} hoy={colmenas.hoy} />
              ))}
            </div>
          ) : (
            <p className={estilos.nota}>{NINGUNA_EN_MARCHA}</p>
          )}
          {colmenas.colmenar.length > 0 && <Colmenar colmenas={colmenas.colmenar} />}
          {colmenas.archivadas.length > 0 && <Archivadas colmenas={colmenas.archivadas} />}
        </>
      )}

      {fundando && <FundarColmena alCerrar={() => setFundando(false)} />}
    </Pagina>
  );
}

function TarjetaDeColmena({ colmena, hoy }) {
  const { avance } = colmena;
  const descripcion = textoDeAvance(avance, colmena.integrantes.length);
  return (
    <Tarjeta
      titulo={colmena.nombre}
      dato={porcentaje(avance.porcentaje)}
      nota={descripcion}
      a={`/colmenas/${colmena.id}`}
    >
      <RejillaDeColmena
        celdas={colmena.celdas}
        descripcion={descripcionDeTarjeta(colmena.nombre, descripcion)}
      />
      <p className={estilos.cuadro}>{textoDeCuadro(avance)}</p>
      <div className={estilos.pieDeTarjeta}>
        <Avatares integrantes={colmena.integrantes} />
        <span className="solo-lectores">{textoDeEnjambre(colmena.integrantes)}</span>
        {colmena.entregaEl && hoy && (
          <span className={estilos.entrega}>{textoDeEntrega(colmena.entregaEl, hoy)}</span>
        )}
      </div>
    </Tarjeta>
  );
}

function Archivadas({ colmenas }) {
  return (
    <section className={estilos.colmenar} aria-labelledby="titulo-archivadas">
      <h2 id="titulo-archivadas" className={estilos.tituloDeSeccion}>
        {ARCHIVADAS}
      </h2>
      <p className={estilos.nota}>{NOTA_DE_ARCHIVADAS}</p>
      <ul className={estilos.archivadas} role="list">
        {colmenas.map((colmena) => (
          <li key={colmena.id}>
            <Link to={`/colmenas/${colmena.id}`} className={estilos.archivada}>
              {colmena.nombre}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** El colmenar: cada colmena cerrada es un tarro con su nombre. */
function Colmenar({ colmenas }) {
  return (
    <section className={estilos.colmenar} aria-labelledby="titulo-colmenar">
      <h2 id="titulo-colmenar" className={estilos.tituloDeSeccion}>
        {EL_COLMENAR}
      </h2>
      <p className={estilos.nota}>{NOTA_DEL_COLMENAR}</p>
      <ul className={estilos.tarros} role="list">
        {colmenas.map((colmena) => (
          <li key={colmena.id}>
            <Link to={`/colmenas/${colmena.id}`} className={estilos.tarro}>
              <svg viewBox="0 0 64 72" width="64" height="72" aria-hidden="true">
                <rect x="10" y="4" width="44" height="12" rx="4" className={estilos.tapa} />
                <path
                  d="M14 16 h36 c6 3 9 8 9 14 v28 a10 10 0 0 1 -10 10 h-34 a10 10 0 0 1 -10 -10 v-28 c0 -6 3 -11 9 -14 Z"
                  className={estilos.vidrio}
                />
              </svg>
              <span>{colmena.nombre}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
