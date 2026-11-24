import { PANAL_POR_ESTRENAR } from "../../nucleo/textos.js";

export const CELDAS = "Celdas";

export const NOMBRES_DE_PESTANA = {
  hoy: "Hoy",
  proximas: "Próximas",
  recurrentes: "Recurrentes",
  hechas: "Hechas",
  archivadas: "Archivadas",
};

export const VACIOS = {
  hoy: PANAL_POR_ESTRENAR,
  proximas: "No hay nada en el horizonte. Buen momento para planear la semana.",
  recurrentes: "Todavía no tienes celdas recurrentes. Son las que se repiten.",
  hechas: "Lo que llenes queda aquí siete días, por si necesitas deshacerlo.",
  archivadas: "Aquí guardas lo que ya no necesitas ver.",
};

export const SIN_RESULTADOS = "Ninguna celda coincide con los filtros.";

export const textoDeSemana = ({ hechas, meta }) => `${hechas} de ${meta} esta semana`;

export const ERROR_AL_CARGAR = "No pudimos traer tus celdas";

export const SIN_CONEXION = "Sin conexión: estas acciones esperan a que vuelva la señal.";

export const LISTAS_DE_CELDAS = "Listas de celdas";

export const FILTROS = "Filtros";

export const COLMENA = "Colmena";

export const TODAS_LAS_CELDAS = "Todas las celdas";

export const SOLO_PERSONALES = "Solo personales";

export const CARGANDO = "Cargando tus celdas";

export const QUITAR_FILTROS = "Quitar filtros";

export const accionesDe = (titulo) => `Acciones de ${titulo}`;

export const MAS_ADELANTE = "Más adelante";

export const RECUPERAR = "Recuperar";

export const EDITAR = "Editar";

export const POSPONER = "Posponer un día";

export const ARCHIVAR = "Archivar";

export const AVISOS_AL_RECUPERAR = {
  exito: "Celda recuperada: vuelve a tu panal.",
  error: "No se pudo recuperar. Inténtalo otra vez.",
};

export const AVISOS_AL_POSPONER = {
  exito: "Pospuesta para el día siguiente.",
  error: "No se pudo posponer. Inténtalo otra vez.",
};
