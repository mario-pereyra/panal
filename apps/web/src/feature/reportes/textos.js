import { cuenta, diaConNombre, porcentaje } from "../../lib/formato.js";

export const REPORTES = "Reportes";

export const CARGANDO_TUS_REPORTES = "Cargando tus reportes";

export const MEJOR_RACHA = "Mejor racha";

export const enDias = (dias) => cuenta(dias, "día", "días");

export const PANAL_DE_CONSTANCIA = "Panal de constancia";

export const TABLA_DE_CONSTANCIA = "Celdas llenas por día en las últimas semanas";

export const COLUMNAS_POR_DIA = ["Día", "Celdas llenas"];

export const CELDAS_POR_DIA = "Celdas por día";

export const PERIODO = "Periodo";

export const TABLA_DE_CELDAS_POR_DIA = "Celdas llenas por día";

export const TUS_RECURRENTES = "Tus recurrentes";

export const TABLA_DE_RONDAS = "Cumplimiento de tus recurrentes en los últimos siete días";

export const columnasDeRondas = (dias) => ["Celda", ...dias, "Cumplimiento"];

export const UNICAS_Y_RECURRENTES = "Únicas y recurrentes";

export const TIPOS = { unicas: "Únicas", recurrentes: "Recurrentes" };

export const TABLA_DE_REPARTO = "Celdas llenas por tipo";

export const COLUMNAS_DE_REPARTO = ["Tipo", "Celdas llenas"];

export const TUS_COLMENAS = "Tus colmenas";

export const PERIODOS = [
  { valor: "semana", etiqueta: "Esta semana" },
  { valor: "mes", etiqueta: "30 días" },
  { valor: "trimestre", etiqueta: "90 días" },
];

export const CELDAS_DEL_PERIODO = {
  semana: "Celdas de la semana",
  mes: "Celdas del periodo",
  trimestre: "Celdas del periodo",
};

export const SIN_HISTORIAL =
  "Aquí aparecerá tu panal de constancia cuando llenes tu primera celda.";

export const ERROR_AL_CARGAR = "No pudimos traer tus reportes";

export const FRASE_DE_RECURRENTES =
  "Los últimos siete días: llena si la cumpliste, punteada si no tocaba.";

export const SIN_RONDAS = "Todavía no tienes celdas recurrentes.";

export const ESTADO_DEL_DIA = { llena: "Llena", pendiente: "Pendiente", noTocaba: "No tocaba" };

export const FRASE_DE_COLMENAS = "Lo que aportó cada abeja en este periodo.";

export const FRASE_DE_ZUM = "Mirar atrás también es avanzar: aquí se ve cada gota que juntaste.";

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

/** Una raya si en esos días no le tocaba ninguno: no es un cero. */
export const cumplimiento = (ronda) => (ronda.tocabaAlgunDia ? porcentaje(ronda.porcentaje) : "–");

/** "Tus recurrentes en los últimos siete días: Leer 20 páginas, 86 %; …" */
export const fraseDeRondas = (rondas) =>
  `Tus recurrentes en los últimos siete días: ${rondas
    .map((ronda) =>
      ronda.tocabaAlgunDia
        ? `${ronda.titulo}, ${porcentaje(ronda.porcentaje)}`
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

export const fraseDeConstancia = ({ semanas, conCeldas, cerrados }) =>
  `En las últimas ${semanas.length} semanas llenaste celdas ${cuenta(conCeldas, "día", "días")} y cerraste tu panal ${cuenta(cerrados, "vez", "veces")}.`;

export const VER_COMO_TABLA = "Ver como tabla";
