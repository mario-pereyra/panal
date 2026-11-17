import { useState } from "react";
import { Link, useParams } from "react-router";
import { Boton } from "../../componentes/Controles.jsx";
import { EstadoVacio, ErrorAlCargar, Silueta } from "../../componentes/Estados.jsx";
import { FilaDeCelda } from "../../componentes/FilaDeCelda.jsx";
import { Opciones } from "../../componentes/Formulario.jsx";
import { ColmenaGrande } from "../../componentes/Graficas.jsx";
import { IconoAcciones, IconoVolver } from "../../componentes/iconos.jsx";
import { Pagina } from "../../componentes/Pagina.jsx";
import { SelloDeCera } from "../../componentes/SelloDeCera.jsx";
import { cuenta, textoDeEntrega } from "../../componentes/textos.js";
import { useFondo } from "../../componentes/useFondo.js";
import { useCerrarVentana, Ventana } from "../../componentes/Ventana.jsx";
import estilos from "./Colmenas.module.css";
import { FundarColmena } from "./FundarColmena.jsx";
import {
  COLMENA_VACIA,
  ENJAMBRE_DE_UNA,
  PESTANAS_DE_COLMENA,
  SIN_PERMISO,
  textoDeAvance,
  textoDeCuadro,
  VACIOS_DE_COLMENA,
} from "./textos.js";
import { useColmena } from "./useColmenas.js";

/** P08. Colmena: cuánto falta y quién aportó. */
export function Colmena() {
  const { id } = useParams();
  const vista = useColmena(id);
  const { fondo } = useFondo();
  const [ventana, setVentana] = useState(
    /** @type {null | "menu" | "editar" | "salir" | "archivar"} */ (null),
  );
  const volver = (
    <Link to="/colmenas" className={estilos.volver}>
      <IconoVolver /> Colmenas
    </Link>
  );

  if (vista.cargando) return <Silueta etiqueta="Cargando la colmena" bloques={[120, 320, 240]} />;

  if (vista.error) {
    const ajena = vista.error.codigo === "sin_permiso" || vista.error.codigo === "no_existe";
    return (
      <Pagina titulo="Colmena" antes={volver}>
        <ErrorAlCargar
          titulo={ajena ? SIN_PERMISO : "No pudimos traer la colmena"}
          alReintentar={ajena ? undefined : vista.reintentar}
        >
          {ajena
            ? "Solo sus integrantes pueden verla. Si te invitaron, abre el enlace de invitación."
            : undefined}
        </ErrorAlCargar>
      </Pagina>
    );
  }

  const { colmena } = vista;
  if (!colmena) return null;
  const { avance } = colmena;
  const resumen = textoDeAvance(avance, colmena.enjambre.length);

  return (
    <Pagina
      titulo={colmena.nombre}
      antes={volver}
      nota={
        [colmena.entregaEl && textoDeEntrega(colmena.entregaEl, colmena.hoy), colmena.descripcion]
          .filter(Boolean)
          .join(" · ") || undefined
      }
      acciones={
        <>
          {!colmena.cerrada && (
            <>
              <Boton a={`/colmenas/${colmena.id}/invitar`} estado={{ fondo }} tono="claro">
                Invitar al enjambre
              </Boton>
              <Boton a={`/celdas/nueva?colmena=${colmena.id}`} estado={{ fondo }}>
                Nueva celda
              </Boton>
            </>
          )}
          <button
            type="button"
            className={estilos.masAcciones}
            data-compacto=""
            aria-label={`Más acciones de ${colmena.nombre}`}
            onClick={() => setVentana("menu")}
          >
            <IconoAcciones />
          </button>
        </>
      }
    >
      <div className={estilos.detalle}>
        <section className={estilos.panelColmena} aria-labelledby="titulo-colmena">
          <header className={estilos.cabezaDePanel}>
            <h2 id="titulo-colmena" className={estilos.tituloDeSeccion}>
              La colmena
            </h2>
            <span className={estilos.porcentaje}>{avance.porcentaje} %</span>
          </header>
          {colmena.cerrada && (
            <p className={estilos.cerrada}>
              <SelloDeCera id="enjambrazon" ganado tamano={48} />
              Colmena cerrada: queda para el recuerdo, en solo lectura.
            </p>
          )}
          {avance.total === 0 ? (
            <EstadoVacio
              frase={COLMENA_VACIA}
              accion={
                !colmena.cerrada && (
                  <Boton a={`/celdas/nueva?colmena=${colmena.id}`} estado={{ fondo }}>
                    Nueva celda
                  </Boton>
                )
              }
            />
          ) : (
            <>
              <ColmenaGrande
                celdas={colmena.celdas}
                descripcion={`${resumen}. Cada celda llena lleva el color y la inicial de quien la completó.`}
              />
              <p className={estilos.cuadro}>{textoDeCuadro(avance)}</p>
            </>
          )}
        </section>

        <section className={estilos.panelEnjambre} aria-labelledby="titulo-enjambre">
          <h2 id="titulo-enjambre" className={estilos.tituloDeSeccion}>
            El enjambre
          </h2>
          <ul className={estilos.enjambre} role="list">
            {colmena.enjambre.map((abeja) => (
              <li key={abeja.id} className={estilos.abeja}>
                <span
                  className={estilos.avatar}
                  style={{ background: abeja.color }}
                  aria-hidden="true"
                >
                  {abeja.inicial}
                </span>
                <span className={estilos.nombre}>
                  {abeja.nombre}
                  {abeja.id === colmena.miId && " (tú)"}
                  {abeja.id === colmena.fundadoraId && (
                    <span className={estilos.rol}>Fundadora</span>
                  )}
                </span>
                <span className={estilos.aporte}>
                  {cuenta(abeja.aportes, "celda", "celdas")}
                  {abeja.pendientes > 0 && ` · ${abeja.pendientes} por hacer`}
                </span>
              </li>
            ))}
          </ul>
          {colmena.enjambre.length === 1 && !colmena.cerrada && (
            <div className={estilos.invitar}>
              <p>{ENJAMBRE_DE_UNA}</p>
              <Boton
                a={`/colmenas/${colmena.id}/invitar`}
                estado={{ fondo }}
                tono="claro"
                tamano="chico"
              >
                Invitar al enjambre
              </Boton>
            </div>
          )}
        </section>

        {avance.total > 0 && (
          <section className={estilos.panelCeldas} aria-labelledby="titulo-celdas-colmena">
            <h2 id="titulo-celdas-colmena" className={estilos.tituloDeSeccion}>
              Celdas de la colmena
            </h2>
            <Opciones
              leyenda="Mostrar"
              leyendaVisible={false}
              nombre="pestana-de-colmena"
              opciones={PESTANAS_DE_COLMENA}
              valor={vista.pestana}
              alCambiar={vista.elegirPestana}
            />
            {vista.celdas.length === 0 ? (
              <p className={estilos.nota}>{VACIOS_DE_COLMENA[vista.pestana]}</p>
            ) : (
              <ul className={estilos.filas} role="list">
                {vista.celdas.map((fila) => (
                  <FilaDeCelda
                    key={fila.id}
                    titulo={fila.titulo}
                    detalle={fila.detalle}
                    gotas={fila.gotas}
                    llena={fila.llena}
                    vencida={fila.vencida}
                    alta={fila.prioridad === "alta"}
                    deshabilitada={!vista.enLinea}
                    alCambiar={fila.sePuedeTocar ? () => vista.alternarCelda(fila) : undefined}
                  />
                ))}
              </ul>
            )}
          </section>
        )}
      </div>

      {ventana === "menu" && (
        <Ventana
          titulo={colmena.nombre}
          alCerrar={() => setVentana((actual) => (actual === "menu" ? null : actual))}
          cerrarAlTocarFuera
        >
          <MenuDeColmena colmena={colmena} elegir={setVentana} />
        </Ventana>
      )}
      {ventana === "editar" && (
        <FundarColmena colmena={colmena} hoy={colmena.hoy} alCerrar={() => setVentana(null)} />
      )}
      {(ventana === "salir" || ventana === "archivar") && (
        <Confirmar
          titulo={
            ventana === "salir" ? `¿Salir de ${colmena.nombre}?` : `¿Archivar ${colmena.nombre}?`
          }
          texto={
            ventana === "salir"
              ? "Tus celdas llenas siguen contando para la colmena. Para volver necesitarás un enlace nuevo."
              : "Dejará de aparecer en Colmenas para todo el enjambre. Lo ya llenado no se pierde."
          }
          confirmar={ventana === "salir" ? "Salir" : "Archivar"}
          ocupada={vista.ocupada}
          alConfirmar={ventana === "salir" ? vista.salir : vista.archivar}
          alCerrar={() => setVentana(null)}
        />
      )}
    </Pagina>
  );
}

