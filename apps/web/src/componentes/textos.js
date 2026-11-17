import { DIAS_DE_LA_SEMANA, sumarDias } from "@panal/motor";

/**
 * Textos que comparten varias pantallas: fechas, reglas de repetición y
 * plurales. Los de una sola pantalla viven en el `textos.js` de su funcionalidad.
 */

/** La inicial de cada día, de lunes a domingo: "X" es miércoles. */
export const INICIALES_DE_LA_SEMANA = ["L", "M", "X", "J", "V", "S", "D"];

/** "primer cuadro", "segundo cuadro"… hasta el quinto. */
export const ORDINALES = ["primer", "segundo", "tercer", "cuarto", "quinto"];

const EN_LETRAS = ["cero", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete"];

/** "dos", "cinco"… hasta siete; desde ocho, la cifra. */
export const enLetras = (numero) => EN_LETRAS[numero] ?? String(numero);

export const conMayuscula = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

/** @returns {string} `uno` si la cantidad es 1; si no, `varios`. */
export const plural = (cantidad, uno, varios) => (cantidad === 1 ? uno : varios);

/** "3 celdas", "1 celda". */
export const cuenta = (cantidad, uno, varios) => `${cantidad} ${plural(cantidad, uno, varios)}`;

const formatoDeLista = new Intl.ListFormat("es", { style: "long", type: "conjunction" });
export const enLista = (elementos) => formatoDeLista.format(elementos);

const formatoDeFecha = new Intl.DateTimeFormat("es", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
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
export function fechaCorta(dia) {
  const { day, month } = partesDeFecha(dia);
  return `${day} de ${month}`;
}

/** "lunes 16" */
export function diaConNombre(dia) {
  const { weekday, day } = partesDeFecha(dia);
  return `${weekday} ${day}`;
}

/** Días de `desde` a `hasta`, ambos AAAA-MM-DD. */
export const diasEntre = (desde, hasta) =>
  Math.round((Date.parse(`${hasta}T00:00:00Z`) - Date.parse(`${desde}T00:00:00Z`)) / 86_400_000);

/** "Mañana", "El lunes 16", "Hoy"… para agrupar lo próximo. */
export function cuandoEs(dia, hoy) {
  if (dia === hoy) return "Hoy";
  if (dia === sumarDias(hoy, 1)) return "Mañana";
  return conMayuscula(diaConNombre(dia));
}

/** "Faltan 9 días", "Se entrega hoy", "Se entregó hace 2 días". */
export function textoDeEntrega(entregaEl, hoy) {
  const faltan = diasEntre(hoy, entregaEl);
  if (faltan === 0) return "Se entrega hoy";
  if (faltan === 1) return "Se entrega mañana";
  if (faltan > 1) return `Faltan ${faltan} días`;
  return `Se entregó hace ${cuenta(-faltan, "día", "días")}`;
}

/** La regla de una recurrente en palabras: "diaria", "lunes y jueves", "3 veces por semana"… */
export function textoDeRegla(regla) {
  if (!regla) return "";
  switch (regla.clase) {
    case "diaria":
      return "diaria";
    case "dias":
      if (regla.dias.length === 7) return "diaria";
      return enLista(regla.dias.map((dia) => DIAS_DE_LA_SEMANA[dia]));
    case "veces":
      return `${cuenta(regla.veces, "vez", "veces")} por semana`;
    case "mes":
      return `el día ${regla.dia} de cada mes`;
    default:
      return "";
  }
}

/** "Recurrente · diaria", "Única · vence hoy", "Única · Proyecto final"… */
export function detalleDeActividad(actividad) {
  if (actividad.tipo === "recurrente") return `Recurrente · ${textoDeRegla(actividad.regla)}`;
  const partes = ["Única"];
  if (actividad.vencida) partes.push(`vencía el ${fechaCorta(actividad.vence)}`);
  else if (actividad.venceHoy) partes.push("vence hoy");
  else if (actividad.vence) partes.push(`vence el ${fechaCorta(actividad.vence)}`);
  if (actividad.colmena) partes.push(actividad.colmena);
  return partes.join(" · ");
}

/** "+25 gotas de miel" */
export const textoDeGotas = (gotas) => `+${gotas} ${plural(gotas, "gota", "gotas")} de miel`;

/** Color de una abeja de la colmena, según su lugar de llegada (0 a 5). */
export const colorDeAbeja = (indice) => `var(--abeja-${(indice % 6) + 1})`;

/** Lo que oye quien no ve a Zum: una por cada estado que decide el motor. */
export const DESCRIPCIONES_DE_ZUM = {
  esperando: "Zum, la abeja de Panal, te espera con una sonrisa",
  animando: "Zum, la abeja de Panal, señala la siguiente celda",
  feliz: "Zum, la abeja de Panal, vuela contenta",
  celebrando: "Zum, la abeja de Panal, celebra con los brazos en alto entre gotas de miel",
  preocupada: "Zum, la abeja de Panal, mira con ternura y un poco de preocupación",
  descansando: "Zum, la abeja de Panal, duerme tranquila",
};
