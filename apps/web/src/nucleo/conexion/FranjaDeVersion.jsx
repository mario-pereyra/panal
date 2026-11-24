import { FranjaDeEstado } from "../../componentes/ui/Estados.jsx";
import { ACTUALIZAR, VERSION_NUEVA } from "./textos.js";
import { useConexion } from "./useConexion.js";

// No se cierra sola: actualizar recarga la página, y eso lo decide la persona cuando le venga bien.
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
