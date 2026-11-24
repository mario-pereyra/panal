import { useState } from "react";
import { Link, useParams } from "react-router";
import { Boton } from "../../componentes/ui/Controles.jsx";
import { ErrorAlCargar, Silueta } from "../../componentes/ui/Estados.jsx";
import { EstadoVacio } from "../../componentes/panal/EstadoVacio.jsx";
import { FilaDeCelda } from "../../componentes/panal/FilaDeCelda.jsx";
import { Opciones } from "../../componentes/ui/Formulario.jsx";
import { IconoAcciones, IconoVolver } from "../../componentes/ui/iconos.jsx";
import { Pagina } from "../../componentes/ui/Pagina.jsx";
import { SelloDeCera } from "../../componentes/panal/SelloDeCera.jsx";
import { porcentaje } from "../../lib/formato.js";
import { textoDeAvance } from "../../nucleo/textos.js";
import { useCerrarVentana, Ventana } from "../../componentes/ui/Ventana.jsx";
import estilos from "./Colmena.module.css";
import { Abeja, Enjambre } from "./Enjambre.jsx";
import { FundarColmena } from "./FundarColmena.jsx";
import { ColmenaGrande } from "./Graficas.jsx";
import {
  A_QUIEN,
  ARCHIVAR,
  CANCELAR,
  CARGANDO_COLMENA,
  CELDAS_DE_LA_COLMENA,
  COLMENA,
  COLMENA_CERRADA,
  COLMENA_VACIA,
  COLMENAS,
  CONFIRMACIONES,
  descripcionDeColmenaGrande,
  EDITAR,
  EL_ENJAMBRE,
  ENJAMBRE_DE_UNA,
  FUNDADORA,
  FUNDADORA_NO_SALE,
  INVITAR_AL_ENJAMBRE,
  LA_COLMENA,
  masAccionesDe,
  MOSTRAR,
  notaDeColmena,
  NUEVA_CELDA,
  PASAR_LA_FUNDACION,
  QUITAR,
  quitarA,
  RECUPERAR,
  TEXTO_DEL_TRASPASO,
  PESTANAS_DE_COLMENA,
  SALIR_DE_LA_COLMENA,
  textoDeAporte,
  textoDeCuadro,
  TU,
  VACIOS_DE_COLMENA,
} from "./textos.js";
import { useColmena } from "./useColmenas.js";

/** P08. Colmena: cuánto falta y quién aportó. */
export function Colmena() {
  const { id } = useParams();
  const vista = useColmena(id);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [accion, setAccion] = useState(
    /** @type {null | "editar" | "salir" | "archivar" | "traspasar" | "quitar"} */ (null),
  );
  const [aQuitar, setAQuitar] = useState(null);
  const volver = (
    <Link to="/colmenas" className={estilos.volver}>
      <IconoVolver /> {COLMENAS}
    </Link>
  );

  if (vista.cargando) return <Silueta etiqueta={CARGANDO_COLMENA} bloques={[120, 320, 240]} />;

  if (vista.fallo) {
    return (
      <Pagina titulo={COLMENA} antes={volver}>
        <ErrorAlCargar titulo={vista.fallo.titulo} alReintentar={vista.fallo.reintentar}>
          {vista.fallo.texto}
        </ErrorAlCargar>
      </Pagina>
    );
  }

  const { colmena } = vista;
  if (!colmena) return null;
  const { avance } = colmena;
  const resumen = textoDeAvance(avance, colmena.enjambre.length);
  const confirmacion = CONFIRMACIONES[accion];

  return (
    <Pagina
      titulo={colmena.nombre}
      antes={volver}
      nota={notaDeColmena(colmena)}
      acciones={
        <>
          {!colmena.cerrada && (
            <>
              <Boton a={`/colmenas/${colmena.id}/invitar`} ventana tono="claro">
                {INVITAR_AL_ENJAMBRE}
              </Boton>
              <Boton a={`/celdas/nueva?colmena=${colmena.id}`} ventana>
                {NUEVA_CELDA}
              </Boton>
            </>
          )}
          <button
            type="button"
            className={estilos.masAcciones}
            aria-label={masAccionesDe(colmena.nombre)}
            onClick={() => setMenuAbierto(true)}
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
              {LA_COLMENA}
            </h2>
            <span className={estilos.porcentaje}>{porcentaje(avance.porcentaje)}</span>
          </header>
          {colmena.cerrada && (
            <p className={estilos.cerrada}>
              <SelloDeCera id="enjambrazon" ganado tamano={48} />
              {COLMENA_CERRADA}
            </p>
          )}
          {avance.total === 0 ? (
            <EstadoVacio
              frase={COLMENA_VACIA}
              accion={
                !colmena.cerrada && (
                  <Boton a={`/celdas/nueva?colmena=${colmena.id}`} ventana>
                    {NUEVA_CELDA}
                  </Boton>
                )
              }
            />
          ) : (
            <>
              <ColmenaGrande
                cuadros={colmena.cuadros}
                descripcion={descripcionDeColmenaGrande(resumen)}
              />
              <p className={estilos.cuadro}>{textoDeCuadro(avance)}</p>
            </>
          )}
        </section>

        <section className={estilos.panelEnjambre} aria-labelledby="titulo-enjambre">
          <h2 id="titulo-enjambre" className={estilos.tituloDeSeccion}>
            {EL_ENJAMBRE}
          </h2>
          <Enjambre>
            {colmena.enjambre.map((abeja) => (
              <Abeja
                key={abeja.id}
                abeja={abeja}
                detalle={textoDeAporte(abeja)}
                accion={
                  colmena.permisos.quitar &&
                  abeja.id !== colmena.miId && (
                    <Boton
                      tono="claro"
                      tamano="chico"
                      aria-label={quitarA(abeja.nombre)}
                      disabled={!vista.enLinea}
                      onClick={() => {
                        setAQuitar(abeja);
                        setAccion("quitar");
                      }}
                    >
                      {QUITAR}
                    </Boton>
                  )
                }
              >
                {abeja.id === colmena.miId && TU}
                {abeja.id === colmena.fundadoraId && (
                  <span className={estilos.rol}>{FUNDADORA}</span>
                )}
              </Abeja>
            ))}
          </Enjambre>
          {colmena.pedirEnjambre && (
            <div className={estilos.invitar}>
              <p>{ENJAMBRE_DE_UNA}</p>
              <Boton a={`/colmenas/${colmena.id}/invitar`} ventana tono="claro" tamano="chico">
                {INVITAR_AL_ENJAMBRE}
              </Boton>
            </div>
          )}
        </section>

        {avance.total > 0 && (
          <section className={estilos.panelCeldas} aria-labelledby="titulo-celdas-colmena">
            <h2 id="titulo-celdas-colmena" className={estilos.tituloDeSeccion}>
              {CELDAS_DE_LA_COLMENA}
            </h2>
            <Opciones
              leyenda={MOSTRAR}
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
                    abrir={
                      fila.permisos.editar ? `/celdas/${fila.id}?colmena=${colmena.id}` : undefined
                    }
                  />
                ))}
              </ul>
            )}
          </section>
        )}
      </div>

      {menuAbierto && (
        <Ventana titulo={colmena.nombre} alCerrar={() => setMenuAbierto(false)} cerrarAlTocarFuera>
          <MenuDeColmena colmena={colmena} elegir={setAccion} recuperar={vista.recuperar} />
        </Ventana>
      )}
      {accion === "editar" && <FundarColmena colmena={colmena} alCerrar={() => setAccion(null)} />}
      {accion === "traspasar" && (
        <Ventana
          titulo={PASAR_LA_FUNDACION}
          descripcion={TEXTO_DEL_TRASPASO}
          alCerrar={() => setAccion(null)}
        >
          <Traspaso colmena={colmena} ocupada={vista.ocupada} alElegir={vista.traspasar} />
        </Ventana>
      )}
      {confirmacion && (
        <Ventana
          titulo={confirmacion.titulo(accion === "quitar" ? aQuitar.nombre : colmena.nombre)}
          descripcion={confirmacion.texto}
          alCerrar={() => setAccion(null)}
        >
          <BotonesDeConfirmacion
            confirmar={confirmacion.confirmar}
            ocupada={vista.ocupada}
            alConfirmar={
              { salir: vista.salir, archivar: vista.archivar, quitar: () => vista.quitar(aQuitar) }[
                accion
              ]
            }
          />
        </Ventana>
      )}
    </Pagina>
  );
}