function MenuDeColmena({ colmena, elegir }) {
  const cerrar = useCerrarVentana();
  const ir = (siguiente) => () => {
    elegir(siguiente);
    cerrar();
  };
  const fundadoraConEnjambre = colmena.soyFundadora && colmena.enjambre.length > 1;
  return (
    <div className={estilos.menu}>
      {!colmena.cerrada && (
        <Boton tono="claro" onClick={ir("editar")}>
          Editar
        </Boton>
      )}
      <Boton tono="peligro" onClick={ir("salir")} disabled={fundadoraConEnjambre}>
        Salir de la colmena
      </Boton>
      {fundadoraConEnjambre && (
        <p className={estilos.nota}>
          Quien fundó la colmena no puede salir mientras haya otras abejas.
        </p>
      )}
      {colmena.soyFundadora && !colmena.archivadaEn && (
        <Boton tono="peligro" onClick={ir("archivar")}>
          Archivar
        </Boton>
      )}
    </div>
  );
}

/** Confirmar una acción que no se deshace sola. El foco empieza en la opción segura. */
function Confirmar({ titulo, texto, confirmar, ocupada, alConfirmar, alCerrar }) {
  return (
    <Ventana titulo={titulo} descripcion={texto} alCerrar={alCerrar}>
      <BotonesDeConfirmacion confirmar={confirmar} ocupada={ocupada} alConfirmar={alConfirmar} />
    </Ventana>
  );
}

function BotonesDeConfirmacion({ confirmar, ocupada, alConfirmar }) {
  const cerrar = useCerrarVentana();
  return (
    <div className={estilos.botones}>
      <Boton tono="claro" onClick={cerrar} autoFocus>
        Cancelar
      </Boton>
      <Boton
        tono="peligro"
        disabled={ocupada}
        onClick={async () => {
          if (await alConfirmar()) cerrar();
        }}
      >
        {confirmar}
      </Boton>
    </div>
  );
}
