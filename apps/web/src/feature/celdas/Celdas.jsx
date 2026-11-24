import { useState } from "react";
import { Link } from "react-router";
import { Boton } from "../../componentes/ui/Controles.jsx";
import { ErrorAlCargar, Silueta } from "../../componentes/ui/Estados.jsx";
import { EstadoVacio } from "../../componentes/panal/EstadoVacio.jsx";
import { FilaDeCelda } from "../../componentes/panal/FilaDeCelda.jsx";
import { puntosDeHexagono } from "../../componentes/ui/hexagono.js";
import { IconoAcciones } from "../../componentes/ui/iconos.jsx";
import { Pagina } from "../../componentes/ui/Pagina.jsx";
import { PRIORIDAD_ALTA } from "../../componentes/panal/textos.js";
import { NUEVA_ACTIVIDAD } from "../../nucleo/textos.js";
import estilos from "./Celdas.module.css";
import { MenuDeCelda } from "./MenuDeCelda.jsx";
import {
  accionesDe,
  CARGANDO,
  CELDAS,
  COLMENA,
  ERROR_AL_CARGAR,
  FILTROS,
  LISTAS_DE_CELDAS,
  NOMBRES_DE_PESTANA,
  QUITAR_FILTROS,
  SIN_RESULTADOS,
  SOLO_PERSONALES,
  textoDeSemana,
  TODAS_LAS_CELDAS,
  VACIOS,
} from "./textos.js";
import { useCeldas } from "./useCeldas.js";

/** P05. Celdas: todas las actividades, en pestañas. */
export function Celdas() {
  const celdas = useCeldas();
  const [conMenu, setConMenu] = useState(null);

  return (
    <Pagina
      titulo={CELDAS}
      acciones={
        <Boton a="/celdas/nueva" ventana>
          {NUEVA_ACTIVIDAD}
        </Boton>
      }
    >
      {/* Las pestañas cambian la dirección: son navegación, no un control de pestañas. */}
      <nav className={estilos.pestanas} aria-label={LISTAS_DE_CELDAS}>
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
        <Contenido celdas={celdas} abrirMenu={setConMenu} />
      </section>

      {conMenu && <MenuDeCelda fila={conMenu} celdas={celdas} alCerrar={() => setConMenu(null)} />}
    </Pagina>
  );
}

function Filtros({ celdas }) {
  const { filtros, colmenas } = celdas;
  return (
    <div className={estilos.filtros} role="group" aria-label={FILTROS}>
      {colmenas.length > 0 && (
        <label className={estilos.filtro}>
          <span className="solo-lectores">{COLMENA}</span>
          <select
            value={filtros.colmena}
            onChange={(evento) => celdas.filtrarPorColmena(evento.target.value)}
          >
            <option value="todas">{TODAS_LAS_CELDAS}</option>
            <option value="personales">{SOLO_PERSONALES}</option>
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
        {PRIORIDAD_ALTA}
      </label>
    </div>
  );
}

function Contenido({ celdas, abrirMenu }) {
  if (celdas.cargando) return <Silueta etiqueta={CARGANDO} bloques={[64, 64, 64, 64]} />;
  if (celdas.fallo)
    return <ErrorAlCargar titulo={ERROR_AL_CARGAR} alReintentar={celdas.reintentar} />;

  const { pestana } = celdas;

  if (!celdas.conteos[pestana]) {
    if (celdas.hayFiltros) {
      return (
        <EstadoVacio
          frase={SIN_RESULTADOS}
          accion={
            <Boton tono="claro" onClick={celdas.quitarFiltros}>
              {QUITAR_FILTROS}
            </Boton>
          }
        />
      );
    }
    return (
      <EstadoVacio
        frase={VACIOS[pestana]}
        accion={
          !["hechas", "archivadas"].includes(pestana) && (
            <Boton a="/celdas/nueva" ventana>
              {NUEVA_ACTIVIDAD}
            </Boton>
          )
        }
      />
    );
  }

  const fila = (datos) => (
    <FilaDeCelda
      key={datos.id}
      titulo={datos.titulo}
      detalle={datos.detalle}
      gotas={datos.gotas}
      llena={datos.llena}
      vencida={datos.vencida}
      alta={datos.prioridad === "alta"}
      deshabilitada={!celdas.enLinea}
      alCambiar={
        ["hoy", "hechas"].includes(pestana) ? () => celdas.alternarCelda(datos) : undefined
      }
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
      abrir={datos.permisos.editar && !datos.archivada ? `/celdas/${datos.id}` : undefined}
      menu={
        (datos.permisos.editar || datos.permisos.archivar) && (
          <button
            type="button"
            className={estilos.menu}
            aria-label={accionesDe(datos.titulo)}
            onClick={() => abrirMenu(datos)}
          >
            <IconoAcciones />
          </button>
        )
      }
    />
  );

  return celdas.grupos.map((grupo) =>
    grupo.titulo ? (
      <section key={grupo.dia} className={estilos.grupo} aria-labelledby={`grupo-${grupo.dia}`}>
        <h2 id={`grupo-${grupo.dia}`} className={estilos.tituloDeGrupo}>
          {grupo.titulo}
        </h2>
        <ul className={estilos.filas} role="list">
          {grupo.filas.map(fila)}
        </ul>
      </section>
    ) : (
      <ul key={pestana} className={estilos.filas} role="list">
        {grupo.filas.map(fila)}
      </ul>
    ),
  );
}
