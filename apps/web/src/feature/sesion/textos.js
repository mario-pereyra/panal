/**
 * Textos de "Entrar al panal" y "Crear mi panal" (P01, P02).
 */

export const PROMESA = "Cada cosa que haces llena una celda";

export const LO_QUE_SE_GANA = ["Llena celdas", "Cuida tu racha", "Suma a tu colmena"];

/** "4:59" para la cuenta atrás de demasiados intentos. */
export function esperaEnTexto(segundos) {
  const minutos = Math.floor(segundos / 60);
  const resto = String(segundos % 60).padStart(2, "0");
  return `${minutos}:${resto}`;
}

/**
 * Fuerza de una contraseña en tres celdas. Mide lo que más protege: el largo,
 * y luego que mezcle clases de caracteres.
 * @param {string} clave
 * @returns {{ celdas: 0 | 1 | 2 | 3, texto: string }}
 */
export function fuerzaDeClave(clave) {
  if (!clave) return { celdas: 0, texto: "Al menos 8 caracteres" };
  if (clave.length < 8) return { celdas: 1, texto: "Todavía corta: al menos 8 caracteres" };
  const clases = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((clase) =>
    clase.test(clave),
  ).length;
  if (clave.length >= 12 && clases >= 2) return { celdas: 3, texto: "Fuerte" };
  return { celdas: 2, texto: "Aceptable. Más larga, más segura" };
}
