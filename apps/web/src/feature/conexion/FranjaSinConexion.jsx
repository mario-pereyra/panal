import { FranjaDeEstado } from "../../componentes/Estados.jsx";
import { IconoSinRed } from "../../componentes/iconos.jsx";
import { SIN_CONEXION } from "./textos.js";
import { useConexion } from "./useConexion.js";

/** La franja fija bajo la cabecera mientras no hay red. */
export function FranjaSinConexion() {
  const { enLinea } = useConexion();
  return (
    <div role="status">
      {!enLinea && (
        <FranjaDeEstado tono="ala" icono={<IconoSinRed />}>
          {SIN_CONEXION}
        </FranjaDeEstado>
      )}
    </div>
  );
}
