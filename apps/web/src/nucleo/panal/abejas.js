/** Hay seis colores de abeja en `tokens.css` (`--abeja-1` a `--abeja-6`); la séptima repite el primero. */
export const colorDeAbeja = (lugar) => `var(--abeja-${(lugar % 6) + 1})`;

// Una celda que llenó una abeja que ya salió de la colmena.
export const COLOR_DE_QUIEN_SALIO = "var(--lino-borde)";

export const inicialDe = (nombre) => nombre.charAt(0).toUpperCase();

/** Una abeja como llega de la API, con su color ya resuelto y su inicial. */
export const pintarAbeja = (abeja) => ({
  ...abeja,
  color: colorDeAbeja(abeja.color),
  inicial: inicialDe(abeja.nombre),
});

/** Las abejas con su color e inicial, y cada celda con el color de quien la llenó. */
export function pintarColmena(colmena) {
  const integrantes = colmena.integrantes.map(pintarAbeja);
  const colorDe = new Map(integrantes.map((abeja) => [abeja.id, abeja.color]));
  const celdas = colmena.celdas.map((celda) => ({
    id: celda.actividadId,
    color: celda.llenaPor ? (colorDe.get(celda.llenaPor) ?? COLOR_DE_QUIEN_SALIO) : null,
  }));
  return { integrantes, celdas };
}
