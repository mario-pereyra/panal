import { DIAS_DE_LA_SEMANA, sumarDias } from "@panal/motor";
import {
  conMayuscula,
  cuenta,
  diaConNombre,
  diasEntre,
  enLista,
  fechaCorta,
  plural,
} from "../lib/formato.js";

/**
 * Textos de Panal que comparten varias pantallas. Los de una sola pantalla
 * viven en el `textos.js` de su funcionalidad; el formato genérico, en
 * `lib/formato.js`.
 */

const ORDINALES = ["primer", "segundo", "tercer", "cuarto", "quinto"];

/** "primer", "segundo"… para el cuadro número `cuadro` (de 1 a 5). */
export const ordinalDeCuadro = (cuadro) => ORDINALES[cuadro - 1];

/** "Mañana", "Ayer", "El lunes 16", "Hoy"… para agrupar por día. */
export function cuandoEs(dia, hoy) {
  if (dia === hoy) return "Hoy";
  if (dia === sumarDias(hoy, 1)) return "Mañana";
  if (dia === sumarDias(hoy, -1)) return "Ayer";
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

/** "diaria", "lunes y jueves", "3 veces por semana", "el día 10 de cada mes". */
export function textoDeRegla(regla) {
  switch (regla.clase) {
    case "diaria":
      return "diaria";
    case "dias":
      if (regla.dias.length === 7) return "diaria";
      return enLista([...regla.dias].sort((a, b) => a - b).map((dia) => DIAS_DE_LA_SEMANA[dia]));
    case "veces":
      return `${cuenta(regla.veces, "vez", "veces")} por semana`;
    case "mes":
      return `el día ${regla.dia} de cada mes`;
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

export const RACHA_DE_VUELO = "Racha de vuelo";

export const textoDeRachaDeVuelo = (dias) =>
  dias === 0 ? "Tu racha empieza hoy" : `${RACHA_DE_VUELO}: ${cuenta(dias, "día", "días")}`;

export function textoDeReservas(reservas) {
  if (reservas === 0) return "Sin reservas de miel";
  return `${cuenta(reservas, "reserva", "reservas")} de miel`;
}

/** "Nivel 4 · Exploradora" */
export const textoDeNivel = (oficio) => `Nivel ${oficio.nivel} · ${oficio.nombre}`;

/** "Faltan 60 gotas para Recolectora" */
export const faltanGotasPara = (faltan, oficio) =>
  `${faltan === 1 ? "Falta" : "Faltan"} ${cuenta(faltan, "gota", "gotas")} para ${oficio}`;

/** "18 de 30 celdas llenas entre 4 abejas" */
export const textoDeAvance = (avance, abejas) =>
  `${avance.llenas} de ${avance.total} celdas llenas entre ${cuenta(abejas, "abeja", "abejas")}`;

export const PANAL_POR_ESTRENAR = "Tu panal de hoy está por estrenar. Crea tu primera celda.";

export const SIN_COLMENAS = "Todavía no tienes colmena. Funda una e invita a tu enjambre.";

export const IR_A_HOY = "Ir a Hoy";

export const ENTRAR_AL_PANAL = "Entrar al panal";

export const CREAR_MI_PANAL = "Crear mi panal";

export const YA_TENGO_UN_PANAL = "Ya tengo un panal";

export const NUEVA_ACTIVIDAD = "Nueva actividad";

export const CELDA_LIBRE = "Libre: la llena quien llegue primero";

export const PANAL = "Panal";
