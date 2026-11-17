import { cuenta, diaConNombre } from "../../componentes/textos.js";

/**
 * Textos de Reportes (P10).
 */

export const SIN_HISTORIAL =
  "Aquí aparecerá tu panal de constancia cuando llenes tu primera celda.";

const NOMBRE_DEL_PERIODO = {
  semana: "esta semana",
  mes: "los últimos 30 días",
  trimestre: "los últimos 90 días",
};
const PERIODO_ANTERIOR = {
  semana: "la semana pasada",
  mes: "los 30 días anteriores",
  trimestre: "los 90 días anteriores",
};

/** "Llenaste 18 celdas esta semana: 4 más que la semana pasada." */
export function fraseDeCeldasPorDia({ total, anterior, dias }, periodo) {
  const base = `Llenaste ${cuenta(total, "celda", "celdas")} ${NOMBRE_DEL_PERIODO[periodo]}`;
  const diferencia = total - anterior;
  let comparacion;
  if (anterior === 0 && total === 0) comparacion = "";
  else if (diferencia === 0) comparacion = `: las mismas que ${PERIODO_ANTERIOR[periodo]}`;
  else if (diferencia > 0) comparacion = `: ${diferencia} más que ${PERIODO_ANTERIOR[periodo]}`;
  else comparacion = `: ${-diferencia} menos que ${PERIODO_ANTERIOR[periodo]}. Cada celda cuenta`;
  const mejor = dias.reduce((max, dia) => (dia.llenas > (max?.llenas ?? 0) ? dia : max), null);
  const elMejor =
    mejor && periodo === "semana"
      ? ` Tu mejor día fue el ${diaConNombre(mejor.dia).toLowerCase()}.`
      : "";
  return `${base}${comparacion}.${elMejor}`;
}

/** "86 %", o una raya si en esos días no le tocaba ninguno: no es un cero. */
export const cumplimiento = (ronda) =>
  ronda.dias.some((dia) => dia.tocaba) ? `${ronda.porcentaje} %` : "–";

/** "Tus recurrentes de los últimos siete días: Leer 20 páginas, 86 %; …" */
export const fraseDeRondas = (rondas) =>
  rondas.length === 0
    ? "Todavía no tienes celdas recurrentes."
    : `Tus recurrentes en los últimos siete días: ${rondas
        .map((ronda) =>
          ronda.dias.some((dia) => dia.tocaba)
            ? `${ronda.titulo}, ${ronda.porcentaje} %`
            : `${ronda.titulo}, no tocaba`,
        )
        .join("; ")}.`;

export const fraseDeReparto = ([unicas, recurrentes]) =>
  unicas.cantidad + recurrentes.cantidad === 0
    ? "Sin celdas llenas en este periodo."
    : `${cuenta(unicas.cantidad, "única", "únicas")} y ${cuenta(recurrentes.cantidad, "recurrente", "recurrentes")} en este periodo.`;

export const fraseDeColmena = (colmena) =>
  colmena.total === 0
    ? `Nadie llenó celdas de ${colmena.nombre} en este periodo.`
    : `${colmena.nombre}: ${colmena.aportes.map((abeja) => `${abeja.nombre}, ${cuenta(abeja.celdas, "celda", "celdas")}`).join("; ")}.`;

export const fraseDeConstancia = (semanas) => {
  const dias = semanas.flat().filter((dia) => !dia.futuro);
  const conCeldas = dias.filter((dia) => dia.llenas > 0).length;
  const cerrados = dias.filter((dia) => dia.nivel === 3).length;
  return `En las últimas ${semanas.length} semanas llenaste celdas ${cuenta(conCeldas, "día", "días")} y cerraste tu panal ${cuenta(cerrados, "vez", "veces")}.`;
};
