import { diaLogico } from "@panal/motor";
import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { leerError } from "../api/errores.js";
import { panalApi } from "../api/panalApi.js";
import { avisar } from "../feature/avisos/avisosSlice.js";
import { encolarCelebraciones } from "../feature/celebraciones/celebracionesSlice.js";
import { CLAVE_DE_FRANJA, cerrarFranja } from "../feature/hoy/hoySlice.js";
import { CLAVE_DE_MOVIMIENTO, elegirMovimiento } from "../feature/miVuelo/miVueloSlice.js";
import {
  CLAVE_DEL_PRIMER_VUELO,
  terminarRecorrido,
} from "../feature/primerVuelo/primerVueloSlice.js";
import { marcarAhora } from "../feature/reloj/relojSlice.js";
import {
  CLAVE_DE_INVITACION,
  guardarInvitacion,
  olvidarInvitacion,
} from "../feature/sesion/sesionSlice.js";
import { borrar, guardar } from "./almacen.js";

/**
 * Los efectos de la aplicación. Los reducers solo cambian datos; lo que pasa
 * "después de" (encolar un logro, avisar de un error, recordar algo en el
 * navegador) vive aquí.
 */
export const escuchas = createListenerMiddleware();

// El servidor respondió a una celda llena: sus logros pasan a la cola de celebraciones.
escuchas.startListening({
  matcher: panalApi.endpoints.llenarCelda.matchFulfilled,
  effect: (accion, api) => {
    // En el primer vuelo los logros se muestran en la misma pantalla, no en una ventana.
    const yo = panalApi.endpoints.obtenerYo.select()(api.getState()).data;
    if (!yo?.primerVueloEn) return;
    const celebraciones = accion.payload?.celebraciones ?? [];
    if (celebraciones.length > 0) api.dispatch(encolarCelebraciones(celebraciones));
  },
});

// Una celda no se pudo llenar o vaciar: la mutación ya deshizo el cambio a la vista; aquí se explica.
escuchas.startListening({
  matcher: isAnyOf(
    panalApi.endpoints.llenarCelda.matchRejected,
    panalApi.endpoints.vaciarCelda.matchRejected,
  ),
  effect: (accion, api) => {
    if (accion.meta?.condition) return;
    const error = leerError(accion.payload ?? { status: "FETCH_ERROR" });
    const texto =
      error.codigo === "sin_conexion"
        ? "Sin conexión: la celda volvió a como estaba. Inténtalo con señal."
        : `No se guardó la celda. ${error.mensaje}`;
    api.dispatch(avisar({ texto, tono: "error" }));
  },
});

// La invitación pendiente se recuerda mientras dure la pestaña, aunque se recargue.
escuchas.startListening({
  matcher: isAnyOf(guardarInvitacion, olvidarInvitacion),
  effect: (accion) => {
    if (guardarInvitacion.match(accion)) guardar(CLAVE_DE_INVITACION, accion.payload, "sesion");
    else borrar(CLAVE_DE_INVITACION, "sesion");
  },
});

// La franja de la racha cerrada hoy no vuelve a aparecer al recargar.
escuchas.startListening({
  actionCreator: cerrarFranja,
  effect: (accion) => guardar(CLAVE_DE_FRANJA, accion.payload),
});

// El paso del primer vuelo se recuerda para retomarlo al volver; al terminar, se olvida.
escuchas.startListening({
  predicate: (accion) => accion.type.startsWith("primerVuelo/"),
  effect: (accion, api) => {
    if (terminarRecorrido.match(accion)) borrar(CLAVE_DEL_PRIMER_VUELO);
    else guardar(CLAVE_DEL_PRIMER_VUELO, JSON.stringify(api.getState().primerVuelo));
  },
});

// La preferencia de movimiento es de este dispositivo: se guarda en el navegador.
escuchas.startListening({
  actionCreator: elegirMovimiento,
  effect: (accion) => {
    if (accion.payload === "reducido") guardar(CLAVE_DE_MOVIMIENTO, "reducido");
    else borrar(CLAVE_DE_MOVIMIENTO);
  },
});

// A las 03:00 cambia el día de Panal: lo que dependía de "hoy" se vuelve a pedir.
escuchas.startListening({
  actionCreator: marcarAhora,
  effect: (accion, api) => {
    const zona = panalApi.endpoints.obtenerYo.select()(api.getState()).data?.zonaHoraria;
    if (!zona) return;
    const antes = api.getOriginalState().reloj.ahora;
    if (diaLogico(antes, zona) === diaLogico(accion.payload, zona)) return;
    api.dispatch(
      panalApi.util.invalidateTags(["Panal", "Actividades", "Colmenas", "Progreso", "Reporte"]),
    );
  },
});
