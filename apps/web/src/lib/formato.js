/** Formato de cifras, fechas y listas en español. */

/** La inicial de cada día, de lunes a domingo: "X" es miércoles. */
export const INICIALES_DE_LA_SEMANA = ["L", "M", "X", "J", "V", "S", "D"];

const EN_LETRAS = ["cero", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete"];

/** Hasta siete, en letras; desde ocho, la cifra. */
export const enLetras = (numero) => EN_LETRAS[numero] ?? String(numero);

export const conMayuscula = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

export const plural = (cantidad, uno, varios) => (cantidad === 1 ? uno : varios);

/** "3 celdas", "1 celda". */
export const cuenta = (cantidad, uno, varios) => `${cantidad} ${plural(cantidad, uno, varios)}`;

export const porcentaje = (numero) => `${numero} %`;

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
