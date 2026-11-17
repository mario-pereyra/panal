/**
 * Fechas de Panal.
 *
 * Un "día" es una cadena AAAA-MM-DD. Todo el motor trabaja con días, nunca con
 * instantes: así ninguna regla depende de la zona horaria ni del reloj.
 */

/** Hora local a la que cambia el día. Quien estudia de noche no pierde el día por minutos. */
export const HORA_DE_CAMBIO = 3;

/** Nombres de los días, empezando en lunes, como los numera el motor. */
export const DIAS_DE_LA_SEMANA = [
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
  "domingo",
];

const formateadores = new Map();

function partesLocales(instante, zona) {
  let formateador = formateadores.get(zona);
  if (!formateador) {
    formateador = new Intl.DateTimeFormat("en-CA", {
      timeZone: zona,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23",
    });
    formateadores.set(zona, formateador);
  }
  const partes = {};
  for (const { type, value } of formateador.formatToParts(new Date(instante))) {
    partes[type] = value;
  }
  return partes;
}

/**
 * Hora del reloj (0 a 23) en una zona horaria.
 * @param {number | string | Date} instante
 * @param {string} zona Zona horaria IANA, por ejemplo "America/La_Paz".
 * @returns {number}
 */
export function horaLocal(instante, zona) {
  return Number(partesLocales(instante, zona).hour);
}

/**
 * Día de Panal al que pertenece un instante. Las 02:30 del sábado son del viernes.
 * @param {number | string | Date} instante
 * @param {string} zona Zona horaria IANA.
 * @returns {string} Día en formato AAAA-MM-DD.
 */
export function diaLogico(instante, zona) {
  const partes = partesLocales(instante, zona);
  const dia = `${partes.year}-${partes.month}-${partes.day}`;
  return Number(partes.hour) < HORA_DE_CAMBIO ? sumarDias(dia, -1) : dia;
}

/**
 * @param {string} dia
 * @param {number} cantidad Días que se suman; negativo para retroceder.
 * @returns {string}
 */
export function sumarDias(dia, cantidad) {
  const fecha = new Date(`${dia}T00:00:00Z`);
  fecha.setUTCDate(fecha.getUTCDate() + cantidad);
  return fecha.toISOString().slice(0, 10);
}

/**
 * @param {string} dia
 * @returns {number} 0 para lunes, 6 para domingo.
 */
export function diaDeLaSemana(dia) {
  return (new Date(`${dia}T00:00:00Z`).getUTCDay() + 6) % 7;
}

/**
 * Lunes de la semana a la que pertenece un día.
 * @param {string} dia
 * @returns {string}
 */
export function lunesDe(dia) {
  return sumarDias(dia, -diaDeLaSemana(dia));
}

/**
 * @typedef {object} TramoDeAjustes Lo que rige desde un día hasta el tramo siguiente.
 * @property {string} desde
 * @property {number} metaDiaria
 * @property {number | null} diaSinFlores
 *
 * @typedef {object} Ajustes
 * @property {number} metaDiaria La meta de hoy.
 * @property {number | null} [diaSinFlores] El día sin flores de hoy.
 * @property {{ desde: string, hasta: string } | null} [invernada] Ya trae sus fechas.
 * @property {TramoDeAjustes[]} [historial] Desde qué día rigió cada meta y día sin
 *   flores, ordenado por `desde`. Sin él, los ajustes de hoy valen para todos los días.
 */

/**
 * Los ajustes que regían un día. Así un cambio de meta no reescribe los
 * panales de días pasados: cada día se cuenta con lo que regía entonces.
 *
 * @template {Ajustes} T
 * @param {T} ajustes
 * @param {string} dia
 * @returns {T}
 */
export function ajustesDelDia(ajustes, dia) {
  const { historial } = ajustes;
  if (!historial?.length) return ajustes;
  // Antes del primer tramo no hubo actividad: vale el primero.
  let vigente = historial[0];
  for (const tramo of historial) {
    if (tramo.desde > dia) break;
    vigente = tramo;
  }
  return { ...ajustes, metaDiaria: vigente.metaDiaria, diaSinFlores: vigente.diaSinFlores };
}

/**
 * Si ese día no se espera nada de la persona: su día sin flores o una invernada.
 * @param {Ajustes} ajustes
 * @param {string} dia
 * @returns {boolean}
 */
export function esDescanso(ajustes, dia) {
  const { diaSinFlores, invernada } = ajustesDelDia(ajustes, dia);
  if (diaSinFlores != null && diaDeLaSemana(dia) === diaSinFlores) return true;
  return Boolean(invernada && dia >= invernada.desde && dia <= invernada.hasta);
}
