import { CUADROS_POR_COLMENA, DIAS_POR_HITO, RESERVAS_MAXIMAS } from "@panal/motor";
import { enLetras } from "../../lib/formato.js";
import { faltanGotasPara, ordinalDeCuadro, textoDeGotas, textoDeRachaDeVuelo } from "../textos.js";

/** Zum celebra el avance; nunca compara ni exige. */

export const SEGUIR = "Seguir";

export const PANAL_SELLADO = "El panal de hoy, sellado";

export const descripcionDeEscalera = (nivel) => `Escalera de oficios en el nivel ${nivel}`;

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
          ? `${faltanGotasPara(logro.faltan, logro.siguiente)}.`
          : "Llegaste a lo más alto de la escalera.",
        fichas: [`Nivel ${logro.nivel}`],
      };
    case "cuadro":
      return {
        titulo: `¡La colmena cerró su ${ordinalDeCuadro(logro.cuadro)} cuadro!`,
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
        titulo: `¡${textoDeRachaDeVuelo(logro.dias)}!`,
        detalle: `Cada ${enLetras(DIAS_POR_HITO)} días tu racha suma una reserva de miel, hasta ${enLetras(RESERVAS_MAXIMAS)}.`,
        fichas: [textoDeGotas(logro.gotas)],
      };
    case "panal-cerrado":
      return {
        titulo: "¡Panal cerrado!",
        detalle: "Zum selló el panal de hoy.",
        fichas: [
          textoDeGotas(logro.gotas),
          ...(logro.racha ? [textoDeRachaDeVuelo(logro.racha)] : []),
        ],
      };
    default:
      return { titulo: "¡Bien hecho!", detalle: "", fichas: [] };
  }
}
