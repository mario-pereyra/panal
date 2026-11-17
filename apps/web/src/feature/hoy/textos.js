import { conMayuscula, cuenta, enLetras, plural } from "../../componentes/textos.js";

/**
 * Los textos de "Hoy". La voz de Panal: cercana, breve y sin culpa.
 * Fuente: docs/propuestas/A-panal/estrategia-gamificacion.md.
 */

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
  return `Racha de vuelo: ${cuenta(racha.actual, "día", "días")}`;
}

export function textoDeReservas(reservas) {
  if (reservas === 0) return "Sin reservas de miel";
  return `${cuenta(reservas, "reserva", "reservas")} de miel`;
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

/** Las franjas que aparecen sobre la tarjeta principal, sin culpa. */
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
