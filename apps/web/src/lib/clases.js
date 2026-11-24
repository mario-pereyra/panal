/** Une los nombres de clase que tienen valor: `clases(estilos.a, activa && estilos.b)`. */
export const clases = (...nombres) => nombres.filter(Boolean).join(" ");
