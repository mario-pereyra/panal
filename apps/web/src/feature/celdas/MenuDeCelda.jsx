import { AvisoSinConexion, Boton } from "../../componentes/ui/Controles.jsx";
import { useCerrarVentana, Ventana } from "../../componentes/ui/Ventana.jsx";
import estilos from "./MenuDeCelda.module.css";
import { ARCHIVAR, EDITAR, POSPONER, RECUPERAR, SIN_CONEXION } from "./textos.js";

/** En teléfono es una hoja que sube desde abajo. */
export function MenuDeCelda({ fila, celdas, alCerrar }) {
  return (
    <Ventana titulo={fila.titulo} descripcion={fila.detalle} alCerrar={alCerrar} cerrarAlTocarFuera>
      <Acciones fila={fila} celdas={celdas} />
    </Ventana>
  );
}

function Acciones({ fila, celdas }) {
  const cerrar = useCerrarVentana();
  const { enLinea } = celdas;
  /** Cierra la hoja y después hace la acción: el aviso aparece sin la hoja encima. */
  const yLuego = (accion) => () => {
    cerrar();
    accion(fila);
  };

  return (
    <div className={estilos.acciones}>
      {!enLinea && <AvisoSinConexion>{SIN_CONEXION}</AvisoSinConexion>}
      {fila.archivada ? (
        fila.permisos.archivar && (
          <Boton onClick={yLuego(celdas.recuperar)} disabled={!enLinea}>
            {RECUPERAR}
          </Boton>
        )
      ) : (
        <>
          {fila.permisos.editar && (
            <Boton a={`/celdas/${fila.id}`} ventana tono="claro" onClick={cerrar}>
              {EDITAR}
            </Boton>
          )}
          {fila.permisos.editar && fila.tipo === "unica" && (
            <Boton tono="claro" onClick={yLuego(celdas.posponer)} disabled={!enLinea}>
              {POSPONER}
            </Boton>
          )}
          {fila.permisos.archivar && (
            <Boton tono="peligro" onClick={yLuego(celdas.archivar)} disabled={!enLinea}>
              {ARCHIVAR}
            </Boton>
          )}
        </>
      )}
    </div>
  );
}
