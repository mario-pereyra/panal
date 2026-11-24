export const AVISOS = "Avisos";

export const anuncioDe = (aviso) =>
  aviso.accion ? `${aviso.texto}. Acciones disponibles.` : aviso.texto;
