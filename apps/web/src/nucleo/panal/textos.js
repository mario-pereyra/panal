export const celdaNoGuardada = (error) =>
  error.codigo === "sin_conexion"
    ? "Sin conexión: la celda volvió a como estaba. Inténtalo con señal."
    : `No se guardó la celda. ${error.mensaje}`;

export const CELDA_ARCHIVADA = "Celda archivada";

export const DESHACER = "Deshacer";

export const NO_SE_ARCHIVO = "No se pudo archivar. Inténtalo otra vez.";
