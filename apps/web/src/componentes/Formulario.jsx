import { useId, useState } from "react";
import { IconoOjo } from "./iconos.jsx";
import estilos from "./Formulario.module.css";

/**
 * Controles de formulario. Todos son controles nativos con su etiqueta; el
 * dibujo es solo su aspecto.
 *
 * Los errores siguen una regla: `aria-invalid` vale "false" hasta que hay un
 * error que mostrar, y el mensaje se enlaza con `aria-describedby` solo
 * mientras se ve (un texto enlazado se lee aunque esté oculto).
 */

/** Une los identificadores que describen un control, sin huecos. */
const describir = (...ids) => ids.filter(Boolean).join(" ") || undefined;

/**
 * Campo de texto con etiqueta, ayuda y error.
 *
 * @param {object} props
 * @param {string} props.etiqueta
 * @param {string} [props.error]
 * @param {string} [props.ayuda]
 * @param {import("react").ReactNode} [props.accesorio] Un control pegado al campo, como "Mostrar".
 */
export function Campo({ etiqueta, error, ayuda, accesorio, className, ...entrada }) {
  const id = useId();
  const idDeAyuda = useId();
  const idDelError = useId();
  return (
    <div
      className={[estilos.campo, className].filter(Boolean).join(" ")}
      data-error={error ? "" : undefined}
    >
      <label className={estilos.etiqueta} htmlFor={id}>
        {etiqueta}
      </label>
      <div className={estilos.caja}>
        <input
          id={id}
          className={estilos.entrada}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={describir(ayuda && idDeAyuda, error && idDelError)}
          {...entrada}
        />
        {accesorio}
      </div>
      {ayuda && (
        <p id={idDeAyuda} className={estilos.ayuda}>
          {ayuda}
        </p>
      )}
      {error && (
        <p id={idDelError} className={estilos.error}>
          {error}
        </p>
      )}
    </div>
  );
}

/** Contraseña con un botón para mostrarla mientras se escribe. */
export function CampoDeClave(props) {
  const [visible, setVisible] = useState(false);
  return (
    <Campo
      {...props}
      type={visible ? "text" : "password"}
      autoCapitalize="none"
      spellCheck={false}
      accesorio={
        <button
          type="button"
          className={estilos.mostrar}
          aria-pressed={visible}
          aria-label="Mostrar la contraseña"
          onClick={() => setVisible((antes) => !antes)}
        >
          <IconoOjo tachado={!visible} />
        </button>
      }
    />
  );
}

