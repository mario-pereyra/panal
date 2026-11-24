import { DIAS_DE_INVERNADA } from "@panal/contratos";
import { DIAS_DE_LA_SEMANA, DIAS_POR_HITO, GOTAS, OFICIOS, TOPE_SUAVE_DIARIO } from "@panal/motor";
import { conMayuscula, cuenta, fechaCorta } from "../../lib/formato.js";
import { faltanGotasPara, textoDeRachaDeVuelo, textoDeReservas } from "../../nucleo/textos.js";

export const MI_VUELO = "Mi vuelo";

export const CARGANDO_TU_VUELO = "Cargando tu vuelo";

export const ERROR_AL_CARGAR = "No pudimos traer tu vuelo";

export const TU_OFICIO = "Tu oficio";

export const ESCALERA_DE_OFICIOS = "Escalera de oficios";

export const SELLOS_DE_CERA = "Sellos de cera";

export const conteoDeSellos = ({ ganados, total }) => `${ganados} de ${total}`;

export const AJUSTES = "Ajustes";

export const AJUSTE_GUARDADO = "Ajuste guardado";

export const ajusteNoGuardado = (mensaje) => `No se guardó el ajuste. ${mensaje}`;

export const TAMANO_DEL_PANAL = "Tamaño del panal";

export const DIA_SIN_FLORES = "Día sin flores";

export const INVERNADA = "Invernada";

export const HASTA = "Hasta";

export const EMPEZAR_INVERNADA = "Empezar invernada";

export const ZONA_HORARIA = "Zona horaria";

export const REDUCIR_ANIMACIONES = "Reducir animaciones";

export const COMO_SE_GANAN_LAS_GOTAS = "Cómo se ganan las gotas";

export const GOTAS_POR_LOGRO = "Gotas que vale cada logro";

export const TUS_GOTAS = "Tus gotas, de dónde vienen";

export const GOTAS_POR_ORIGEN = "Tus gotas por origen";

export const INSTALAR_PANAL = "Instalar Panal";

export const PANAL_INSTALADO = "Ya tienes Panal instalado en este dispositivo.";

export const CERRAR_SESION = "Cerrar sesión";

export const CERRANDO_SESION = "Cerrando sesión…";

/** "1240 gotas de miel · Racha de vuelo: 3 días · 2 reservas de miel" */
export const textoDeTotales = ({ gotas, racha }) =>
  [
    cuenta(gotas.total, "gota de miel", "gotas de miel"),
    textoDeRachaDeVuelo(racha.actual),
    textoDeReservas(racha.reservas),
  ].join(" · ");

export const SIN_SELLOS =
  "Tu primer sello está a una celda de distancia. El resaltado es el siguiente.";

export const TAMANOS_DE_PANAL = [
  { valor: 3, etiqueta: "3 celdas", detalle: "Para días con poco tiempo" },
  { valor: 5, etiqueta: "5 celdas", detalle: "El tamaño de siempre" },
  { valor: 7, etiqueta: "7 celdas", detalle: "Para días de mucho vuelo" },
];

export const textoDeSiguienteOficio = (oficio) =>
  oficio.siguiente
    ? faltanGotasPara(oficio.faltan, oficio.siguiente)
    : "Llegaste al último oficio. Cada gota sigue sumando.";

export const descripcionDeEscalera = (oficio) =>
  `Escalera de oficios: estás en el nivel ${oficio.nivel} de ${OFICIOS.length}, ${oficio.nombre}. ${textoDeSiguienteOficio(oficio)}.`;

export function textoDeSello(sello) {
  if (!sello.disponible) return "Llega con la próxima versión de Panal.";
  if (sello.ganado)
    return sello.ganadoEl ? `Lo ganaste el ${fechaCorta(sello.ganadoEl)}.` : "Ya es tuyo.";
  if (sello.secreto) return "Es un sello secreto: se revela al ganarlo.";
  if (sello.meta > 1) return `Llevas ${sello.actual} de ${sello.meta}.`;
  return "Todavía no.";
}

export const nombreDeSello = (sello) => (sello.oculto ? "Sello secreto" : sello.nombre);

export const etiquetaDeSello = (sello) =>
  `${nombreDeSello(sello)}${sello.ganado ? ", ganado" : ""}${sello.siguiente ? ", el siguiente" : ""}`;

const notaDeMeta = (meta) => `Desde mañana tu panal tendrá ${cuenta(meta, "celda", "celdas")}.`;

export const confirmacionDeMeta = (elegida, deHoy) =>
  elegida === deHoy ? "Tu panal queda como estaba" : notaDeMeta(elegida);

export const notaDeMetaDeManana = ({ metaDiaria, metaDeManana }) =>
  `Hoy tu panal tiene ${metaDiaria} celdas. ${notaDeMeta(metaDeManana)}`;

export const DIAS_SIN_FLORES = [
  { valor: "", etiqueta: "Ninguno" },
  ...DIAS_DE_LA_SEMANA.map((nombre, valor) => ({ valor, etiqueta: conMayuscula(nombre) })),
];

export const AYUDA_DE_DIA_SIN_FLORES =
  "Un día de descanso fijo cada semana: no rompe la racha ni pide celdas.";

export const descripcionDeInvernada = (vigenteHasta) =>
  vigenteHasta
    ? `En invernada hasta el ${fechaCorta(vigenteHasta)}.`
    : `Una pausa de hasta ${DIAS_DE_INVERNADA} días: la racha te espera congelada.`;

export const invernadaEmpezada = (hasta) =>
  `Invernada hasta el ${fechaCorta(hasta)}. Zum cuida tu racha.`;

export const INVERNADA_TERMINADA = "Invernada terminada: qué bueno verte de vuelta.";

export const AYUDA_DE_ZONA = "El día de Panal cambia a las 3 de la madrugada de esta zona.";

export const nombreDeZona = (zona) => zona.replaceAll("_", " ");

export const usarZonaDelDispositivo = (zona) =>
  `Usar la de este dispositivo (${nombreDeZona(zona)})`;

export const AYUDA_DE_MOVIMIENTO =
  "Quita las animaciones de Zum y de las celdas en este dispositivo.";

/** La tabla del motor, en palabras. */
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

export const SIN_CONEXION = "Sin conexión: los ajustes se pueden cambiar cuando vuelva la señal.";

export const NOTA_DEL_TOPE = `Pasadas las primeras ${TOPE_SUAVE_DIARIO} celdas del día, cada una vale ${GOTAS.trasElTope} gotas: el panal premia la constancia, no el atracón.`;
