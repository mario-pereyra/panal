import { CUADROS_POR_COLMENA, DIAS_POR_HITO, RESERVAS_MAXIMAS } from "@panal/motor";
import { cuenta, enLetras, ORDINALES, textoDeGotas } from "../../componentes/textos.js";

/**
 * Textos de la celebración (P12). Zum celebra el avance; nunca compara ni exige.
 */

/** Título y lo ganado de cada logro. */
export function textosDeLogro(logro) {
  switch (logro.tipo) {
    case "colmena-cerrada":
      return {
        titulo: "¡Enjambrazón!",
        detalle: `${logro.colmena} llegó al cien por cien. Todo el enjambre suma.`,
        fichas: [textoDeGotas(logro.gotas)],
      };
    case "oficio":
      return {
        titulo: `¡Nuevo oficio: ${logro.nombre}!`,
        detalle: logro.siguiente
          ? `Faltan ${cuenta(logro.faltan, "gota", "gotas")} para ${logro.siguiente}.`
          : "Llegaste a lo más alto de la escalera.",
        fichas: [`Nivel ${logro.nivel}`],
      };
    case "cuadro":
      return {
        titulo: `¡La colmena cerró su ${ORDINALES[logro.cuadro - 1] ?? logro.cuadro} cuadro!`,
        detalle: `${logro.colmena}: cuadro ${logro.cuadro} de ${CUADROS_POR_COLMENA}.`,
        fichas: [textoDeGotas(logro.gotas)],
      };
    case "sello":
      return {
        titulo: `Nuevo sello de cera: ${logro.nombre}`,
        detalle: "Ya está en tu colección, en Mi vuelo.",
        fichas: [],
      };
    case "racha":
      return {
        titulo: `¡Racha de vuelo: ${cuenta(logro.dias, "día", "días")}!`,
        detalle: `Cada ${enLetras(DIAS_POR_HITO)} días tu racha suma una reserva de miel, hasta ${enLetras(RESERVAS_MAXIMAS)}.`,
        fichas: [textoDeGotas(logro.gotas)],
      };
    case "panal-cerrado":
      return {
        titulo: "¡Panal cerrado!",
        detalle: "Zum selló el panal de hoy.",
        fichas: [
          textoDeGotas(logro.gotas),
          ...(logro.racha ? [`Racha de vuelo: ${cuenta(logro.racha, "día", "días")}`] : []),
        ],
      };
    default:
      return { titulo: "¡Bien hecho!", detalle: "", fichas: [] };
  }
}
