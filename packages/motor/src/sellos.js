/**
 * Sellos de cera: las insignias de Panal. No se guardan: se deducen del historial.
 *
 * Dos sellos dependen de funciones de la versión 1.1 (pedir ayuda al enjambre y
 * mandar zumbidos). Aparecen en la rejilla, pero todavía no se pueden ganar.
 */

/**
 * @typedef {object} DefinicionDeSello
 * @property {string} id
 * @property {string} codigo Código del asset, de S01 a S17.
 * @property {string} nombre
 * @property {string} criterio Cómo se gana, dicho a la persona.
 * @property {number} meta
 * @property {boolean} secreto Su criterio no se muestra hasta ganarlo.
 * @property {boolean} disponible Falso si depende de una función que todavía no existe.
 */

/** @type {DefinicionDeSello[]} */
export const SELLOS = [
  {
    id: "primera-celda",
    codigo: "S01",
    nombre: "Primera celda",
    criterio: "Llena tu primera celda.",
    meta: 1,
    secreto: false,
    disponible: true,
  },
  {
    id: "panal-cerrado",
    codigo: "S02",
    nombre: "Panal cerrado",
    criterio: "Cierra tu panal de hoy por primera vez.",
    meta: 1,
    secreto: false,
    disponible: true,
  },
  {
    id: "semana-de-vuelo",
    codigo: "S03",
    nombre: "Semana de vuelo",
    criterio: "Llega a una racha de 7 días.",
    meta: 7,
    secreto: false,
    disponible: true,
  },
  {
    id: "luna-de-miel",
    codigo: "S04",
    nombre: "Luna de miel",
    criterio: "Llega a una racha de 30 días.",
    meta: 30,
    secreto: false,
    disponible: true,
  },
  {
    id: "cien-flores",
    codigo: "S05",
    nombre: "Cien flores",
    criterio: "Llega a una racha de 100 días.",
    meta: 100,
    secreto: false,
    disponible: true,
  },
  {
    id: "vuelta-al-panal",
    codigo: "S06",
    nombre: "Vuelta al panal",
    criterio: "Vuelve a volar después de perder una racha.",
    meta: 1,
    secreto: false,
    disponible: true,
  },
  {
    id: "nectar-fresco",
    codigo: "S07",
    nombre: "Néctar fresco",
    criterio: "Cumple diez únicas antes de que venzan.",
    meta: 10,
    secreto: false,
    disponible: true,
  },
  {
    id: "ronda-firme",
    codigo: "S08",
    nombre: "Ronda firme",
    criterio: "Cumple la cuota de una recurrente cuatro semanas seguidas.",
    meta: 4,
    secreto: false,
    disponible: true,
  },
  {
    id: "panal-limpio",
    codigo: "S09",
    nombre: "Panal limpio",
    criterio: "Ponte al día: deja en cero tus celdas vencidas.",
    meta: 1,
    secreto: false,
    disponible: true,
  },
  {
    id: "colmena-fundada",
    codigo: "S10",
    nombre: "Colmena fundada",
    criterio: "Funda una colmena y suma a otra abeja.",
    meta: 1,
    secreto: false,
    disponible: true,
  },
  {
    id: "entrada-abierta",
    codigo: "S11",
    nombre: "Entrada abierta",
    criterio: "Que tres abejas se unan a tus colmenas.",
    meta: 3,
    secreto: false,
    disponible: true,
  },
  {
    id: "primer-cuadro",
    codigo: "S12",
    nombre: "Primer cuadro",
    criterio: "Llega al 20 % en una colmena.",
    meta: 1,
    secreto: false,
    disponible: true,
  },
  {
    id: "enjambrazon",
    codigo: "S13",
    nombre: "Enjambrazón",
    criterio: "Llega al 100 % en una colmena.",
    meta: 1,
    secreto: false,
    disponible: true,
  },
  {
    id: "ala-amiga",
    codigo: "S14",
    nombre: "Ala amiga",
    criterio: "Rescata tres celdas cuando tu enjambre pida ayuda.",
    meta: 3,
    secreto: false,
    disponible: false,
  },
  {
    id: "madrugadora",
    codigo: "S15",
    nombre: "Madrugadora",
    criterio: "Llena una celda antes de las 07:00 en cinco días distintos.",
    meta: 5,
    secreto: true,
    disponible: true,
  },
  {
    id: "flor-de-siete",
    codigo: "S16",
    nombre: "Flor de siete",
    criterio: "Cierra tu panal siete días seguidos.",
    meta: 7,
    secreto: true,
    disponible: true,
  },
  {
    id: "polinizadora",
    codigo: "S17",
    nombre: "Polinizadora",
    criterio: "Manda un zumbido a cada integrante de una colmena en la misma semana.",
    meta: 1,
    secreto: true,
    disponible: false,
  },
];

