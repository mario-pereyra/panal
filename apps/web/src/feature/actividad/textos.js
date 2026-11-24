import { MAXIMO_DE_PRIORIDAD_ALTA } from "@panal/contratos";
import { DIAS_DE_LA_SEMANA } from "@panal/motor";
import { enLetras, INICIALES_DE_LA_SEMANA } from "../../lib/formato.js";
import { textoDeGotas, textoDeRegla } from "../../nucleo/textos.js";

export const TIPOS = [
  { valor: "unica", etiqueta: "Única", detalle: "Se cumple una vez" },
  { valor: "recurrente", etiqueta: "Recurrente", detalle: "Se repite" },
];

export const VECES_POR_SEMANA = "Veces por semana";

export const DIA_DEL_MES = "Día del mes";

export const CLASES = [
  { valor: "diaria", etiqueta: "Todos los días" },
  { valor: "dias", etiqueta: "Ciertos días" },
  { valor: "veces", etiqueta: VECES_POR_SEMANA },
  { valor: "mes", etiqueta: DIA_DEL_MES },
];

export const DIAS = DIAS_DE_LA_SEMANA.map((nombre, valor) => ({
  valor,
  etiqueta: INICIALES_DE_LA_SEMANA[valor],
  nombre,
}));

export function reglaEnPalabras(regla) {
  switch (regla.clase) {
    case "diaria":
      return "Se repite todos los días.";
    case "dias":
      if (regla.dias.length === 0) return "Elige al menos un día.";
      if (regla.dias.length === 7) return "Se repite todos los días.";
      return `Se repite cada semana: ${textoDeRegla(regla)}.`;
    case "veces":
      return `Se repite ${textoDeRegla(regla)}, los días que elijas.`;
    case "mes":
      return regla.dia > 28
        ? `Se repite ${textoDeRegla(regla)}; en los meses más cortos, el último día.`
        : `Se repite ${textoDeRegla(regla)}.`;
  }
}

export const textoDeVistaPrevia = (gotas) => `Esta celda vale ${textoDeGotas(gotas)}.`;

export const AYUDA_DE_ALTA = "Vale más gotas. Úsala para lo que de verdad importa.";

export const LIMITE_DE_ALTA = `Ya tienes ${enLetras(MAXIMO_DE_PRIORIDAD_ALTA)} celdas de prioridad alta. Termina una antes de marcar otra.`;

export const NOTA_DE_COLMENA = "Las celdas de una colmena son únicas: se cumplen una vez.";

export const SIN_CONEXION =
  "Sin conexión: lo escrito queda guardado aquí hasta que vuelva la señal.";

export const TITULO_AL_EDITAR = "Editar actividad";

export const BUSCANDO = "Buscando la celda…";

export const NO_EXISTE = "Esta celda no existe o ya no es tuya.";

export const AYUDA_DE_FECHA = "Si tiene fecha, aparece en Hoy desde ya y vence ese día.";

export const SIN_COLMENA = "Ninguna: es personal";

export const PREGUNTA_DE_DESCARTE = "Tienes cambios sin guardar. ¿Los descartas?";

export const GUARDAR = "Guardar";

export const GUARDANDO = "Guardando…";

export const CAMBIOS_GUARDADOS = "Cambios guardados";

export const CELDA_CREADA = "Celda creada: ya está en tu panal";

export const QUE_VAS_A_HACER = "¿Qué vas a hacer?";

export const TIPO = "Tipo";

export const FECHA = "Fecha (opcional)";

export const CADA_CUANTO = "¿Cada cuánto?";

export const LEYENDA_DE_DIAS = "Días de la semana";

export const COLMENA = "Colmena (opcional)";

export const ASIGNAR_A = "Asignar a";

export const DESCARTAR = "Descartar";

export const SEGUIR_EDITANDO = "Seguir editando";

export const ARCHIVAR = "Archivar";

export const CANCELAR = "Cancelar";
