import { useState } from "react";
import { Link } from "react-router";
import { Boton } from "../../componentes/Controles.jsx";
import { EstadoVacio, ErrorAlCargar, Silueta } from "../../componentes/Estados.jsx";
import { FilaDeCelda } from "../../componentes/FilaDeCelda.jsx";
import { puntosDeHexagono } from "../../componentes/hexagono.js";
import { IconoAcciones } from "../../componentes/iconos.jsx";
import { Pagina } from "../../componentes/Pagina.jsx";
import { useFondo } from "../../componentes/useFondo.js";
import estilos from "./Celdas.module.css";
import { MenuDeCelda } from "./MenuDeCelda.jsx";
import { NOMBRES_DE_PESTANA, SIN_RESULTADOS, textoDeSemana, VACIOS } from "./textos.js";
import { useCeldas } from "./useCeldas.js";

/** P05. Celdas: todas las actividades, en cuatro pestañas. */
export function Celdas() {
  const celdas = useCeldas();
  const { fondo } = useFondo();
  const [conMenu, setConMenu] = useState(null);

  return (
    <Pagina
      titulo="Celdas"
      acciones={
        <Boton a="/celdas/nueva" estado={{ fondo }}>
          Nueva actividad
        </Boton>
      }
    >
      {/* Las pestañas cambian la dirección: son navegación, no un control de pestañas. */}
      <nav className={estilos.pestanas} aria-label="Listas de celdas">
        <ul role="list">
          {Object.entries(NOMBRES_DE_PESTANA).map(([clave, nombre]) => (
            <li key={clave}>
              <Link
                to={clave === "hoy" ? "/celdas" : `/celdas?ver=${clave}`}
                className={estilos.pestana}
                aria-current={celdas.pestana === clave ? "page" : undefined}
                replace
              >
                {nombre}
                {celdas.conteos[clave] != null && (
                  <span className={estilos.conteo}>{celdas.conteos[clave]}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Filtros celdas={celdas} />

      <section className={estilos.lista} aria-label={NOMBRES_DE_PESTANA[celdas.pestana]}>
        <Contenido celdas={celdas} abrirMenu={setConMenu} fondo={fondo} />
      </section>

      {conMenu && (
        <MenuDeCelda
          fila={conMenu}
          enLinea={celdas.enLinea}
          alCerrar={() => setConMenu(null)}
          acciones={{
            archivar: celdas.archivar,
            recuperar: celdas.recuperar,
            posponer: celdas.posponer,
          }}
        />
      )}
    </Pagina>
  );
}

function Filtros({ celdas }) {
  const { filtros, colmenas } = celdas;
  return (
    <div className={estilos.filtros} role="group" aria-label="Filtros">
      {colmenas.length > 0 && (
        <label className={estilos.filtro}>
          <span className="solo-lectores">Colmena</span>
          <select
            value={filtros.colmena}
            onChange={(evento) => celdas.filtrarPorColmena(evento.target.value)}
          >
            <option value="todas">Todas las celdas</option>
            <option value="personales">Solo personales</option>
            {colmenas.map((colmena) => (
              <option key={colmena.id} value={colmena.id}>
                {colmena.nombre}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className={estilos.filtro} data-activo={filtros.prioridad === "alta" ? "" : undefined}>
        <input
          type="checkbox"
          checked={filtros.prioridad === "alta"}
          onChange={(evento) =>
            celdas.filtrarPorPrioridad(evento.target.checked ? "alta" : "todas")
          }
        />
        Prioridad alta
      </label>
    </div>
  );
}

function Contenido({ celdas, abrirMenu, fondo }) {
  if (celdas.cargando) return <Silueta etiqueta="Cargando tus celdas" bloques={[64, 64, 64, 64]} />;
  if (celdas.fallo) return <ErrorAlCargar alReintentar={celdas.reintentar} />;

  const { pestana } = celdas;
  const vacia =
    pestana === "proximas" ? celdas.proximas.length === 0 : celdas[pestana].length === 0;

  if (vacia) {
    if (celdas.hayFiltros) {
      return (
        <EstadoVacio
          frase={SIN_RESULTADOS}
          accion={
            <Boton tono="claro" onClick={celdas.quitarFiltros}>
              Quitar filtros
            </Boton>
          }
        />
      );
    }
    return (
      <EstadoVacio
        frase={VACIOS[pestana]}
        accion={
          pestana !== "archivadas" && (
            <Boton a="/celdas/nueva" estado={{ fondo }}>
              Nueva actividad
            </Boton>
          )
        }
      />
    );
  }

  const fila = (datos, { conCasilla = false } = {}) => (
    <FilaDeCelda
      key={datos.id}
      titulo={datos.titulo}
      detalle={datos.detalle}
      gotas={datos.archivada ? null : datos.gotas}
      llena={datos.llena}
      vencida={datos.vencida}
      alta={datos.prioridad === "alta"}
      deshabilitada={!celdas.enLinea}
      alCambiar={conCasilla ? () => celdas.alternarCelda(datos) : undefined}
      extra={
        datos.semana && (
          <span className={estilos.semana}>
            <svg
              className={estilos.celdasDeSemana}
              width={datos.semana.meta * 15}
              height="16"
              viewBox={`0 0 ${datos.semana.meta * 15} 16`}
              aria-hidden="true"
            >
              {Array.from({ length: datos.semana.meta }, (_, indice) => (
                <polygon
                  key={indice}
                  data-llena={indice < datos.semana.hechas ? "" : undefined}
                  points={puntosDeHexagono(6.5)}
                  transform={`translate(${7.5 + indice * 15} 8)`}
                />
              ))}
            </svg>
            {textoDeSemana(datos.semana)}
          </span>
        )
      }
      menu={
        <button
          type="button"
          className={estilos.menu}
          aria-label={`Acciones de ${datos.titulo}`}
          onClick={() => abrirMenu(datos)}
        >
          <IconoAcciones />
        </button>
      }
    />
  );

  if (pestana === "proximas") {
    return celdas.proximas.map((grupo) => (
      <section key={grupo.dia} className={estilos.grupo} aria-labelledby={`grupo-${grupo.dia}`}>
        <h2 id={`grupo-${grupo.dia}`} className={estilos.tituloDeGrupo}>
          {grupo.titulo}
        </h2>
        <ul className={estilos.filas} role="list">
          {grupo.filas.map((datos) => fila(datos))}
        </ul>
      </section>
    ));
  }

  return (
    <ul className={estilos.filas} role="list">
      {celdas[pestana].map((datos) => fila(datos, { conCasilla: pestana === "hoy" }))}
    </ul>
  );
}
