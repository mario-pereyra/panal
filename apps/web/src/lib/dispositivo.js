/** La zona horaria de este dispositivo: decide cuándo cambia el día de Panal. */
export const zonaDelDispositivo = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
