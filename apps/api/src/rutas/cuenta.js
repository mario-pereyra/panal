import { randomUUID } from "node:crypto";
import { credenciales, nuevaCuenta } from "@panal/contratos";
import { diaLogico } from "@panal/motor";
import { Hono } from "hono";
import { esDuplicado } from "../datos/base.js";
import { crearPersona, personaPorCorreo } from "../datos/personas.js";
import { falla, leerCuerpo } from "../errores.js";
import { CLAVE_DE_RELLENO, cifrarClave, claveCorrecta } from "../seguridad/claves.js";
import {
  abrirSesion,
  anotarEntradaFallida,
  cerrarSesion,
  exigirIntentosDisponibles,
  olvidarEntradasFallidas,
} from "../seguridad/sesion.js";
import { anotarAjustes } from "../servicios/ajustes.js";
import { iso, perfilDe } from "../servicios/formatos.js";

/**
 * Cuenta y sesión: registrarse, entrar y salir.
 * @param {import("../app.js").Contexto} contexto
 */
export function rutasDeCuenta({ base, reloj }) {
  const rutas = new Hono();

  rutas.post("/cuenta", async (c) => {
    const { nombre, correo, clave, zonaHoraria } = await leerCuerpo(c, nuevaCuenta);
    const ahora = reloj();
    const claveHash = await cifrarClave(clave);
    const persona = await base
      .transaccion(async (tx) => {
        const fila = await crearPersona(tx, {
          id: randomUUID(),
          nombre,
          correo,
          claveHash,
          creadaEn: iso(ahora),
          zonaHoraria,
        });
        await anotarAjustes(tx, fila, diaLogico(ahora, fila.zona_horaria));
        await abrirSesion(c, tx, fila.id, ahora);
        return fila;
      })
      .catch((error) => {
        throw esDuplicado(error, "personas_correo_key") ? falla("correo_en_uso") : error;
      });
    return c.json(perfilDe(persona, ahora), 201);
  });

  rutas.post("/sesion", async (c) => {
    const { correo, clave } = await leerCuerpo(c, credenciales);
    const ahora = reloj();
    await exigirIntentosDisponibles(base, correo, ahora);
    const persona = await personaPorCorreo(base, correo);
    // Sin cuenta también se compara una clave, para tardar lo mismo.
    const correcta = await claveCorrecta(clave, persona?.clave_hash ?? (await CLAVE_DE_RELLENO));
    if (!persona || !correcta) {
      await anotarEntradaFallida(base, correo, ahora);
      throw falla("credenciales_incorrectas");
    }
    await olvidarEntradasFallidas(base, correo);
    await abrirSesion(c, base, persona.id, ahora);
    return c.json(perfilDe(persona, ahora));
  });

  rutas.delete("/sesion", async (c) => {
    await cerrarSesion(c, base);
    return c.body(null, 204);
  });

  return rutas;
}
