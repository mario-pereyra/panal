import { ERRORES } from "@panal/contratos/errores";
import { cuenta, plural } from "../../lib/formato.js";

export const UNIRME_A_UNA_COLMENA = "Unirme a una colmena";

export const COMPROBANDO_EL_ENLACE = "Comprobando el enlace…";

export const INVITACION_NO_DISPONIBLE = "Invitación no disponible";

/** Sin señal no se sabe si la invitación sigue activa: se dice eso, no que venció. */
export const porQueNoEstaDisponible = (error) =>
  error.codigo === "sin_conexion" ? error.mensaje : ERRORES.invitacion_vencida.mensaje;

/** "Sofía te invita a la colmena Proyecto final" */
export const textoDeInvitacion = (vista) =>
  `${vista.invita.nombre} te invita a la colmena ${vista.colmena.nombre}`;

export const abejasEnElEnjambre = (abejas) =>
  `Ya ${plural(abejas, "hay", "son")} ${cuenta(abejas, "abeja", "abejas")} en el enjambre.`;

export const UNIRME = "Unirme";

export const UNIENDOTE = "Uniéndote…";
