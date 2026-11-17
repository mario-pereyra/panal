import { actividad as esquemaDeActividad } from "@panal/contratos";
import { useEffect, useRef, useState } from "react";
import { Boton } from "../../componentes/Controles.jsx";
import {
  Campo,
  Contador,
  ErrorDelFormulario,
  Fichas,
  Interruptor,
  Opciones,
  Selector,
} from "../../componentes/Formulario.jsx";
import { useFormulario } from "../../componentes/useFormulario.js";
import { useCerrarVentana, Ventana } from "../../componentes/Ventana.jsx";
import { vistaPreviaDeGotas } from "./actividadSelector.js";
import {
  AYUDA_DE_ALTA,
  CLASES,
  DIAS,
  LIMITE_DE_ALTA,
  NOTA_DE_COLMENA,
  reglaEnPalabras,
  textoDeVistaPrevia,
  TIPOS,
} from "./textos.js";
import { aActividad, useActividad } from "./useActividad.js";
import estilos from "./VentanaDeActividad.module.css";
import { mensajeGeneral } from "../../api/errores.js";

/** P06. Nueva actividad o editar una: una ventana sobre la pantalla desde la que se llegó. */
export function VentanaDeActividad() {
  const actividad = useActividad();
  const titulo = actividad.editando ? "Editar actividad" : "Nueva actividad";

  if (actividad.buscando || actividad.noExiste) {
    return (
      <Ventana titulo={titulo} alCerrar={actividad.salir} cerrarAlTocarFuera>
        <p className={estilos.aviso}>
          {actividad.buscando ? "Buscando la celda…" : "Esta celda no existe o ya no es tuya."}
        </p>
      </Ventana>
    );
  }

  return <Formulario key={actividad.clave} actividad={actividad} titulo={titulo} />;
}

function Formulario({ actividad, titulo }) {
  const formulario = useFormulario(esquemaDeActividad, actividad.inicial, {
    convertir: aActividad,
  });
  const { valores } = formulario;
  const [confirmando, setConfirmando] = useState(false);
  const conCambios = !formulario.sinCambios || actividad.hayBorrador;

  // Lo escrito se guarda como borrador mientras se escribe.
  const { recordar } = actividad;
  const primeraVez = useRef(true);
  useEffect(() => {
    if (primeraVez.current) {
      primeraVez.current = false;
      return;
    }
    recordar(valores);
  }, [valores, recordar]);

  // Escape, Atrás o tocar fuera con cambios: se pregunta antes de descartar.
  const antesDeCerrar = (evento) => {
    if (!conCambios || confirmando) return;
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
          conCambios={conCambios}
          confirmando={confirmando}
          setConfirmando={setConfirmando}
        />
      }
    >
      <Campos actividad={actividad} formulario={formulario} />
    </Ventana>
  );
}

