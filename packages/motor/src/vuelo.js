import { sumarDias } from "./dia.js";
import { GOTAS } from "./gotas.js";

/**
 * El vuelo: la racha, las reservas de miel y los panales cerrados, día a día.
 *
 * Es un reductor. El estado de hoy es el resultado de recorrer todas las
 * jornadas desde el primer día con `avanzarDia`:
 *
 *     const vuelo = jornadas.reduce(avanzarDia, vueloInicial());
 *
 * El servidor lo recorre hasta ayer y le manda ese estado al navegador, que da
 * el último paso con lo que pasa hoy. Las dos partes usan la misma función.
 */

/** Reservas de miel que se pueden guardar a la vez. */
export const RESERVAS_MAXIMAS = 2;

/** Cada tantos días de racha llega un hito: gotas extra y una reserva. */
export const DIAS_POR_HITO = 7;

/**
 * @typedef {object} Jornada
 * @property {string} dia
 * @property {number} llenas Celdas llenas ese día.
 * @property {number} programadas Actividades que tocaban ese día.
 * @property {boolean} cerrado Si se cerró el panal.
 * @property {boolean} descanso Día sin flores o invernada.
 * @property {boolean} terminado Falso para hoy: el día todavía puede llenarse.
 *
 * @typedef {object} Vuelo
 * @property {number} racha Días seguidos con al menos una celda.
 * @property {number} mejor La racha más larga.
 * @property {number} reservas Reservas de miel guardadas.
 * @property {number} diasActivos
 * @property {number} panalesCerrados
 * @property {number} cerradosSeguidos
 * @property {number} mejorCerradosSeguidos
 * @property {number} hitos Veces que la racha llegó a un múltiplo de 7.
 * @property {number} vueltas Veces que se volvió a volar tras perder la racha.
 * @property {number} reservasUsadas
 * @property {string | null} ultimaReservaEl Último día salvado con una reserva.
 * @property {string | null} rachaRotaEl Último día en que se perdió la racha.
 * @property {number} rachaPerdida Días que tenía la racha que se perdió.
 * @property {Record<string, string>} marcas Primer día en que pasó cada cosa.
 */

/** @returns {Vuelo} Una reserva de regalo para empezar. */
export function vueloInicial() {
  return {
    racha: 0,
    mejor: 0,
    reservas: 1,
    diasActivos: 0,
    panalesCerrados: 0,
    cerradosSeguidos: 0,
    mejorCerradosSeguidos: 0,
    hitos: 0,
    vueltas: 0,
    reservasUsadas: 0,
    ultimaReservaEl: null,
    rachaRotaEl: null,
    rachaPerdida: 0,
    marcas: {},
  };
}

/**
 * Agrega las marcas que se cumplen hoy, sin pisar las que ya tenían fecha.
 * @param {Record<string, string>} marcas
 * @param {string} dia
 * @param {Record<string, boolean>} condiciones
 */
function marcar(marcas, dia, condiciones) {
  const nuevas = Object.entries(condiciones).filter(
    ([clave, cumple]) => cumple && !(clave in marcas),
  );
  return nuevas.length === 0
    ? marcas
    : { ...marcas, ...Object.fromEntries(nuevas.map(([clave]) => [clave, dia])) };
}

/**
 * Un paso del vuelo. No modifica el estado que recibe: devuelve uno nuevo.
 *
 * - Con al menos una celda, la racha sube; cada 7 días llega un hito con una reserva.
 * - Un día de descanso, un día sin nada programado o el día de hoy sin terminar no cambian nada.
 * - Un día programado que terminó en blanco gasta una reserva; sin reservas, la racha se pierde.
 *
 * @param {Vuelo} vuelo
 * @param {Jornada} jornada
 * @returns {Vuelo}
 */
export function avanzarDia(vuelo, jornada) {
  if (jornada.llenas > 0) {
    const racha = vuelo.racha + 1;
    const esHito = racha % DIAS_POR_HITO === 0;
    const volvio = vuelo.racha === 0 && vuelo.rachaRotaEl !== null;
    const cerradosSeguidos = jornada.cerrado ? vuelo.cerradosSeguidos + 1 : 0;
    return {
      ...vuelo,
      racha,
      mejor: Math.max(vuelo.mejor, racha),
      reservas: esHito ? Math.min(RESERVAS_MAXIMAS, vuelo.reservas + 1) : vuelo.reservas,
      diasActivos: vuelo.diasActivos + 1,
      panalesCerrados: vuelo.panalesCerrados + (jornada.cerrado ? 1 : 0),
      cerradosSeguidos,
      mejorCerradosSeguidos: Math.max(vuelo.mejorCerradosSeguidos, cerradosSeguidos),
      hitos: vuelo.hitos + (esHito ? 1 : 0),
      vueltas: vuelo.vueltas + (volvio ? 1 : 0),
      marcas: marcar(vuelo.marcas, jornada.dia, {
        primeraCelda: true,
        primerCierre: jornada.cerrado,
        racha7: racha >= 7,
        racha30: racha >= 30,
        racha100: racha >= 100,
        vuelta: volvio,
        florDeSiete: cerradosSeguidos >= 7,
      }),
    };
  }

  if (jornada.descanso || !jornada.terminado || jornada.programadas === 0) return vuelo;

  if (vuelo.racha === 0) return { ...vuelo, cerradosSeguidos: 0 };
  if (vuelo.reservas > 0) {
    return {
      ...vuelo,
      reservas: vuelo.reservas - 1,
      reservasUsadas: vuelo.reservasUsadas + 1,
      ultimaReservaEl: jornada.dia,
      cerradosSeguidos: 0,
    };
  }
  return {
    ...vuelo,
    racha: 0,
    rachaRotaEl: jornada.dia,
    rachaPerdida: vuelo.racha,
    cerradosSeguidos: 0,
  };
}

/**
 * Recorre una lista de jornadas, en orden, desde un estado.
 * @param {Iterable<Jornada>} jornadas
 * @param {Vuelo} [desde]
 * @returns {Vuelo}
 */
export function recorrerVuelo(jornadas, desde = vueloInicial()) {
  return [...jornadas].reduce(avanzarDia, desde);
}

/**
 * Gotas que da el vuelo: el bono de cada panal cerrado y el de cada hito de racha.
 * @param {Vuelo} vuelo
 */
export function gotasDelVuelo(vuelo) {
  return vuelo.panalesCerrados * GOTAS.cierreDelPanal + vuelo.hitos * GOTAS.hitoDeRacha;
}

/**
 * Lo que la pantalla "Hoy" cuenta de la racha: la cifra, la mejor y lo que pasó ayer.
 * @param {Vuelo} vuelo El estado después de dar el paso de hoy.
 * @param {string} hoy
 * @param {boolean} hoyCuenta Si hoy ya hay al menos una celda.
 */
export function rachaParaHoy(vuelo, hoy, hoyCuenta) {
  const ayer = sumarDias(hoy, -1);
  return {
    actual: vuelo.racha,
    mejor: vuelo.mejor,
    reservas: vuelo.reservas,
    hoyCuenta,
    reservaUsadaAyer: vuelo.ultimaReservaEl === ayer,
    perdidaAyer: vuelo.rachaRotaEl === ayer ? vuelo.rachaPerdida : 0,
  };
}
