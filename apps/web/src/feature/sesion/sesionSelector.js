import { panalApi } from "../../api/panalApi.js";

const selectConsultaDeYo = panalApi.endpoints.obtenerYo.select();

/** El perfil de quien tiene la sesión, o `undefined`. */
export const selectYo = (estado) => selectConsultaDeYo(estado).data;

/** El código de una invitación abierta antes de entrar. */
export const selectInvitacionPendiente = (estado) => estado.sesion.invitacionPendiente;
