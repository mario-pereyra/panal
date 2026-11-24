import { conMayuscula, cuenta, enLetras, plural } from "../../lib/formato.js";

/**
 * La voz de Panal: cercana, breve y sin culpa.
 * Fuente: docs/propuestas/A-panal/estrategia-gamificacion.md.
 */

export const HOY = "Hoy";

export const CARGANDO_TU_PANAL = "Cargando tu panal";

export const ERROR_AL_CARGAR = "No pudimos traer tus celdas";

export const CELDAS_DE_HOY = "Celdas de hoy";

export const llenasDe = (llenas, total) => `${llenas} de ${total}`;

export const COLMENA = "Colmena";

export const tituloDeColmena = (nombre) => `Colmena: ${nombre}`;

export const FUNDAR_UNA_COLMENA = "Fundar una colmena";

export const VER_TODAS_TUS_COLMENAS = "Ver todas tus colmenas";

export const descripcionDeLaColmena = (avance) =>
  `Panal de la colmena: ${avance}. Cada celda llena lleva el color de quien la completó.`;

export const aporteDeAbeja = (celdas) => cuenta(celdas, "celda", "celdas");

export const CONSTANCIA = "Constancia";

export const notaDeConstancia = (semanas) => `Últimas ${semanas} semanas, un día por celda`;

export const descripcionDeConstancia = ({ semanas, dias, conCeldas, cerrados }) =>
  `Panal de constancia de las últimas ${semanas.length} semanas: ` +
  `${conCeldas} de ${dias.length} días con celdas llenas, ` +
  `${cerrados} de ellos con el panal cerrado.`;

export function saludoDeHoy(estado, nombre) {
  if (estado === "celebrando") return `¡Panal cerrado, ${nombre}!`;
  if (estado === "descansando") return `Buen descanso, ${nombre}`;
  return `¡Buen vuelo, ${nombre}!`;
}

export function fraseDeZum(estado, resumen) {
  const { llenas, meta, faltan, programadas } = resumen;
  const avance = `Llevas ${llenas} de ${meta} celdas llenas.`;

  switch (estado) {
    case "descansando":
      return "Hoy es día sin flores. Zum descansa y tu racha también.";
    case "celebrando":
      return `${conMayuscula(enLetras(meta))} de ${enLetras(meta)}. Zum ya selló el panal de hoy.`;
    case "feliz":
      return `${avance} ${conMayuscula(enLetras(faltan))} más y Zum cierra el panal de hoy.`;
    case "animando":
      return llenas === 1
        ? "Ya llenaste la primera. La siguiente está cerca."
        : `${avance} La siguiente está cerca.`;
    case "preocupada":
      return "Todavía hay luz. Con una celda basta para seguir el vuelo.";
    default:
      return programadas === 0
        ? "Tu panal de hoy está por estrenar. ¿Creamos la primera celda?"
        : "Aquí estoy cuando quieras. ¿Qué celda llenamos primero?";
  }
}

export function descripcionDelPanal(resumen) {
  const { llenas, meta, cerrado } = resumen;
  if (cerrado) return `Panal de hoy cerrado: ${llenas} de ${meta} celdas llenas`;
  const vacias = Math.max(0, meta - llenas);
  return (
    `Panal de hoy: ${llenas} ${plural(llenas, "celda llena", "celdas llenas")} ` +
    `y ${vacias} ${plural(vacias, "vacía", "vacías")}`
  );
}

export function textoDeFranja(racha) {
  if (racha.perdidaAyer > 0) {
    return (
      `Tu racha de ${cuenta(racha.perdidaAyer, "día", "días")} descansó ayer. ` +
      `Tu mejor racha sigue siendo de ${cuenta(racha.mejor, "día", "días")}: hoy empieza otra.`
    );
  }
  if (racha.reservaUsadaAyer) {
    return "Ayer usaste una reserva de miel: tu racha sigue intacta.";
  }
  return null;
}
