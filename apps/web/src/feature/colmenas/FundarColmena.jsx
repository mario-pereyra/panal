import { cambiosDeColmena, nuevaColmena } from "@panal/contratos";
import { Boton } from "../../componentes/Controles.jsx";
import { AreaDeTexto, Campo, ErrorDelFormulario } from "../../componentes/Formulario.jsx";
import { useFormulario } from "../../componentes/useFormulario.js";
import { useCerrarVentana, Ventana } from "../../componentes/Ventana.jsx";
import estilos from "./Colmenas.module.css";
import { useFormularioDeColmena } from "./useColmenas.js";
import { mensajeGeneral } from "../../api/errores.js";

/** De los campos a la forma del contrato: lo vacío viaja como nulo. */
const aColmena = (valores) => ({
  nombre: valores.nombre,
  descripcion: valores.descripcion.trim() ? valores.descripcion : null,
  entregaEl: valores.entregaEl || null,
});

/**
 * Fundar una colmena (ventana de P07) o editarla (desde P08).
 *
 * @param {object} props
 * @param {() => void} props.alCerrar
 * @param {object} [props.colmena] Si se edita.
 * @param {string} [props.hoy]
 */
export function FundarColmena({ alCerrar, colmena, hoy }) {
  return (
    <Ventana
      titulo={colmena ? "Editar colmena" : "Fundar una colmena"}
      descripcion={
        colmena
          ? undefined
          : "Un proyecto con su enjambre: cada celda llena suma para todas las abejas."
      }
      alCerrar={alCerrar}
    >
      <Campos colmena={colmena} hoy={hoy} />
    </Ventana>
  );
}

function Campos({ colmena, hoy }) {
  const cerrar = useCerrarVentana();
  const { guardar, guardando, error, enLinea } = useFormularioDeColmena(colmena);
  const formulario = useFormulario(
    colmena ? cambiosDeColmena : nuevaColmena,
    {
      nombre: colmena?.nombre ?? "",
      descripcion: colmena?.descripcion ?? "",
      entregaEl: colmena?.entregaEl ?? "",
    },
    { convertir: aColmena },
  );

  const enviar = formulario.alEnviar(async (datos) => {
    const resultado = await guardar(datos);
    if (resultado.ok) cerrar();
    else formulario.mostrarErroresDelServidor(resultado.campos);
  });

  return (
    <form ref={formulario.formulario} className={estilos.formulario} onSubmit={enviar} noValidate>
      <ErrorDelFormulario>{mensajeGeneral(error)}</ErrorDelFormulario>
      <Campo
        etiqueta="Nombre"
        autoComplete="off"
        required
        autoFocus
        {...formulario.campo("nombre")}
      />
      <AreaDeTexto etiqueta="Descripción (opcional)" {...formulario.campo("descripcion")} />
      <Campo
        etiqueta="Fecha de entrega (opcional)"
        type="date"
        min={hoy}
        {...formulario.campo("entregaEl")}
      />
      <div className={estilos.botones}>
        <Boton tono="sutil" onClick={cerrar}>
          Cancelar
        </Boton>
        <Boton type="submit" disabled={guardando || !enLinea}>
          {guardando ? "Guardando…" : colmena ? "Guardar" : "Fundar"}
        </Boton>
      </div>
      {!enLinea && <p className={estilos.nota}>Sin conexión: hace falta señal para guardar.</p>}
    </form>
  );
}