/**
 * @typedef {object} HistorialParaSellos
 * @property {import("./vuelo.js").Vuelo} vuelo
 * @property {number} celdas Celdas llenas en total.
 * @property {{ cantidad: number, decimaEl: string | null }} unicasATiempo
 * @property {{ mejor: number, cuartaEl: string | null }} cuotas
 * @property {{ llenadas: number, pendientes: number, ultimaEl: string | null }} vencidas
 * @property {{ fundadasConEnjambre: number, unidas: number, mejorCuadro: number, primerCuadroEl: string | null, cerradas: number, cerradaEl: string | null }} colmenas
 * @property {{ dias: number, quintoEl: string | null }} madrugadas
 */

/**
 * Qué sellos están ganados y cuánto falta para los demás.
 * @param {HistorialParaSellos} historial
 * @returns {Array<DefinicionDeSello & { ganado: boolean, ganadoEl: string | null, actual: number }>}
 */
export function sellosDe(historial) {
  const { vuelo, unicasATiempo, cuotas, vencidas, colmenas, madrugadas } = historial;
  const { marcas } = vuelo;

  /** @type {Record<string, { actual: number, ganadoEl: string | null, ganado?: boolean }>} */
  const estado = {
    "primera-celda": { actual: historial.celdas, ganadoEl: marcas.primeraCelda ?? null },
    "panal-cerrado": { actual: vuelo.panalesCerrados, ganadoEl: marcas.primerCierre ?? null },
    "semana-de-vuelo": { actual: vuelo.mejor, ganadoEl: marcas.racha7 ?? null },
    "luna-de-miel": { actual: vuelo.mejor, ganadoEl: marcas.racha30 ?? null },
    "cien-flores": { actual: vuelo.mejor, ganadoEl: marcas.racha100 ?? null },
    "vuelta-al-panal": { actual: vuelo.vueltas, ganadoEl: marcas.vuelta ?? null },
    "nectar-fresco": { actual: unicasATiempo.cantidad, ganadoEl: unicasATiempo.decimaEl },
    "ronda-firme": { actual: cuotas.mejor, ganadoEl: cuotas.cuartaEl },
    "panal-limpio": {
      actual: vencidas.llenadas > 0 && vencidas.pendientes === 0 ? 1 : 0,
      ganadoEl: vencidas.pendientes === 0 ? vencidas.ultimaEl : null,
    },
    "colmena-fundada": { actual: colmenas.fundadasConEnjambre, ganadoEl: null },
    "entrada-abierta": { actual: colmenas.unidas, ganadoEl: null },
    "primer-cuadro": { actual: colmenas.mejorCuadro, ganadoEl: colmenas.primerCuadroEl },
    enjambrazon: { actual: colmenas.cerradas, ganadoEl: colmenas.cerradaEl },
    "ala-amiga": { actual: 0, ganadoEl: null },
    madrugadora: { actual: madrugadas.dias, ganadoEl: madrugadas.quintoEl },
    "flor-de-siete": { actual: vuelo.mejorCerradosSeguidos, ganadoEl: marcas.florDeSiete ?? null },
    polinizadora: { actual: 0, ganadoEl: null },
  };

  return SELLOS.map((sello) => {
    const { actual, ganadoEl } = estado[sello.id];
    const ganado = sello.disponible && actual >= sello.meta;
    return {
      ...sello,
      actual: Math.min(actual, sello.meta),
      ganado,
      ganadoEl: ganado ? ganadoEl : null,
    };
  });
}
