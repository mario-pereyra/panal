import { esDescanso, sumarDias } from "./dia.js";

/**
 * Racha de vuelo: días seguidos con al menos una celda llena.
 *
 * - Un día de descanso no rompe la racha ni la alarga.
 * - Hoy todavía no terminó: si aún no hay celdas, la racha sigue en pie desde ayer.
 *
 * Pendiente para el motor completo: gastar una reserva de miel cuando un día
 * programado queda en cero. Por ahora las reservas llegan ya contadas en los ajustes.
 *
 * @param {string[]} dias Días con al menos una celda llena.
 * @param {{ diaSinFlores?: number | null, invernada?: { desde: string, hasta: string } | null, reservas?: number, mejorRacha?: number }} ajustes
 * @param {string} hoy
 * @returns {{ actual: number, mejor: number, reservas: number, hoyCuenta: boolean }}
 */
export function rachaDe(dias, ajustes, hoy) {
  const activos = new Set(dias);
  const hoyCuenta = activos.has(hoy);
  let actual = 0;
  if (activos.size > 0) {
    const primero = dias.reduce((menor, dia) => (dia < menor ? dia : menor));
    let dia = hoyCuenta ? hoy : sumarDias(hoy, -1);
    while (dia >= primero) {
      if (activos.has(dia)) actual += 1;
      else if (!esDescanso(ajustes, dia)) break;
      dia = sumarDias(dia, -1);
    }
  }
  return {
    actual,
    mejor: Math.max(ajustes.mejorRacha ?? 0, actual),
    reservas: ajustes.reservas ?? 0,
    hoyCuenta,
  };
}
