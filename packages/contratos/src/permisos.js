/**
 * Quién puede hacer qué con una celda o una colmena. El servidor lo usa para
 * negar y la interfaz para no ofrecer lo que el servidor negaría.
 */

const NADA = { editar: false, archivar: false, cambiarDeTipo: false };

/**
 * Una personal es de quien la creó. La de una colmena la cambian quien la creó,
 * a quien está asignada y la fundadora; una vez llena, solo la fundadora la
 * archiva. Una única que se llenó antes de hoy ya terminó: es historia.
 * Se supone que la persona puede ver la actividad (sigue en su colmena).
 * @param {{ tipo: "unica" | "recurrente", creadaPor: string, asignadaA: string | null, primeraLlenaEl: string | null }} actividad
 * @param {{ personaId: string, hoy: string, colmena: { fundadoraId: string, archivada: boolean } | null }} contexto
 */
export function permisosSobreActividad(actividad, { personaId, hoy, colmena }) {
  const terminada =
    actividad.tipo === "unica" &&
    actividad.primeraLlenaEl !== null &&
    actividad.primeraLlenaEl < hoy;
  if (terminada || colmena?.archivada) return NADA;

  const creadora = actividad.creadaPor === personaId;
  if (!colmena) {
    return {
      editar: creadora,
      archivar: creadora,
      cambiarDeTipo: creadora && !actividad.primeraLlenaEl,
    };
  }

  const fundadora = colmena.fundadoraId === personaId;
  const editar = fundadora || creadora || actividad.asignadaA === personaId;
  return {
    editar,
    archivar: actividad.primeraLlenaEl ? fundadora : editar,
    // Las celdas de una colmena son únicas.
    cambiarDeTipo: false,
  };
}

/**
 * La fundadora edita, archiva, recupera, quita abejas y pasa la fundación. Sale
 * solo si se queda sin enjambre; antes tiene que pasarla.
 * @param {{ fundadoraId: string, archivada: boolean }} colmena
 * @param {{ personaId: string, abejas: number }} contexto `abejas`: quienes siguen dentro.
 */
export function permisosSobreColmena({ fundadoraId, archivada }, { personaId, abejas }) {
  const fundadora = fundadoraId === personaId;
  return {
    editar: fundadora && !archivada,
    archivar: fundadora && !archivada,
    recuperar: fundadora && archivada,
    quitar: fundadora && !archivada,
    traspasar: fundadora && !archivada && abejas > 1,
    salir: !fundadora || abejas === 1,
  };
}
