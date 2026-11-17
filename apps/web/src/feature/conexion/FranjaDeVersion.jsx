import { FranjaDeEstado } from "../../componentes/Estados.jsx";
import { ACTUALIZAR, VERSION_NUEVA } from "./textos.js";
import { useConexion } from "./useConexion.js";

/**
 * "Hay una versión nueva" con su botón. No se cierra sola: actualizar recarga
 * la página, y eso lo decide la persona cuando le venga bien.
 */
export function FranjaDeVersion() {
  const { versionNueva, actualizar } = useConexion();
  return (
    <div role="status">
      {versionNueva && (
        <FranjaDeEstado accion={{ etiqueta: ACTUALIZAR, alPulsar: actualizar }}>
          {VERSION_NUEVA}
        </FranjaDeEstado>
      )}
    </div>
  );
}
