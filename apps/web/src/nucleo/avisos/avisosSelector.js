/** El aviso que se ve ahora: el más antiguo de la cola. */
export const selectAvisoActual = (estado) => estado.avisos.cola[0] ?? null;
