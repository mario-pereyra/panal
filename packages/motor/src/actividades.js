import { diaDeLaSemana, lunesDe, sumarDias } from "./dia.js";

/**
 * Actividades y sus reglas de repetición.
 *
 * Una actividad es "unica" (se cumple una vez) o "recurrente" (vuelve según su
 * regla). Las reglas de una recurrente son cuatro:
 *
 * - `{ clase: "diaria" }`: todos los días.
 * - `{ clase: "dias", dias: [0, 2, 4] }`: ciertos días de la semana; 0 es lunes y 6, domingo.
 * - `{ clase: "veces", veces: 3 }`: tantas veces por semana, el día que se quiera.
 * - `{ clase: "mes", dia: 15 }`: un día del mes; en los meses cortos, el último día.
 *
 * @typedef {{ clase: "diaria" } | { clase: "dias", dias: number[] } | { clase: "veces", veces: number } | { clase: "mes", dia: number }} Regla
 *
 * @typedef {object} Actividad
 * @property {string} id
 * @property {"unica" | "recurrente"} tipo
 * @property {"normal" | "alta"} [prioridad]
 * @property {Regla | null} [regla]
 * @property {string | null} [vence] Día límite de una única, o nulo.
 * @property {string} [creadaEl] Día lógico en que se creó.
 * @property {string | null} [archivadaEl] Día lógico en que se archivó, o nulo.
 * @property {string} [creadaEn] Instante de creación, para detectar celdas relámpago.
 */

/** Clases de regla válidas, en el orden en que se ofrecen al crear una actividad. */
export const CLASES_DE_REGLA = ["diaria", "dias", "veces", "mes"];

/**
 * En el panal de quién aparece una actividad: la persona asignada o, si es
 * personal, quien la creó. Una celda libre de colmena no es de nadie.
 *
 * @param {{ colmenaId?: string | null, asignadaA?: string | null, creadaPor: string }} actividad
 * @returns {string | null}
 */
export function duenaDe(actividad) {
  return actividad.colmenaId ? (actividad.asignadaA ?? null) : actividad.creadaPor;
}

/**
 * Si ocupa uno de los cupos de prioridad alta de su dueña: única, de prioridad
 * alta, sin archivar, sin llenar y en el panal de alguien. Nadie tiene más de
 * `MAXIMO_DE_PRIORIDAD_ALTA` (contratos) a la vez.
 *
 * @param {{ tipo: string, prioridad: string, archivada?: boolean, llena?: boolean,
 *   colmenaId?: string | null, asignadaA?: string | null, creadaPor: string } | null | undefined} actividad
 */
export function ocupaCupoDeAlta(actividad) {
  return Boolean(
    actividad &&
    actividad.tipo === "unica" &&
    actividad.prioridad === "alta" &&
    !actividad.archivada &&
    !actividad.llena &&
    duenaDe(actividad),
  );
}

/**
 * Último día de un mes.
 * @param {number} anio
 * @param {number} mes De 1 a 12.
 */
function diasDelMes(anio, mes) {
  return new Date(Date.UTC(anio, mes, 0)).getUTCDate();
}

/**
 * Si una regla de calendario toca un día, sin mirar lo ya cumplido.
 * Para "veces", cualquier día puede tocar: la cuota se mira aparte.
 * @param {Regla | null | undefined} regla
 * @param {string} dia
 */
export function reglaToca(regla, dia) {
  if (!regla || regla.clase === "diaria" || regla.clase === "veces") return true;
  if (regla.clase === "dias") return regla.dias.includes(diaDeLaSemana(dia));
  if (regla.clase === "mes") {
    const [anio, mes, numero] = dia.split("-").map(Number);
    return numero === Math.min(regla.dia, diasDelMes(anio, mes));
  }
  return false;
}

/**
 * Los días en que toca una regla, desde un día dado y sin límite.
 *
 * Es un generador: quien lo usa toma solo los días que necesita, por ejemplo
 * los de las próximas dos semanas. Nunca devuelve un día anterior a `desde`.
 * Para "veces" devuelve todos los días, porque cualquiera sirve.
 *
 * @param {Regla} regla
 * @param {string} desde
 * @returns {Generator<string, never>}
 */