function MenuDeColmena({ colmena, elegir, recuperar }) {
  const cerrar = useCerrarVentana();
  // Cerrar el menú con `close()` devuelve el foco a "Más acciones": la ventana
  // elegida lo toma de ahí y lo devuelve ahí al cerrarse.
  const ir = (siguiente) => () => {
    cerrar();
    elegir(siguiente);
  };
  const { permisos } = colmena;
  return (
    <div className={estilos.menu}>
      {permisos.editar && !colmena.cerrada && (
        <Boton tono="claro" onClick={ir("editar")}>
          {EDITAR}
        </Boton>
      )}
      {permisos.recuperar && (
        <Boton
          onClick={async () => {
            if (await recuperar()) cerrar();
          }}
        >
          {RECUPERAR}
        </Boton>
      )}
      {permisos.traspasar && (
        <Boton tono="claro" onClick={ir("traspasar")}>
          {PASAR_LA_FUNDACION}
        </Boton>
      )}
      <Boton tono="peligro" onClick={ir("salir")} disabled={!permisos.salir}>
        {SALIR_DE_LA_COLMENA}
      </Boton>
      {!permisos.salir && <p className={estilos.nota}>{FUNDADORA_NO_SALE}</p>}
      {permisos.archivar && (
        <Boton tono="peligro" onClick={ir("archivar")}>
          {ARCHIVAR}
        </Boton>
      )}
    </div>
  );
}

function Traspaso({ colmena, ocupada, alElegir }) {
  const cerrar = useCerrarVentana();
  const otras = colmena.enjambre.filter((abeja) => abeja.id !== colmena.miId);
  const [elegida, setElegida] = useState(null);
  return (
    <div className={estilos.menu}>
      <Opciones
        leyenda={A_QUIEN}
        nombre="nueva-fundadora"
        opciones={otras.map((abeja) => ({ valor: abeja.id, etiqueta: abeja.nombre }))}
        valor={elegida}
        alCambiar={setElegida}
      />
      <div className={estilos.botones}>
        <Boton tono="claro" onClick={cerrar}>
          {CANCELAR}
        </Boton>
        <Boton
          disabled={!elegida || ocupada}
          onClick={async () => {
            if (await alElegir(otras.find((abeja) => abeja.id === elegida))) cerrar();
          }}
        >
          {PASAR_LA_FUNDACION}
        </Boton>
      </div>
    </div>
  );
}

/** El foco empieza en la opción segura. */
function BotonesDeConfirmacion({ confirmar, ocupada, alConfirmar }) {
  const cerrar = useCerrarVentana();
  return (
    <div className={estilos.botones}>
      <Boton tono="claro" onClick={cerrar} autoFocus>
        {CANCELAR}
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
