import { MAXIMO_DE_VECES_POR_SEMANA, ULTIMO_DIA_DEL_MES } from "@panal/contratos";
import { useId, useState } from "react";
import { AvisoSinConexion, Boton } from "../../componentes/ui/Controles.jsx";
import {
  Campo,
  Contador,
  ErrorDelFormulario,
  Fichas,
  Interruptor,
  Opciones,
  Selector,
} from "../../componentes/ui/Formulario.jsx";
import { useCerrarVentana, Ventana } from "../../componentes/ui/Ventana.jsx";
import { PRIORIDAD_ALTA } from "../../componentes/panal/textos.js";
import {
  ARCHIVAR,
  ASIGNAR_A,
  AYUDA_DE_ALTA,
  AYUDA_DE_FECHA,
  BUSCANDO,
  CADA_CUANTO,
  CANCELAR,
  CLASES,
  COLMENA,
  DESCARTAR,
  DIA_DEL_MES,
  DIAS,
  FECHA,
  GUARDANDO,
  GUARDAR,
  LEYENDA_DE_DIAS,
  LIMITE_DE_ALTA,
  NO_EXISTE,
  NOTA_DE_COLMENA,
  PREGUNTA_DE_DESCARTE,
  QUE_VAS_A_HACER,
  reglaEnPalabras,
  SEGUIR_EDITANDO,
  SIN_COLMENA,
  SIN_CONEXION,
  textoDeVistaPrevia,
  TIPO,
  TITULO_AL_EDITAR,
  VECES_POR_SEMANA,
} from "./textos.js";
import { useActividad, useFormularioDeActividad } from "./useActividad.js";
import estilos from "./VentanaDeActividad.module.css";
import { mensajeGeneral } from "../../store/errores.js";
import { CELDA_LIBRE, NUEVA_ACTIVIDAD } from "../../nucleo/textos.js";

/** P06. Nueva actividad o editar una: una ventana sobre la pantalla desde la que se llegó. */
export function VentanaDeActividad() {
  const actividad = useActividad();
  const titulo = actividad.editando ? TITULO_AL_EDITAR : NUEVA_ACTIVIDAD;

  if (actividad.buscando || actividad.noExiste) {
    return (
      <Ventana titulo={titulo} alCerrar={actividad.salir} cerrarAlTocarFuera>
        <p className={estilos.aviso}>{actividad.buscando ? BUSCANDO : NO_EXISTE}</p>
      </Ventana>
    );
  }

  return <Formulario key={actividad.clave} actividad={actividad} titulo={titulo} />;
}

function Formulario({ actividad, titulo }) {
  const formulario = useFormularioDeActividad(actividad);
  const [confirmando, setConfirmando] = useState(false);
  const idDelFormulario = useId();

  // Escape, Atrás o tocar fuera con cambios: se pregunta antes de descartar.
  const antesDeCerrar = (evento) => {
    if (!formulario.conCambios || confirmando) return;
    evento.preventDefault();
    setConfirmando(true);
  };

  return (
    <Ventana
      titulo={titulo}
      alCerrar={actividad.salir}
      antesDeCerrar={antesDeCerrar}
      tamano="completa"
      pie={
        <Pie
          actividad={actividad}
          idDelFormulario={idDelFormulario}
          conCambios={formulario.conCambios}
          confirmando={confirmando}
          setConfirmando={setConfirmando}
        />
      }
    >
      <Campos actividad={actividad} formulario={formulario} id={idDelFormulario} />
    </Ventana>
  );
}