/** Los campos. Viven dentro de la ventana para poder cerrarla al guardar. */
function Campos({ actividad, formulario }) {
  const cerrar = useCerrarVentana();
  const { valores, cambiar, errores } = formulario;
  const colmena = actividad.colmenas.find((una) => una.id === valores.colmenaId) ?? null;
  const enColmena = Boolean(valores.colmenaId);
  const unica = valores.tipo === "unica" || enColmena;
  const regla = unica ? null : aActividad(valores).regla;

  const enviar = formulario.alEnviar(async (datos) => {
    const resultado = await actividad.guardar(datos, valores);
    if (resultado.ok) cerrar();
    else formulario.mostrarErroresDelServidor(resultado.campos);
  });

  return (
    <form
      id="formulario-de-actividad"
      ref={formulario.formulario}
      className={estilos.formulario}
      onSubmit={enviar}
      noValidate
    >
      <ErrorDelFormulario>{mensajeGeneral(actividad.error)}</ErrorDelFormulario>

      <Campo
        etiqueta="¿Qué vas a hacer?"
        autoComplete="off"
        enterKeyHint="done"
        required
        autoFocus={!actividad.editando}
        {...formulario.campo("titulo")}
      />

      {enColmena ? (
        <p className={estilos.nota}>{NOTA_DE_COLMENA}</p>
      ) : (
        <Opciones
          leyenda="Tipo"
          nombre="tipo"
          opciones={
            actividad.editando ? TIPOS.filter((tipo) => tipo.valor === valores.tipo) : TIPOS
          }
          valor={valores.tipo}
          alCambiar={(tipo) => cambiar({ tipo })}
          error={errores.tipo}
        />
      )}

      {unica ? (
        <>
          <Campo
            etiqueta="Fecha (opcional)"
            type="date"
            min={actividad.hoy}
            ayuda="Si tiene fecha, aparece en Hoy desde ya y vence ese día."
            {...formulario.campo("vence")}
          />
          <Interruptor
            etiqueta="Prioridad alta"
            descripcion={actividad.puedeMarcarAlta ? AYUDA_DE_ALTA : LIMITE_DE_ALTA}
            encendido={valores.alta}
            disabled={!actividad.puedeMarcarAlta && !valores.alta}
            alCambiar={(alta) => cambiar({ alta })}
          />
        </>
      ) : (
        <div className={estilos.repeticion}>
          <Opciones
            leyenda="¿Cada cuánto?"
            nombre="clase"
            opciones={CLASES}
            valor={valores.clase}
            alCambiar={(clase) => cambiar({ clase })}
          />
          {valores.clase === "dias" && (
            <Fichas
              leyenda="Días de la semana"
              nombre="regla.dias"
              opciones={DIAS}
              valores={valores.dias}
              alCambiar={(dias) => cambiar({ dias })}
              error={errores["regla.dias"]}
            />
          )}
          {valores.clase === "veces" && (
            <Contador
              etiqueta="Veces por semana"
              valor={valores.veces}
              minimo={1}
              maximo={6}
              alCambiar={(veces) => cambiar({ veces })}
            />
          )}
          {valores.clase === "mes" && (
            <Contador
              etiqueta="Día del mes"
              valor={valores.diaDelMes}
              minimo={1}
              maximo={31}
              alCambiar={(diaDelMes) => cambiar({ diaDelMes })}
            />
          )}
          <p className={estilos.regla} aria-live="polite">
            {reglaEnPalabras(regla)}
          </p>
        </div>
      )}

      {actividad.colmenas.length > 0 && (
        <div className={estilos.colmena}>
          <Selector
            etiqueta="Colmena (opcional)"
            name="colmenaId"
            value={valores.colmenaId}
            onChange={(evento) =>
              cambiar({ colmenaId: evento.target.value, asignadaA: "", tipo: "unica" })
            }
            opciones={[
              { valor: "", etiqueta: "Ninguna: es personal" },
              ...actividad.colmenas.map((una) => ({ valor: una.id, etiqueta: una.nombre })),
            ]}
            error={errores.colmenaId}
          />
          {colmena && (
            <Selector
              etiqueta="Asignar a"
              name="asignadaA"
              value={valores.asignadaA}
              onChange={(evento) => cambiar({ asignadaA: evento.target.value })}
              opciones={[
                { valor: "", etiqueta: "Libre: la llena quien llegue primero" },
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

      <p className={estilos.vistaPrevia}>
        {textoDeVistaPrevia(
          vistaPreviaDeGotas({ tipo: unica ? "unica" : "recurrente", alta: valores.alta }),
        )}
      </p>
    </form>
  );
}

/** Los botones del pie. Con cambios sin guardar, "Cancelar" pregunta antes de descartar. */
function Pie({ actividad, conCambios, confirmando, setConfirmando }) {
  const cerrar = useCerrarVentana();

  const descartar = () => {
    actividad.olvidar();
    cerrar();
  };

  return (
    <div className={estilos.pie}>
      {/* El mensaje reserva su sitio: al aparecer no mueve los botones bajo el puntero. */}
      <p
        id="aviso-de-descarte"
        className={estilos.descarte}
        data-visible={confirmando ? "" : undefined}
        role="status"
      >
        {confirmando ? "Tienes cambios sin guardar. ¿Los descartas?" : ""}
      </p>
      <div className={estilos.botones}>
        {confirmando ? (
          <>
            <Boton
              tono="peligro"
              onClick={descartar}
              aria-describedby="aviso-de-descarte"
              autoFocus
            >
              Descartar
            </Boton>
            <Boton tono="claro" onClick={() => setConfirmando(false)}>
              Seguir editando
            </Boton>
          </>
        ) : (
          <>
            {actividad.editando && !actividad.archivada && (
              <Boton
                tono="peligro"
                disabled={!actividad.enLinea || actividad.guardando}
                onClick={async () => {
                  if (await actividad.archivar()) cerrar();
                }}
              >
                Archivar
              </Boton>
            )}
            <Boton tono="sutil" onClick={() => (conCambios ? setConfirmando(true) : cerrar())}>
              Cancelar
            </Boton>
            <Boton
              type="submit"
              form="formulario-de-actividad"
              disabled={!actividad.enLinea || actividad.guardando}
            >
              {actividad.guardando ? "Guardando…" : "Guardar"}
            </Boton>
          </>
        )}
      </div>
      {!actividad.enLinea && (
        <p className={estilos.nota}>
          Sin conexión: lo escrito queda guardado aquí hasta que vuelva la señal.
        </p>
      )}
    </div>
  );
}
