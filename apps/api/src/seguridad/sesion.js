import { createHash, randomBytes } from "node:crypto";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import {
  anotarFallo,
  borrarSesion,
  crearSesion,
  fallosRecientes,
  olvidarFallos,
  personaDeSesion,
  renovarSesion,
} from "../datos/personas.js";
import { falla } from "../errores.js";
import { iso } from "../servicios/formatos.js";

/**
 * Sesiones con cookie: el navegador guarda un identificador aleatorio que el
 * JavaScript de la página no puede leer, y la base guarda solo su SHA-256. Si
 * alguien leyera la tabla `sesiones`, no podría hacerse pasar por nadie.
 */

export const COOKIE_DE_SESION = "panal_sesion";

const DIA_MS = 24 * 60 * 60 * 1000;

/** Una sesión dura 30 días desde su último uso. */
export const DURACION_DE_SESION_MS = 30 * DIA_MS;

/** Se renueva como mucho una vez al día, para no escribir en cada petición. */
const RENOVAR_SI_QUEDAN_MENOS_DE_MS = DURACION_DE_SESION_MS - DIA_MS;

/** @param {string} identificador */
export function hashDeSesion(identificador) {
  return createHash("sha256").update(identificador).digest("hex");
}

/**
 * @param {import("hono").Context} c
 * @param {string} identificador
 */
function ponerCookie(c, identificador) {
  setCookie(c, COOKIE_DE_SESION, identificador, {
    httpOnly: true,
    sameSite: "Lax",
    path: "/",
    maxAge: DURACION_DE_SESION_MS / 1000,
    secure: process.env.NODE_ENV === "production",
  });
}

/**
 * Crea una sesión para la persona y deja la cookie en la respuesta.
 * @param {import("hono").Context} c
 * @param {import("../datos/base.js").Consultor} db
 * @param {string} personaId
 * @param {number} ahora
 */
export async function abrirSesion(c, db, personaId, ahora) {
  const identificador = randomBytes(32).toString("base64url");
  await crearSesion(db, {
    idHash: hashDeSesion(identificador),
    personaId,
    creadaEn: iso(ahora),
    venceEn: iso(ahora + DURACION_DE_SESION_MS),
  });
  ponerCookie(c, identificador);
}

/**
 * Borra la sesión de la base y la cookie del navegador.
 * @param {import("hono").Context} c
 * @param {import("../datos/base.js").Consultor} db
 */
export async function cerrarSesion(c, db) {
  const identificador = getCookie(c, COOKIE_DE_SESION);
  if (identificador) await borrarSesion(db, hashDeSesion(identificador));
  deleteCookie(c, COOKIE_DE_SESION, {
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });
}

/**
 * Middleware: si la cookie corresponde a una sesión vigente, deja a la persona
 * en `c.get("persona")`; si no, deja `null`. Renueva la sesión con el uso.
 * @param {{ base: import("../datos/base.js").Base, reloj: () => number }} contexto
 * @returns {import("hono").MiddlewareHandler}
 */
export function cargarSesion({ base, reloj }) {
  return async (c, next) => {
    const identificador = getCookie(c, COOKIE_DE_SESION);
    let persona = null;
    if (identificador && identificador.length <= 128) {
      const ahora = reloj();
      const idHash = hashDeSesion(identificador);
      const fila = await personaDeSesion(base, idHash, iso(ahora));
      if (fila) {
        const { sesion_vence_en: venceEn, ...datos } = fila;
        persona = datos;
        if (Number(venceEn) - ahora < RENOVAR_SI_QUEDAN_MENOS_DE_MS) {
          await renovarSesion(base, idHash, iso(ahora + DURACION_DE_SESION_MS));
          ponerCookie(c, identificador);
        }
      }
    }
    c.set("persona", persona);
    await next();
  };
}

/**
 * Middleware para las rutas que piden sesión.
 * @type {import("hono").MiddlewareHandler}
 */
export async function exigirSesion(c, next) {
  if (!c.get("persona")) throw falla("sin_sesion");
  await next();
}

/**
 * La persona de la sesión. Solo en rutas protegidas con `exigirSesion`.
 * @param {import("hono").Context} c
 * @returns {import("../datos/personas.js").FilaDePersona}
 */
export function personaDe(c) {
  return c.get("persona");
}

// Límite de intentos de entrada

/** Fallos por correo que se toleran dentro de la ventana. */
export const FALLOS_PERMITIDOS = 5;

/** La ventana en la que se cuentan los fallos. */
export const VENTANA_DE_FALLOS_MS = 10 * 60 * 1000;

/**
 * Lanza `demasiados_intentos` si el correo ya acumuló cinco fallos en los
 * últimos diez minutos, con los segundos que faltan para volver a probar.
 * @param {import("../datos/base.js").Consultor} db
 * @param {string} correo
 * @param {number} ahora
 */
export async function exigirIntentosDisponibles(db, correo, ahora) {
  const fallos = await fallosRecientes(
    db,
    correo,
    iso(ahora - VENTANA_DE_FALLOS_MS),
    FALLOS_PERMITIDOS,
  );
  if (fallos.length < FALLOS_PERMITIDOS) return;
  // Cuando caduque el más viejo de los cinco, vuelve a haber un intento.
  const masViejo = Number(fallos[fallos.length - 1]);
  const reintentarEn = Math.max(1, Math.ceil((masViejo + VENTANA_DE_FALLOS_MS - ahora) / 1000));
  throw falla("demasiados_intentos", { reintentarEn });
}

/**
 * @param {import("../datos/base.js").Consultor} db
 * @param {string} correo
 * @param {number} ahora
 */
export async function anotarEntradaFallida(db, correo, ahora) {
  await anotarFallo(db, correo, iso(ahora), iso(ahora - VENTANA_DE_FALLOS_MS));
}

/**
 * @param {import("../datos/base.js").Consultor} db
 * @param {string} correo
 */
export async function olvidarEntradasFallidas(db, correo) {
  await olvidarFallos(db, correo);
}
