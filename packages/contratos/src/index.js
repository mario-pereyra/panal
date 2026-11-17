import { z } from "zod";

/**
 * Contratos de Panal: qué datos son válidos al cruzar la API.
 *
 * El servidor valida con estos esquemas todo lo que recibe y el navegador los
 * usa en sus formularios, así una regla vive en un solo lugar. La forma de las
 * respuestas está descrita en `respuestas.js`.
 */

export * from "./errores.js";

/** Un día de Panal: AAAA-MM-DD. */
export const dia = z.iso.date({ error: "Usa una fecha con el formato AAAA-MM-DD." });

export const identificador = z.uuid({ error: "El identificador no es válido." });

/** Metas diarias que se pueden elegir: el tamaño del panal. */
export const METAS_DIARIAS = [3, 5, 7];

/** Días máximos de una invernada. */
export const DIAS_DE_INVERNADA = 14;

export const correo = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: "Escribe un correo válido." }));

export const nombre = z
  .string()
  .trim()
  .min(1, { error: "Escribe tu nombre." })
  .max(40, { error: "El nombre puede tener hasta 40 letras." });

export const clave = z
  .string()
  .min(8, { error: "La contraseña necesita al menos 8 caracteres." })
  .max(200, { error: "La contraseña es demasiado larga." });

const metaDiaria = z
  .number()
  .int()
  .refine((valor) => METAS_DIARIAS.includes(valor), {
    error: "El panal puede ser de 3, 5 o 7 celdas.",
  });

const zonaHoraria = z.string().refine(
  (zona) => {
    try {
      new Intl.DateTimeFormat("es", { timeZone: zona });
      return true;
    } catch {
      return false;
    }
  },
  { error: "Esa zona horaria no existe." },
);

/** Día de la semana: 0 es lunes y 6, domingo, como en el motor. */
const diaDeLaSemana = z.number().int().min(0).max(6);

const invernada = z
  .object({ desde: dia, hasta: dia })
  .refine(({ desde, hasta }) => desde <= hasta, { error: "La invernada termina antes de empezar." })
  .refine(
    ({ desde, hasta }) => (Date.parse(hasta) - Date.parse(desde)) / 86_400_000 < DIAS_DE_INVERNADA,
    { error: `Una invernada dura como máximo ${DIAS_DE_INVERNADA} días.` },
  );

// Cuenta y sesión

/** La zona horaria es opcional: el navegador manda la del dispositivo y, sin ella, rige la de La Paz. */
export const nuevaCuenta = z.object({ nombre, correo, clave, zonaHoraria: zonaHoraria.optional() });

export const credenciales = z.object({
  correo,
  clave: z.string().min(1, { error: "Escribe tu contraseña." }),
});

export const cambiosDePerfil = z
  .object({
    nombre,
    metaDiaria,
    zonaHoraria,
    diaSinFlores: diaDeLaSemana.nullable(),
    invernada: invernada.nullable(),
  })
  .partial();

export const primerVuelo = z.object({ metaDiaria });

// Actividades y celdas

export const regla = z.discriminatedUnion("clase", [
  z.object({ clase: z.literal("diaria") }),
  z.object({
    clase: z.literal("dias"),
    dias: z
      .array(diaDeLaSemana)
      .min(1, { error: "Elige al menos un día." })
      .max(7)
      .transform((dias) => [...new Set(dias)].sort((a, b) => a - b)),
  }),
  z.object({ clase: z.literal("veces"), veces: z.number().int().min(1).max(6) }),
  z.object({ clase: z.literal("mes"), dia: z.number().int().min(1).max(31) }),
]);

export const titulo = z
  .string()
  .trim()
  .min(1, { error: "Escribe qué vas a hacer." })
  .max(80, { error: "El título puede tener hasta 80 letras." });

/** Solo el título: el primer paso del primer vuelo. */
export const soloTitulo = z.object({ titulo });

