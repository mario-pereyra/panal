import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

/**
 * Contraseñas con `scrypt`, que viene con Node. Cada clave lleva su propia sal
 * y los parámetros quedan guardados junto al resultado, así se pueden subir
 * más adelante sin invalidar las claves que ya existen.
 *
 * Formato: `scrypt$N$r$p$sal$resultado`, con la sal y el resultado en base64url.
 */

const PARAMETROS = { N: 2 ** 14, r: 8, p: 1 };
const LARGO = 64;

/**
 * @param {string} clave
 * @param {Buffer} sal
 * @param {{ N: number, r: number, p: number }} parametros
 * @returns {Promise<Buffer>}
 */
function derivar(clave, sal, parametros) {
  return new Promise((resolver, rechazar) => {
    scrypt(clave.normalize("NFC"), sal, LARGO, parametros, (error, resultado) =>
      error ? rechazar(error) : resolver(resultado),
    );
  });
}

/**
 * @param {string} clave
 * @returns {Promise<string>}
 */
export async function cifrarClave(clave) {
  const sal = randomBytes(16);
  const resultado = await derivar(clave, sal, PARAMETROS);
  const { N, r, p } = PARAMETROS;
  return ["scrypt", N, r, p, sal.toString("base64url"), resultado.toString("base64url")].join("$");
}

/**
 * Compara en tiempo constante, para no dar pistas por lo que tarda.
 * @param {string} clave
 * @param {string} guardada
 * @returns {Promise<boolean>}
 */
export async function claveCorrecta(clave, guardada) {
  const [algoritmo, N, r, p, sal, esperado] = guardada.split("$");
  if (algoritmo !== "scrypt" || !esperado) return false;
  const esperadoEnBytes = Buffer.from(esperado, "base64url");
  const resultado = await derivar(clave, Buffer.from(sal, "base64url"), {
    N: Number(N),
    r: Number(r),
    p: Number(p),
  });
  return resultado.length === esperadoEnBytes.length && timingSafeEqual(resultado, esperadoEnBytes);
}

/**
 * Una clave guardada que no corresponde a nadie. Se compara contra ella cuando
 * el correo no existe, para que la respuesta tarde lo mismo que con un correo real.
 */
export const CLAVE_DE_RELLENO = cifrarClave(randomBytes(12).toString("base64url"));
