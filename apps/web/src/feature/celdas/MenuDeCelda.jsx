import { Boton } from "../../componentes/Controles.jsx";
import { useFondo } from "../../componentes/useFondo.js";
import { useCerrarVentana, Ventana } from "../../componentes/Ventana.jsx";
import estilos from "./Celdas.module.css";

/**
 * Las acciones de una fila: editar, posponer y archivar (o recuperar, si está
 * archivada). En teléfono es una hoja que sube desde abajo.
 *
 * @param {object} props
 * @param {object} props.fila
 * @param {() => void} props.alCerrar
 * @param {boolean} props.enLinea
 * @param {{ archivar: Function, recuperar: Function, posponer: Function }} props.acciones
 */
export function MenuDeCelda({ fila, alCerrar, enLinea, acciones }) {
  return (
    <Ventana titulo={fila.titulo} descripcion={fila.detalle} alCerrar={alCerrar} cerrarAlTocarFuera>
      <Acciones fila={fila} enLinea={enLinea} acciones={acciones} />
    </Ventana>
  );
}

function Acciones({ fila, enLinea, acciones }) {
  const cerrar = useCerrarVentana();
  const { fondo } = useFondo();
  /** Cierra la hoja y después hace la acción: el aviso aparece sin la hoja encima. */
  const yLuego = (accion) => () => {
    cerrar();
    accion(fila);
  };

  return (
    <div className={estilos.acciones}>
      {!enLinea && (
        <p className={estilos.sinRed}>
          Sin conexión: estas acciones esperan a que vuelva la señal.
        </p>
      )}
      {fila.archivada ? (
        <Boton onClick={yLuego(acciones.recuperar)} disabled={!enLinea}>
          Recuperar
        </Boton>
      ) : (
        <>
          <Boton a={`/celdas/${fila.id}`} estado={{ fondo }} tono="claro" onClick={cerrar}>
            Editar
          </Boton>
          {fila.tipo === "unica" && (
            <Boton tono="claro" onClick={yLuego(acciones.posponer)} disabled={!enLinea}>
              Posponer un día
            </Boton>
          )}
          <Boton tono="peligro" onClick={yLuego(acciones.archivar)} disabled={!enLinea}>
            Archivar
          </Boton>
        </>
      )}
    </div>
  );
}