export function* ocurrencias(regla, desde) {
  let dia = desde;
  while (true) {
    if (reglaToca(regla, dia)) yield dia;
    dia = sumarDias(dia, 1);
  }
}

/**
 * Toma los primeros elementos de un iterable, aunque sea infinito.
 * @template T
 * @param {Iterable<T>} iterable
 * @param {number} cantidad
 * @returns {T[]}
 */
export function tomar(iterable, cantidad) {
  const resultado = [];
  if (cantidad <= 0) return resultado;
  for (const elemento of iterable) {
    resultado.push(elemento);
    if (resultado.length >= cantidad) break;
  }
  return resultado;
}

/**
 * Cuántas veces por semana pide una regla. Las mensuales no tienen cuota semanal.
 * @param {Regla | null | undefined} regla
 * @returns {number | null}
 */
export function cuotaSemanal(regla) {
  if (!regla) return null;
  if (regla.clase === "diaria") return 7;
  if (regla.clase === "dias") return regla.dias.length;
  if (regla.clase === "veces") return regla.veces;
  return null;
}

/**
 * Celdas de una actividad en la semana de un día, del lunes hasta ese día incluido.
 * Las posteriores no cuentan: al recorrer días pasados, el futuro todavía no ocurrió.
 * @param {Array<{ dia: string }>} hechos
 * @param {string} dia
 */
export function hechasEnLaSemana(hechos, dia) {
  const lunes = lunesDe(dia);
  return hechos.filter((hecho) => hecho.dia >= lunes && hecho.dia <= dia).length;
}

/**
 * Si una actividad existía y estaba activa un día: creada ese día o antes y no archivada.
 * @param {Actividad} actividad
 * @param {string} dia
 */
export function vivaEl(actividad, dia) {
  if (actividad.creadaEl && actividad.creadaEl > dia) return false;
  return !(actividad.archivadaEl && actividad.archivadaEl <= dia);
}

/**
 * Si una actividad aparece en el panal de un día, y si llega vencida.
 *
 * - Una única aparece hasta que se cumple; si se cumplió ese mismo día, sigue a la vista.
 * - Una recurrente "veces" aparece hasta cumplir su cuota de la semana; si se llenó ese día, sigue a la vista.
 *
 * @param {Actividad} actividad
 * @param {Regla | null | undefined} regla
 * @param {Array<{ dia: string }>} hechos Celdas ya llenas de esta actividad.
 * @param {string} hoy
 * @returns {{ toca: boolean, vencida: boolean }}
 */
export function tocaHoy(actividad, regla, hechos, hoy) {
  if (actividad.tipo === "unica") {
    const cumplidaAntes = hechos.some((hecho) => hecho.dia < hoy);
    const vencida = Boolean(actividad.vence && actividad.vence < hoy);
    return { toca: !cumplidaAntes, vencida: !cumplidaAntes && vencida };
  }
  if (regla?.clase === "veces") {
    const llenaHoy = hechos.some((hecho) => hecho.dia === hoy);
    const antesDeHoy = hechasEnLaSemana(hechos, hoy) - (llenaHoy ? 1 : 0);
    return { toca: llenaHoy || antesDeHoy < regla.veces, vencida: false };
  }
  return { toca: reglaToca(regla, hoy), vencida: false };
}

/**
 * Cuántas actividades tocaban un día, contando solo las que existían entonces.
 * @param {Actividad[]} actividades
 * @param {Map<string, Array<{ dia: string }>>} hechosPorActividad
 * @param {string} dia
 */
export function programadasEl(actividades, hechosPorActividad, dia) {
  return actividades.filter(
    (actividad) =>
      vivaEl(actividad, dia) &&
      tocaHoy(actividad, actividad.regla, hechosPorActividad.get(actividad.id) ?? [], dia).toca,
  ).length;
}

/**
 * Agrupa una lista por una clave. No modifica la lista: el mapa es nuevo y
 * solo se llena aquí dentro.
 * @template T
 * @param {T[]} lista
 * @param {(elemento: T) => string} clave
 * @returns {Map<string, T[]>}
 */
export function agruparPor(lista, clave) {
  const grupos = new Map();
  for (const elemento of lista) {
    const llave = clave(elemento);
    const grupo = grupos.get(llave);
    if (grupo) grupo.push(elemento);
    else grupos.set(llave, [elemento]);
  }
  return grupos;
}
