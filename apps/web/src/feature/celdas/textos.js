/**
 * Textos de "Celdas" (P05).
 */

export const NOMBRES_DE_PESTANA = {
  hoy: "Hoy",
  proximas: "Próximas",
  recurrentes: "Recurrentes",
  archivadas: "Archivadas",
};

export const VACIOS = {
  hoy: "Tu panal de hoy está por estrenar. Crea tu primera celda.",
  proximas: "No hay nada en el horizonte. Buen momento para planear la semana.",
  recurrentes: "Todavía no tienes celdas recurrentes. Son las que se repiten.",
  archivadas: "Aquí guardas lo que ya no necesitas ver.",
};

export const SIN_RESULTADOS = "Ninguna celda coincide con los filtros.";

/** "2 de 3 esta semana" */
export const textoDeSemana = ({ hechas, meta }) => `${hechas} de ${meta} esta semana`;
