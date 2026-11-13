import { DIAS_DE_LA_SEMANA } from "@panal/motor";

/**
 * Los textos de "Hoy". La voz de Panal: cercana, breve y sin culpa.
 * Fuente: docs/propuestas/A-panal/estrategia-gamificacion.md.
 */

const EN_LETRAS = ["cero", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete"];
const enLetras = (numero) => EN_LETRAS[numero] ?? String(numero);
const conMayuscula = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

/** @returns {string} `uno` si la cantidad es 1; si no, `varios`. */
export const plural = (cantidad, uno, varios) => (cantidad === 1 ? uno : varios);

const formatoDeLista = new Intl.ListFormat("es", { style: "long", type: "conjunction" });
const formatoDeFecha = new Intl.DateTimeFormat("es", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

function partesDeFecha(dia) {
  const partes = {};
  for (const { type, value } of formatoDeFecha.formatToParts(new Date(`${dia}T00:00:00Z`))) {
    partes[type] = value;
  }
  return partes;
}

/** "Viernes 13 de noviembre" */
export function fechaLarga(dia) {
  const { weekday, day, month } = partesDeFecha(dia);
  return `${conMayuscula(weekday)} ${day} de ${month}`;
}

/** "13 de noviembre" */
function fechaCorta(dia) {
  const { day, month } = partesDeFecha(dia);
  return `${day} de ${month}`;
}

/** El título de la tarjeta principal. */
export function saludoDeHoy(estado, nombre) {
  if (estado === "celebrando") return `¡Panal cerrado, ${nombre}!`;
  if (estado === "descansando") return `Buen descanso, ${nombre}`;
  return `¡Buen vuelo, ${nombre}!`;
}

/** Lo que dice Zum según su estado. */
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

export function textoDeRacha(racha) {
  if (racha.actual === 0) return "Tu racha empieza hoy";
  return `Racha de vuelo: ${racha.actual} ${plural(racha.actual, "día", "días")}`;
}

export function textoDeReservas(reservas) {
  if (reservas === 0) return "Sin reservas de miel";
  return `${reservas} ${plural(reservas, "reserva", "reservas")} de miel`;
}

/** "Recurrente · diaria", "Única · vence hoy", "Única · Proyecto final"… */
export function detalleDeActividad(fila) {
  if (fila.tipo === "recurrente") {
    const dias = fila.regla?.clase === "semanal" ? fila.regla.dias : null;
    if (!dias || dias.length === 7) return "Recurrente · diaria";
    return `Recurrente · ${formatoDeLista.format(dias.map((dia) => DIAS_DE_LA_SEMANA[dia]))}`;
  }
  if (fila.vencida) return `Única · vencía el ${fechaCorta(fila.vence)}`;
  if (fila.venceHoy) return "Única · vence hoy";
  if (fila.colmena) return `Única · ${fila.colmena}`;
  if (fila.vence) return `Única · vence el ${fechaCorta(fila.vence)}`;
  return "Única";
}

/** Descripción del panal de hoy para quien no lo ve. */
export function descripcionDelPanal(resumen) {
  const { llenas, meta, cerrado } = resumen;
  if (cerrado) return `Panal de hoy cerrado: ${llenas} de ${meta} celdas llenas`;
  const vacias = Math.max(0, meta - llenas);
  return (
    `Panal de hoy: ${llenas} ${plural(llenas, "celda llena", "celdas llenas")} ` +
    `y ${vacias} ${plural(vacias, "vacía", "vacías")}`
  );
}
