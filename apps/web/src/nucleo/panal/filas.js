import { permisosSobreActividad } from "@panal/contratos";
import { gotasDeCelda } from "@panal/motor";
import { detalleDeActividad } from "../textos.js";

/** Lo que `miId` puede hacer hoy con una actividad: las mismas reglas que aplica el servidor. */
export const permisosDe = (actividad, { miId, hoy }) =>
  permisosSobreActividad(actividad, { personaId: miId, hoy, colmena: actividad.colmena });

/** Una actividad lista para `FilaDeCelda`; `extra` agrega lo que sabe quien la arma. */
export function filaDeActividad(actividad, quien, extra = {}) {
  const fila = {
    id: actividad.id,
    titulo: actividad.titulo,
    tipo: actividad.tipo,
    prioridad: actividad.prioridad,
    regla: actividad.regla,
    vence: actividad.vence,
    colmenaId: actividad.colmenaId,
    colmena: actividad.colmena?.nombre ?? null,
    archivada: Boolean(actividad.archivadaEl),
    llena: false,
    gotas: gotasDeCelda(actividad),
    permisos: permisosDe(actividad, quien),
    ...extra,
  };
  return { ...fila, detalle: detalleDeActividad(fila) };
}
