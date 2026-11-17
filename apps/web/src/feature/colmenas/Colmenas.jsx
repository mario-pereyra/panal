import { useState } from "react";
import { Link } from "react-router";
import { Boton } from "../../componentes/Controles.jsx";
import { EstadoVacio, ErrorAlCargar, Silueta } from "../../componentes/Estados.jsx";
import { Avatares } from "../../componentes/Graficas.jsx";
import { Pagina, Rejilla } from "../../componentes/Pagina.jsx";
import { RejillaDeColmena } from "../../componentes/RejillaDeColmena.jsx";
import { Tarjeta } from "../../componentes/Tarjeta.jsx";
import { textoDeEntrega } from "../../componentes/textos.js";
import estilos from "./Colmenas.module.css";
import { FundarColmena } from "./FundarColmena.jsx";
import { SIN_COLMENAS, textoDeAvance, textoDeCuadro } from "./textos.js";
import { useColmenas } from "./useColmenas.js";

/** P07. Colmenas: los proyectos en marcha y el colmenar. */
export function Colmenas() {
  const colmenas = useColmenas();
  const [fundando, setFundando] = useState(false);

  return (
    <Pagina
      titulo="Colmenas"
      acciones={<Boton onClick={() => setFundando(true)}>Fundar una colmena</Boton>}
    >
      {colmenas.cargando ? (
        <Silueta etiqueta="Cargando tus colmenas" bloques={[300, 300]} />
      ) : colmenas.fallo ? (
        <ErrorAlCargar titulo="No pudimos traer tus colmenas" alReintentar={colmenas.reintentar} />
      ) : colmenas.activas.length === 0 && colmenas.colmenar.length === 0 ? (
        <section className={estilos.vacia}>
          <EstadoVacio
            frase={SIN_COLMENAS}
            accion={<Boton onClick={() => setFundando(true)}>Fundar una colmena</Boton>}
          />
        </section>
      ) : (
        <>
          {colmenas.activas.length > 0 ? (
            <Rejilla>
              {colmenas.activas.map((colmena) => (
                <TarjetaDeColmena key={colmena.id} colmena={colmena} hoy={colmenas.hoy} />
              ))}
            </Rejilla>
          ) : (
            <p className={estilos.nota}>Ninguna colmena en marcha. Funda otra cuando quieras.</p>
          )}
          {colmenas.colmenar.length > 0 && <Colmenar colmenas={colmenas.colmenar} />}
        </>
      )}

      {fundando && <FundarColmena hoy={colmenas.hoy} alCerrar={() => setFundando(false)} />}
    </Pagina>
  );
}

function TarjetaDeColmena({ colmena, hoy }) {
  const { avance } = colmena;
  const descripcion = textoDeAvance(avance, colmena.integrantes.length);
  return (
    <Tarjeta
      titulo={colmena.nombre}
      dato={`${avance.porcentaje} %`}
      nota={descripcion}
      a={`/colmenas/${colmena.id}`}
    >
      <RejillaDeColmena
        celdas={colmena.celdasConColor}
        descripcion={`Colmena ${colmena.nombre}: ${descripcion}.`}
      />
      <p className={estilos.cuadro}>{textoDeCuadro(avance)}</p>
      <div className={estilos.pieDeTarjeta}>
        <Avatares integrantes={colmena.integrantes} />
        <span className="solo-lectores">{`Enjambre: ${colmena.integrantes.map((abeja) => abeja.nombre).join(", ")}.`}</span>
        {colmena.entregaEl && hoy && (
          <span className={estilos.entrega}>{textoDeEntrega(colmena.entregaEl, hoy)}</span>
        )}
      </div>
    </Tarjeta>
  );
}

/** El colmenar: cada colmena cerrada es un tarro con su nombre. */
function Colmenar({ colmenas }) {
  return (
    <section className={estilos.colmenar} aria-labelledby="titulo-colmenar">
      <h2 id="titulo-colmenar" className={estilos.tituloDeSeccion}>
        El colmenar
      </h2>
      <p className={estilos.nota}>Las colmenas que tu enjambre llenó al cien por cien.</p>
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
