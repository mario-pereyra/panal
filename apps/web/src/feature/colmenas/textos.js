import { CUADROS_POR_COLMENA } from "@panal/motor";
import { cuenta, diasEntre, fechaCorta } from "../../lib/formato.js";
import { CELDA_LIBRE, ordinalDeCuadro, textoDeEntrega } from "../../nucleo/textos.js";

export const COLMENAS = "Colmenas";

export const COLMENA = "Colmena";

export const FUNDAR_UNA_COLMENA = "Fundar una colmena";

export const CARGANDO_COLMENAS = "Cargando tus colmenas";

export const ERROR_AL_CARGAR_COLMENAS = "No pudimos traer tus colmenas";

export const NINGUNA_EN_MARCHA = "Ninguna colmena en marcha. Funda otra cuando quieras.";

export const textoDeEnjambre = (integrantes) =>
  `Enjambre: ${integrantes.map((abeja) => abeja.nombre).join(", ")}.`;

export const descripcionDeTarjeta = (nombre, avance) => `Colmena ${nombre}: ${avance}.`;

export const EL_COLMENAR = "El colmenar";

export const NOTA_DEL_COLMENAR = "Las colmenas que tu enjambre llenó al cien por cien.";

export const CARGANDO_COLMENA = "Cargando la colmena";

export const COLMENA_AJENA = {
  titulo: "Esta colmena es de otro enjambre.",
  texto: "Solo sus integrantes pueden verla. Si te invitaron, abre el enlace de invitación.",
};

export const ERROR_AL_CARGAR_COLMENA = "No pudimos traer la colmena";

export const INVITAR_AL_ENJAMBRE = "Invitar al enjambre";

export const NUEVA_CELDA = "Nueva celda";

export const masAccionesDe = (nombre) => `Más acciones de ${nombre}`;

export const notaDeColmena = ({ entregaEl, hoy, descripcion }) =>
  [entregaEl && textoDeEntrega(entregaEl, hoy), descripcion].filter(Boolean).join(" · ") ||
  undefined;

export const LA_COLMENA = "La colmena";

export const COLMENA_CERRADA = "Colmena cerrada: queda para el recuerdo, en solo lectura.";

export const COLMENA_VACIA = "Esta colmena está vacía. Crea su primera celda.";

export const descripcionDeColmenaGrande = (resumen) =>
  `${resumen}. Cada celda llena lleva el color y la inicial de quien la completó.`;

export const EL_ENJAMBRE = "El enjambre";

export const TU = " (tú)";

export const FUNDADORA = "Fundadora";

/** "3 celdas · 2 por hacer" */
export const textoDeAporte = (abeja) =>
  cuenta(abeja.aportes, "celda", "celdas") +
  (abeja.pendientes > 0 ? ` · ${abeja.pendientes} por hacer` : "");

export const ENJAMBRE_DE_UNA =
  "Por ahora eres la única abeja. Invita a tu enjambre: el avance se reparte.";

export const CELDAS_DE_LA_COLMENA = "Celdas de la colmena";

export const MOSTRAR = "Mostrar";

export const PESTANAS_DE_COLMENA = [
  { valor: "pendientes", etiqueta: "Pendientes" },
  { valor: "mias", etiqueta: "Mías" },
  { valor: "libres", etiqueta: "Libres" },
  { valor: "llenas", etiqueta: "Llenas" },
];

export const VACIOS_DE_COLMENA = {
  pendientes: "No queda nada pendiente. ¡Qué enjambre!",
  mias: "No tienes celdas asignadas en esta colmena.",
  libres: "No hay celdas libres ahora.",
  llenas: "Todavía no hay celdas llenas. La primera está cerca.",
};

/** "Llenada por Sofía el 3 nov", "Asignada a ti · vence el 9 nov" */
export function detalleDeCelda({ llena, quien, asignada, mia, llenadaEl, vence }) {
  let detalle;
  if (llena)
    detalle = `Llenada por ${quien?.nombre ?? "una abeja que ya salió"} el ${fechaCorta(llenadaEl)}`;
  else if (asignada) detalle = mia ? "Asignada a ti" : `Asignada a ${asignada.nombre}`;
  else detalle = CELDA_LIBRE;
  return vence && !llena ? `${detalle} · vence el ${fechaCorta(vence)}` : detalle;
}

export const EDITAR = "Editar";

export const SALIR_DE_LA_COLMENA = "Salir de la colmena";

export const FUNDADORA_NO_SALE = "Para salir, primero pasa la fundación a otra abeja.";

