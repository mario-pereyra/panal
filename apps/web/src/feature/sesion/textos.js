import { mensajeGeneral } from "../../store/errores.js";

export const SALTAR_AL_FORMULARIO = "Saltar al formulario";

export const ABRIENDO_TU_PANAL = "Abriendo tu panal";

export const NOMBRE = "Nombre";

export const CORREO = "Correo";

export const CLAVE = "Contraseña";

export const PROMESA = "Cada cosa que haces llena una celda";

export const ENTRAR = "Entrar";

export const ENTRANDO = "Entrando…";

export const NO_TIENES_PANAL = "¿No tienes panal?";

export const CREA_EL_TUYO = "Crea el tuyo";

export const LO_QUE_SE_GANA = ["Llena celdas", "Cuida tu racha", "Suma a tu colmena"];

export const CREANDO_TU_PANAL = "Creando tu panal…";

export const teEsperaLaColmena = (nombre) => `Te espera la colmena ${nombre}.`;

export const CORREO_EN_USO = "Ese correo ya tiene un panal.";

export const ENTRA_CON_EL = "Entra con él";

/** "4:59" para la cuenta atrás de demasiados intentos. */
function esperaEnTexto(segundos) {
  const minutos = Math.floor(segundos / 60);
  const resto = String(segundos % 60).padStart(2, "0");
  return `${minutos}:${resto}`;
}

/** Tras demasiados intentos, la cuenta atrás; cuando termina, ya se puede volver a probar. */
export function mensajeAlEntrar(error, espera) {
  if (error?.codigo !== "demasiados_intentos") return mensajeGeneral(error);
  if (espera <= 0) return null;
  return `Demasiados intentos. Podrás volver a probar en ${esperaEnTexto(espera)}.`;
}

/**
 * Fuerza de una contraseña en tres celdas. Mide lo que más protege: el largo,
 * y luego que mezcle clases de caracteres.
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

export const SIN_CONEXION_AL_ENTRAR = "Sin conexión. Para entrar hace falta señal.";

export const SIN_CONEXION_AL_CREAR = "Sin conexión. Para crear tu panal hace falta señal.";

/** P14: sin conexión y sin nada guardado que mostrar, porque la primera carga necesita red. */
export const SIN_CONEXION_AL_ABRIR = {
  titulo: "Sin conexión",
  texto: "Panal necesita conexión la primera vez. Vuelve a intentarlo cuando tengas señal.",
};