const camposDeActividad = {
  titulo,
  tipo: z.enum(["unica", "recurrente"]),
  prioridad: z.enum(["normal", "alta"]).default("normal"),
  regla: regla.nullable().default(null),
  vence: dia.nullable().default(null),
  colmenaId: identificador.nullable().default(null),
  asignadaA: identificador.nullable().default(null),
};

/** Una actividad nueva o reemplazada (`PUT /api/actividades/:id`). */
export const actividad = z.object(camposDeActividad).superRefine((datos, contexto) => {
  if (datos.tipo === "recurrente" && !datos.regla) {
    contexto.addIssue({ code: "custom", path: ["regla"], message: "Elige cada cuánto se repite." });
  }
  if (datos.tipo === "unica" && datos.regla) {
    contexto.addIssue({ code: "custom", path: ["regla"], message: "Una única no se repite." });
  }
  if (datos.tipo === "recurrente" && (datos.vence || datos.prioridad === "alta")) {
    contexto.addIssue({
      code: "custom",
      path: ["tipo"],
      message: "La fecha y la prioridad alta son solo para las únicas.",
    });
  }
  if (datos.tipo === "recurrente" && datos.colmenaId) {
    contexto.addIssue({
      code: "custom",
      path: ["colmenaId"],
      message: "Las celdas de una colmena son únicas: se cumplen una vez.",
    });
  }
  if (datos.asignadaA && !datos.colmenaId) {
    contexto.addIssue({
      code: "custom",
      path: ["asignadaA"],
      message: "Solo se asignan las celdas de una colmena.",
    });
  }
});

/** Editar, posponer, archivar o recuperar (`PATCH /api/actividades/:id`). */
export const cambiosDeActividad = z
  .object({
    titulo,
    prioridad: camposDeActividad.prioridad.unwrap(),
    regla,
    vence: dia.nullable(),
    colmenaId: identificador.nullable(),
    asignadaA: identificador.nullable(),
    archivada: z.boolean(),
  })
  .partial();

/** Llenar una celda (`PUT /api/celdas/:id`). El día lo pone el servidor. */
export const celdaNueva = z.object({ actividadId: identificador });

/** Qué lista de actividades se pide (`GET /api/actividades?ver=`). */
export const vistaDeActividades = z.enum(["activas", "archivadas"]).default("activas");

// Colmenas

export const nuevaColmena = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, { error: "Ponle nombre a la colmena." })
    .max(60, { error: "El nombre puede tener hasta 60 letras." }),
  descripcion: z
    .string()
    .trim()
    .max(280, { error: "La descripción puede tener hasta 280 letras." })
    .nullable()
    .default(null),
  entregaEl: dia.nullable().default(null),
});

export const cambiosDeColmena = z
  .object({
    nombre: nuevaColmena.shape.nombre,
    descripcion: nuevaColmena.shape.descripcion.unwrap(),
    entregaEl: dia.nullable(),
    archivada: z.boolean(),
  })
  .partial();

// Reportes

/** Días máximos de un reporte. */
export const DIAS_DE_REPORTE = 92;

export const periodoDeReporte = z
  .object({ desde: dia, hasta: dia })
  .refine(({ desde, hasta }) => desde <= hasta, { error: "El periodo termina antes de empezar." })
  .refine(
    ({ desde, hasta }) => (Date.parse(hasta) - Date.parse(desde)) / 86_400_000 < DIAS_DE_REPORTE,
    { error: `Un reporte abarca como máximo ${DIAS_DE_REPORTE} días.` },
  );

/**
 * Convierte los problemas de Zod en un objeto campo → mensaje, para mostrar
 * cada error junto a su campo.
 * @param {import("zod").ZodError} error
 * @returns {Record<string, string>}
 */
export function erroresPorCampo(error) {
  const campos = {};
  for (const problema of error.issues) {
    const campo = problema.path.join(".") || "formulario";
    if (!(campo in campos)) campos[campo] = problema.message;
  }
  return campos;
}
