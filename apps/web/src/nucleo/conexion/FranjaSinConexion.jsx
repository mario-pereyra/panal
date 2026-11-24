import { FranjaDeEstado } from "../../componentes/ui/Estados.jsx";
import { IconoSinRed } from "../../componentes/ui/iconos.jsx";
import { SIN_CONEXION } from "./textos.js";
import { useConexion } from "./useConexion.js";

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
