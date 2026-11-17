import { ERRORES } from "@panal/contratos/errores";
import { CUADROS_POR_COLMENA } from "@panal/motor";
import { cuenta, diasEntre, ORDINALES } from "../../componentes/textos.js";

/**
 * Textos de Colmenas, Colmena, Invitar y Unirme (P07 a P09 y P13).
 */

export const SIN_COLMENAS = "Todavía no tienes colmena. Funda una e invita a tu enjambre.";

export const COLMENA_VACIA = "Esta colmena está vacía. Crea su primera celda.";

export const ENJAMBRE_DE_UNA =
  "Por ahora eres la única abeja. Invita a tu enjambre: el avance se reparte.";

export const SIN_PERMISO = "Esta colmena es de otro enjambre.";

export const INVITACION_VENCIDA = ERRORES.invitacion_vencida.mensaje;

export const PESTANAS_DE_COLMENA = [
  { valor: "pendientes", etiqueta: "Pendientes" },
  { valor: "mias", etiqueta: "Mías" },
  { valor: "libres", etiqueta: "Libres" },
  { valor: "llenas", etiqueta: "Llenas" },
];

export const VACIOS_DE_COLMENA = {
  pendientes: "No queda nada pendiente. ¡Qué enjambre!",
  mias: "No tienes celdas asignadas en esta colmena.",
  libres: "No hay celdas libres ahora.",
  llenas: "Todavía no hay celdas llenas. La primera está cerca.",
};

/** "Cuadro 3 de 5. Faltan 6 celdas para el cuarto." */
export function textoDeCuadro(avance) {
  if (avance.cerrada)
    return `Cuadro ${CUADROS_POR_COLMENA} de ${CUADROS_POR_COLMENA}. Colmena cerrada.`;
  if (avance.total === 0) return "Sin celdas todavía.";
  const siguiente = ORDINALES[avance.cuadro] ?? "siguiente";
  return `Cuadro ${avance.cuadro} de ${CUADROS_POR_COLMENA}. Faltan ${cuenta(avance.faltanParaElSiguiente, "celda", "celdas")} para el ${siguiente}.`;
}

/** "18 de 30 celdas llenas entre 4 abejas" */
export const textoDeAvance = (avance, abejas) =>
  `${avance.llenas} de ${avance.total} celdas llenas entre ${cuenta(abejas, "abeja", "abejas")}`;

/** "Vence en 7 días". `venceEl` es el día lógico en que vence. */
export function textoDeVencimiento(venceEl, hoy) {
  const dias = Math.max(0, diasEntre(hoy, venceEl));
  if (dias === 0) return "Vence hoy";
  return `Vence en ${cuenta(dias, "día", "días")}`;
}

/** "Sofía te invita a la colmena Proyecto final" */
export const textoDeInvitacion = (vista) =>
  `${vista.invita.nombre} te invita a la colmena ${vista.colmena.nombre}`;
