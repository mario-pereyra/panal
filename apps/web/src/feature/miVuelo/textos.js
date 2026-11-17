import { DIAS_DE_INVERNADA } from "@panal/contratos";
import { DIAS_POR_HITO, GOTAS, OFICIOS } from "@panal/motor";
import { cuenta, fechaCorta } from "../../componentes/textos.js";

/**
 * Textos de Mi vuelo (P11).
 */

export const TAMANOS_DE_PANAL = [
  { valor: 3, etiqueta: "3 celdas", detalle: "Para días con poco tiempo" },
  { valor: 5, etiqueta: "5 celdas", detalle: "El tamaño de siempre" },
  { valor: 7, etiqueta: "7 celdas", detalle: "Para días de mucho vuelo" },
];

/** "Nivel 4 · Exploradora" */
export const textoDeNivel = (oficio) => `Nivel ${oficio.nivel} · ${oficio.nombre}`;

/** "Faltan 60 gotas para Recolectora" */
export const textoDeSiguienteOficio = (oficio) =>
  oficio.siguiente
    ? `Faltan ${cuenta(oficio.faltan, "gota", "gotas")} para ${oficio.siguiente}`
    : "Llegaste al último oficio. Cada gota sigue sumando.";

export const descripcionDeEscalera = (oficio) =>
  `Escalera de oficios: estás en el nivel ${oficio.nivel} de ${OFICIOS.length}, ${oficio.nombre}. ${textoDeSiguienteOficio(oficio)}.`;

/** El progreso de un sello, dicho en una frase. */
export function textoDeSello(sello) {
  if (!sello.disponible) return "Llega con la próxima versión de Panal.";
  if (sello.ganado)
    return sello.ganadoEl ? `Lo ganaste el ${fechaCorta(sello.ganadoEl)}.` : "Ya es tuyo.";
  if (sello.secreto) return "Es un sello secreto: se revela al ganarlo.";
  if (sello.meta > 1) return `Llevas ${sello.actual} de ${sello.meta}.`;
  return "Todavía no.";
}

export const nombreDeSello = (sello) =>
  sello.secreto && !sello.ganado ? "Sello secreto" : sello.nombre;

export const NOTA_DE_META = (meta) =>
  `Desde mañana tu panal tendrá ${cuenta(meta, "celda", "celdas")}.`;

export const AYUDA_DE_DIA_SIN_FLORES =
  "Un día de descanso fijo cada semana: no rompe la racha ni pide celdas.";

export const AYUDA_DE_INVERNADA = `Una pausa de hasta ${DIAS_DE_INVERNADA} días: la racha te espera congelada.`;

export const AYUDA_DE_MOVIMIENTO =
  "Quita las animaciones de Zum y de las celdas en este dispositivo.";

/** Cómo se ganan las gotas: la tabla del motor, en palabras. */
export const COMO_SE_GANAN = [
  ["Llenar una celda recurrente", GOTAS.recurrente],
  ["Llenar una celda única", GOTAS.unica],
  ["Una única de prioridad alta", GOTAS.unicaAlta],
  ["Una única ya vencida", GOTAS.unicaVencida],
  ["Cerrar el panal del día", GOTAS.cierreDelPanal],
  ["Cumplir la cuota semanal de una recurrente", GOTAS.cuotaSemanal],
  [`Cada ${DIAS_POR_HITO} días de racha`, GOTAS.hitoDeRacha],
  ["Aportar a un cuadro de colmena", GOTAS.cuadroDeColmena],
  ["Cerrar una colmena con tu enjambre", GOTAS.colmenaCerrada],
];

export const NOMBRES_DEL_DESGLOSE = {
  celdas: "Celdas llenas",
  cierres: "Panales cerrados",
  hitos: "Hitos de racha",
  cuotas: "Cuotas semanales",
  colmenas: "Colmenas",
};