/** Texto largo, como la descripción de una colmena. */
export function AreaDeTexto({ etiqueta, error, ayuda, ...entrada }) {
  const id = useId();
  const idDeAyuda = useId();
  const idDelError = useId();
  return (
    <div className={estilos.campo} data-error={error ? "" : undefined}>
      <label className={estilos.etiqueta} htmlFor={id}>
        {etiqueta}
      </label>
      <textarea
        id={id}
        className={`${estilos.entrada} ${estilos.area}`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={describir(ayuda && idDeAyuda, error && idDelError)}
        rows={3}
        {...entrada}
      />
      {ayuda && (
        <p id={idDeAyuda} className={estilos.ayuda}>
          {ayuda}
        </p>
      )}
      {error && (
        <p id={idDelError} className={estilos.error}>
          {error}
        </p>
      )}
    </div>
  );
}

/** Lista desplegable nativa. */
export function Selector({ etiqueta, error, ayuda, opciones, ...entrada }) {
  const id = useId();
  const idDeAyuda = useId();
  const idDelError = useId();
  return (
    <div className={estilos.campo} data-error={error ? "" : undefined}>
      <label className={estilos.etiqueta} htmlFor={id}>
        {etiqueta}
      </label>
      <select
        id={id}
        className={`${estilos.entrada} ${estilos.selector}`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={describir(ayuda && idDeAyuda, error && idDelError)}
        {...entrada}
      >
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.etiqueta}
          </option>
        ))}
      </select>
      {ayuda && (
        <p id={idDeAyuda} className={estilos.ayuda}>
          {ayuda}
        </p>
      )}
      {error && (
        <p id={idDelError} className={estilos.error}>
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Interruptor de encendido y apagado: una casilla con el atributo `switch`
 * (Safari lo dibuja como interruptor nativo) y el rol `switch` para los
 * navegadores que todavía no lo conocen. El aspecto es el mismo en todos.
 *
 * @param {object} props
 * @param {string} props.etiqueta
 * @param {string} [props.descripcion] Explica el estado o por qué está desactivado.
 * @param {boolean} props.encendido
 * @param {(encendido: boolean) => void} props.alCambiar
 */
export function Interruptor({ etiqueta, descripcion, encendido, alCambiar, disabled, name }) {
  const id = useId();
  const idDeLaDescripcion = useId();
  return (
    <div className={estilos.interruptor}>
      <label className={estilos.etiquetaDelInterruptor} htmlFor={id}>
        <span>{etiqueta}</span>
        {descripcion && (
          <span id={idDeLaDescripcion} className={estilos.ayuda}>
            {descripcion}
          </span>
        )}
      </label>
      <input
        id={id}
        name={name}
        className={estilos.palanca}
        type="checkbox"
        role="switch"
        {...{ switch: "" }}
        checked={encendido}
        disabled={disabled}
        aria-describedby={descripcion ? idDeLaDescripcion : undefined}
        onChange={(evento) => alCambiar(evento.target.checked)}
      />
    </div>
  );
}

/**
 * Elegir una entre pocas opciones, todas a la vista: botones de radio con
 * aspecto de píldoras.
 *
 * @param {object} props
 * @param {string} props.leyenda
 * @param {string} props.nombre
 * @param {Array<{ valor: string, etiqueta: string, detalle?: string }>} props.opciones
 * @param {string} props.valor
 * @param {(valor: string) => void} props.alCambiar
 * @param {boolean} [props.leyendaVisible]
 */
export function Opciones({
  leyenda,
  nombre,
  opciones,
  valor,
  alCambiar,
  leyendaVisible = true,
  error,
}) {
  const idDelError = useId();
  return (
    <fieldset
      className={estilos.grupo}
      aria-describedby={error ? idDelError : undefined}
      data-error={error ? "" : undefined}
    >
      <legend className={leyendaVisible ? estilos.etiqueta : "solo-lectores"}>{leyenda}</legend>
      <div className={estilos.opciones}>
        {opciones.map((opcion) => (
          <label key={opcion.valor} className={estilos.opcion}>
            <input
              type="radio"
              name={nombre}
              value={opcion.valor}
              checked={valor === opcion.valor}
              onChange={() => alCambiar(opcion.valor)}
            />
            <span>{opcion.etiqueta}</span>
            {opcion.detalle && <span className={estilos.detalleDeOpcion}>{opcion.detalle}</span>}
          </label>
        ))}
      </div>
      {error && (
        <p id={idDelError} className={estilos.error}>
          {error}
        </p>
      )}
    </fieldset>
  );
}

/**
 * Elegir varias entre pocas opciones: casillas con aspecto de fichas, como
 * los días de la semana.
 *
 * @param {object} props
 * @param {string} props.leyenda
 * @param {string} props.nombre
 * @param {Array<{ valor: number, etiqueta: string, nombre: string }>} props.opciones
 * @param {number[]} props.valores
 * @param {(valores: number[]) => void} props.alCambiar
 */
export function Fichas({ leyenda, nombre, opciones, valores, alCambiar, error }) {
  const idDelError = useId();
  const alternar = (valor, marcada) =>
    alCambiar(marcada ? [...valores, valor] : valores.filter((otro) => otro !== valor));
  return (
    <fieldset
      className={estilos.grupo}
      aria-describedby={error ? idDelError : undefined}
      data-error={error ? "" : undefined}
    >
      <legend className={estilos.etiqueta}>{leyenda}</legend>
      <div className={estilos.fichas}>
        {opciones.map((opcion) => (
          <label key={opcion.valor} className={estilos.ficha}>
            <input
              type="checkbox"
              name={nombre}
              value={opcion.valor}
              checked={valores.includes(opcion.valor)}
              onChange={(evento) => alternar(opcion.valor, evento.target.checked)}
              aria-label={opcion.nombre}
            />
            <span aria-hidden="true">{opcion.etiqueta}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={idDelError} className={estilos.error}>
          {error}
        </p>
      )}
    </fieldset>
  );
}

/** Un número pequeño con botones para restar y sumar. */
export function Contador({ etiqueta, valor, minimo, maximo, alCambiar }) {
  const id = useId();
  const fijar = (numero) => alCambiar(Math.min(maximo, Math.max(minimo, numero)));
  return (
    <div className={estilos.campo}>
      <label className={estilos.etiqueta} htmlFor={id}>
        {etiqueta}
      </label>
      <div className={estilos.contador}>
        <button
          type="button"
          className={estilos.paso}
          onClick={() => fijar(valor - 1)}
          disabled={valor <= minimo}
          aria-label={`${etiqueta}: uno menos`}
        >
          −
        </button>
        <input
          id={id}
          className={`${estilos.entrada} ${estilos.numero}`}
          type="number"
          inputMode="numeric"
          min={minimo}
          max={maximo}
          value={valor}
          onChange={(evento) => {
            const numero = Number.parseInt(evento.target.value, 10);
            if (Number.isFinite(numero)) fijar(numero);
          }}
        />
        <button
          type="button"
          className={estilos.paso}
          onClick={() => fijar(valor + 1)}
          disabled={valor >= maximo}
          aria-label={`${etiqueta}: uno más`}
        >
          +
        </button>
      </div>
    </div>
  );
}

/**
 * Error general de un formulario, sobre los campos. `role="alert"` lo anuncia
 * en cuanto aparece.
 */
export function ErrorDelFormulario({ children }) {
  if (!children) return null;
  return (
    <p className={estilos.errorGeneral} role="alert">
      {children}
    </p>
  );
}
