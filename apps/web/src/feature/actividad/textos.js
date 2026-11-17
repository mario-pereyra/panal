import { MAXIMO_DE_PRIORIDAD_ALTA } from "@panal/contratos";
import { DIAS_DE_LA_SEMANA } from "@panal/motor";
import {
  cuenta,
  enLetras,
  enLista,
  INICIALES_DE_LA_SEMANA,
  textoDeGotas,
} from "../../componentes/textos.js";

/**
 * Textos de la ventana de actividad (P06).
 */

export const TIPOS = [
  { valor: "unica", etiqueta: "Única", detalle: "Se cumple una vez" },
  { valor: "recurrente", etiqueta: "Recurrente", detalle: "Se repite" },
];

export const CLASES = [
  { valor: "diaria", etiqueta: "Todos los días" },
  { valor: "dias", etiqueta: "Ciertos días" },
  { valor: "veces", etiqueta: "Veces por semana" },
  { valor: "mes", etiqueta: "Día del mes" },
];

export const DIAS = DIAS_DE_LA_SEMANA.map((nombre, valor) => ({
  valor,
  etiqueta: INICIALES_DE_LA_SEMANA[valor],
  nombre,
}));

/** La regla en una frase: "Se repite cada semana: lunes y jueves." */
export function reglaEnPalabras(regla) {
  if (!regla) return "";
  switch (regla.clase) {
    case "diaria":
      return "Se repite todos los días.";
    case "dias":
      if (regla.dias.length === 0) return "Elige al menos un día.";
      if (regla.dias.length === 7) return "Se repite todos los días.";
      return `Se repite cada semana: ${enLista([...regla.dias].sort().map((dia) => DIAS_DE_LA_SEMANA[dia]))}.`;
    case "veces":
      return `Se repite ${cuenta(regla.veces, "vez", "veces")} por semana, los días que elijas.`;
    case "mes":
      return regla.dia > 28
        ? `Se repite el día ${regla.dia} de cada mes; en los meses más cortos, el último día.`
        : `Se repite el día ${regla.dia} de cada mes.`;
    default:
      return "";
  }
}

export const textoDeVistaPrevia = (gotas) => `Esta celda vale ${textoDeGotas(gotas)}.`;

export const AYUDA_DE_ALTA = "Vale más gotas. Úsala para lo que de verdad importa.";

export const LIMITE_DE_ALTA = `Ya tienes ${enLetras(MAXIMO_DE_PRIORIDAD_ALTA)} celdas de prioridad alta. Termina una antes de marcar otra.`;

export const NOTA_DE_COLMENA = "Las celdas de una colmena son únicas: se cumplen una vez.";
