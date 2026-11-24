import { cambiosDeColmena, nuevaColmena } from "@panal/contratos";
import { AvisoSinConexion, Boton } from "../../componentes/ui/Controles.jsx";
import { AreaDeTexto, Campo, ErrorDelFormulario } from "../../componentes/ui/Formulario.jsx";
import { useFormulario } from "../../componentes/ui/useFormulario.js";
import { useCerrarVentana, Ventana } from "../../componentes/ui/Ventana.jsx";
import estilos from "./FundarColmena.module.css";
import {
  CANCELAR,
  DESCRIPCION,
  FECHA_DE_ENTREGA,
  FORMULARIO_DE_COLMENA,
  GUARDANDO,
  NOMBRE,
  SIN_CONEXION_AL_FUNDAR,
} from "./textos.js";
import { useFormularioDeColmena } from "./useColmenas.js";
import { mensajeGeneral } from "../../store/errores.js";

/** De los campos a la forma del contrato: lo vacío viaja como nulo. */
const aColmena = (valores) => ({
  nombre: valores.nombre,
  descripcion: valores.descripcion.trim() ? valores.descripcion : null,
  entregaEl: valores.entregaEl || null,
});

/** Fundar una colmena (ventana de P07) o editarla (desde P08), si llega `colmena`. */
export function FundarColmena({ alCerrar, colmena }) {
  const textos = colmena ? FORMULARIO_DE_COLMENA.editar : FORMULARIO_DE_COLMENA.fundar;
  return (
    <Ventana titulo={textos.titulo} descripcion={textos.descripcion} alCerrar={alCerrar}>
      <Campos colmena={colmena} textoDeEnviar={textos.enviar} />
    </Ventana>
  );
}

function Campos({ colmena, textoDeEnviar }) {
  const cerrar = useCerrarVentana();
  const { guardar, guardando, error, enLinea, hoy } = useFormularioDeColmena(colmena);
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
        etiqueta={NOMBRE}
        autoComplete="off"
        required
        autoFocus
        {...formulario.campo("nombre")}
      />
      <AreaDeTexto etiqueta={DESCRIPCION} {...formulario.campo("descripcion")} />
      <Campo etiqueta={FECHA_DE_ENTREGA} type="date" min={hoy} {...formulario.campo("entregaEl")} />
      <div className={estilos.botones}>
        <Boton tono="sutil" onClick={cerrar}>
          {CANCELAR}
        </Boton>
        <Boton type="submit" disabled={guardando || !enLinea}>
          {guardando ? GUARDANDO : textoDeEnviar}
        </Boton>
      </div>
      {!enLinea && <AvisoSinConexion>{SIN_CONEXION_AL_FUNDAR}</AvisoSinConexion>}
    </form>
  );
}