/** Los campos. Viven dentro de la ventana para poder cerrarla al guardar. */
function Campos({ actividad, formulario, id }) {
  const cerrar = useCerrarVentana();
  const { valores, cambiar, errores, colmena } = formulario;

  const enviar = formulario.alEnviar(async (datos) => {
    const resultado = await actividad.guardar(datos, valores);
    if (resultado.ok) cerrar();
    else formulario.mostrarErroresDelServidor(resultado.campos);
  });

  return (
    <form
      id={id}
      ref={formulario.formulario}
      className={estilos.formulario}
      onSubmit={enviar}
      noValidate
    >
      <ErrorDelFormulario>{mensajeGeneral(actividad.error)}</ErrorDelFormulario>

      <Campo
        etiqueta={QUE_VAS_A_HACER}
        autoComplete="off"
        enterKeyHint="done"
        required
        autoFocus={!actividad.editando}
        {...formulario.campo("titulo")}
      />

      {formulario.enColmena ? (
        <p className={estilos.nota}>{NOTA_DE_COLMENA}</p>
      ) : (
        <Opciones
          leyenda={TIPO}
          nombre="tipo"
          opciones={formulario.tipos}
          valor={valores.tipo}
          alCambiar={(tipo) => cambiar({ tipo })}
          error={errores.tipo}
        />
      )}

      {formulario.unica ? (
        <>
          <Campo
            etiqueta={FECHA}
            type="date"
            min={actividad.hoy}
            ayuda={AYUDA_DE_FECHA}
            {...formulario.campo("vence")}
          />
          <Interruptor
            etiqueta={PRIORIDAD_ALTA}
            descripcion={actividad.puedeMarcarAlta ? AYUDA_DE_ALTA : LIMITE_DE_ALTA}
            encendido={valores.alta}
            disabled={!actividad.puedeMarcarAlta && !valores.alta}
            alCambiar={(alta) => cambiar({ alta })}
          />
        </>
      ) : (
        <div className={estilos.repeticion}>
          <Opciones
            leyenda={CADA_CUANTO}
            nombre="clase"
            opciones={CLASES}
            valor={valores.clase}
            alCambiar={(clase) => cambiar({ clase })}
          />
          {valores.clase === "dias" && (
            <Fichas
              leyenda={LEYENDA_DE_DIAS}
              nombre="regla.dias"
              opciones={DIAS}
              valores={valores.dias}
              alCambiar={(dias) => cambiar({ dias })}
              error={errores["regla.dias"]}
            />
          )}
          {valores.clase === "veces" && (
            <Contador
              etiqueta={VECES_POR_SEMANA}
              valor={valores.veces}
              minimo={1}
              maximo={MAXIMO_DE_VECES_POR_SEMANA}
              alCambiar={(veces) => cambiar({ veces })}
            />
          )}
          {valores.clase === "mes" && (
            <Contador
              etiqueta={DIA_DEL_MES}
              valor={valores.diaDelMes}
              minimo={1}
              maximo={ULTIMO_DIA_DEL_MES}
              alCambiar={(diaDelMes) => cambiar({ diaDelMes })}
            />
          )}
          <p className={estilos.regla} aria-live="polite">
            {reglaEnPalabras(formulario.regla)}
          </p>
        </div>
      )}

      {actividad.colmenas.length > 0 && (
        <div className={estilos.colmena}>
          <Selector
            etiqueta={COLMENA}
            name="colmenaId"
            value={valores.colmenaId}
            onChange={(evento) => formulario.elegirColmena(evento.target.value)}
            opciones={[
              { valor: "", etiqueta: SIN_COLMENA },
              ...actividad.colmenas.map((una) => ({ valor: una.id, etiqueta: una.nombre })),
            ]}
            error={errores.colmenaId}
          />
          {colmena && (
            <Selector
              etiqueta={ASIGNAR_A}
              name="asignadaA"
              value={valores.asignadaA}
              onChange={(evento) => cambiar({ asignadaA: evento.target.value })}
              opciones={[
                { valor: "", etiqueta: CELDA_LIBRE },
                ...colmena.integrantes.map((abeja) => ({
                  valor: abeja.id,
                  etiqueta: abeja.nombre,
                })),
              ]}
              error={errores.asignadaA}
            />
          )}
        </div>
      )}

      <p className={estilos.vistaPrevia}>{textoDeVistaPrevia(formulario.gotas)}</p>
    </form>
  );
}

/** Con cambios sin guardar, "Cancelar" pregunta antes de descartar. */
function Pie({ actividad, idDelFormulario, conCambios, confirmando, setConfirmando }) {
  const cerrar = useCerrarVentana();
  const idDelAviso = useId();

  const descartar = () => {
    actividad.olvidar();
    cerrar();
  };

  return (
    <div className={estilos.pie}>
      {/* El mensaje reserva su sitio: al aparecer no mueve los botones bajo el puntero. */}
      <p
        id={idDelAviso}
        className={estilos.descarte}
        data-visible={confirmando ? "" : undefined}
        role="status"
      >
        {confirmando ? PREGUNTA_DE_DESCARTE : ""}
      </p>
      <div className={estilos.botones}>
        {confirmando ? (
          <>
            <Boton tono="peligro" onClick={descartar} aria-describedby={idDelAviso} autoFocus>
              {DESCARTAR}
            </Boton>
            <Boton tono="claro" onClick={() => setConfirmando(false)}>
              {SEGUIR_EDITANDO}
            </Boton>
          </>
        ) : (
          <>
            {actividad.editando && !actividad.archivada && actividad.puedeArchivar && (
              <Boton
                tono="peligro"
                disabled={!actividad.enLinea || actividad.guardando}
                onClick={async () => {
                  if (await actividad.archivar()) cerrar();
                }}
              >
                {ARCHIVAR}
              </Boton>
            )}
            <Boton tono="sutil" onClick={() => (conCambios ? setConfirmando(true) : cerrar())}>
              {CANCELAR}
            </Boton>
            <Boton
              type="submit"
              form={idDelFormulario}
              disabled={!actividad.enLinea || actividad.guardando}
            >
              {actividad.guardando ? GUARDANDO : GUARDAR}
            </Boton>
          </>
        )}
      </div>
      {!actividad.enLinea && (
        <AvisoSinConexion className={estilos.nota}>{SIN_CONEXION}</AvisoSinConexion>
      )}
    </div>
  );
}