export const RECUPERAR = "Recuperar";

export const PASAR_LA_FUNDACION = "Pasar la fundación";

export const TEXTO_DEL_TRASPASO =
  "Quien elijas administra la colmena desde ahora: la edita, la archiva y ordena el enjambre. Tú sigues dentro.";

export const A_QUIEN = "A quién";

export const quitarA = (nombre) => `Quitar a ${nombre}`;

export const QUITAR = "Quitar";

export const ARCHIVAR = "Archivar";

export const CANCELAR = "Cancelar";

export const CONFIRMACIONES = {
  salir: {
    titulo: (nombre) => `¿Salir de ${nombre}?`,
    texto:
      "Tus celdas llenas siguen contando para la colmena. Para volver necesitarás un enlace nuevo.",
    confirmar: "Salir",
  },
  quitar: {
    titulo: (nombre) => `¿Quitar a ${nombre}?`,
    texto:
      "Sus celdas llenas siguen contando y las pendientes quedan libres. Para volver necesitará un enlace nuevo.",
    confirmar: QUITAR,
  },
  archivar: {
    titulo: (nombre) => `¿Archivar ${nombre}?`,
    texto: "Dejará de aparecer en Colmenas para todo el enjambre. Lo ya llenado no se pierde.",
    confirmar: ARCHIVAR,
  },
};

export const saliste = (nombre) => `Saliste de ${nombre}.`;

export const quedoArchivada = (nombre) => `${nombre} quedó archivada.`;

export const volvio = (nombre) => `${nombre} volvió a Colmenas.`;

export const ahoraFunda = (nombre) => `${nombre} administra ahora la colmena.`;

export const yaNoEsta = (nombre) => `${nombre} ya no está en el enjambre.`;

export const ARCHIVADAS = "Archivadas";

export const NOTA_DE_ARCHIVADAS =
  "Fuera de la vista del enjambre. Quien la fundó puede recuperarla.";

export const FORMULARIO_DE_COLMENA = {
  fundar: {
    titulo: FUNDAR_UNA_COLMENA,
    descripcion: "Un proyecto con su enjambre: cada celda llena suma para todas las abejas.",
    enviar: "Fundar",
  },
  editar: { titulo: "Editar colmena", enviar: "Guardar" },
};

export const NOMBRE = "Nombre";

export const DESCRIPCION = "Descripción (opcional)";

export const FECHA_DE_ENTREGA = "Fecha de entrega (opcional)";

export const GUARDANDO = "Guardando…";

export const SIN_CONEXION_AL_FUNDAR = "Sin conexión: hace falta señal para guardar.";

export const CAMBIOS_GUARDADOS = "Cambios guardados";

export const fundaste = (nombre) => `Fundaste ${nombre}. Ahora invita a tu enjambre.`;

export const quienAbraElEnlace = (nombre) => `Quien abra este enlace podrá unirse a ${nombre}.`;

export const CREANDO_EL_ENLACE = "Creando el enlace…";

export const ENLACE_DE_INVITACION = "Enlace de invitación";

export const COPIAR = "Copiar";

export const COPIADO = "Copiado";

export const COMPARTIR = "Compartir";

export const tituloAlCompartir = (nombre) => `Únete a ${nombre ?? "mi colmena"} en Panal`;

export const ANULAR_Y_CREAR_OTRO = "Anular y crear otro";

export const YA_EN_EL_ENJAMBRE = "Ya en el enjambre";

export const desdeEl = (dia) => `desde el ${fechaCorta(dia)}`;

/** "Cuadro 3 de 5. Faltan 6 celdas para el cuarto." */
export function textoDeCuadro(avance) {
  if (avance.cerrada)
    return `Cuadro ${CUADROS_POR_COLMENA} de ${CUADROS_POR_COLMENA}. Colmena cerrada.`;
  if (avance.total === 0) return "Sin celdas todavía.";
  return `Cuadro ${avance.cuadro} de ${CUADROS_POR_COLMENA}. Faltan ${cuenta(avance.faltanParaElSiguiente, "celda", "celdas")} para el ${ordinalDeCuadro(avance.cuadro + 1)}.`;
}

export const rotuloDeCuadro = (numero) => `Cuadro ${numero}`;

/** "Vence en 7 días". `venceEl` es el día lógico en que vence. */
export function textoDeVencimiento(venceEl, hoy) {
  const dias = Math.max(0, diasEntre(hoy, venceEl));
  if (dias === 0) return "Vence hoy";
  return `Vence en ${cuenta(dias, "día", "días")}`;
}
