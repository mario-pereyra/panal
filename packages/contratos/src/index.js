import { z } from "zod";

export * from "./errors.js";
export * from "./permissions.js";

export const dateSchema = z.iso.date({ error: "Usa una fecha con el formato AAAA-MM-DD." });

export const idSchema = z.uuid({ error: "El identificador no es válido." });

export const DAILY_GOALS = [3, 5, 7];

export const MAX_PAUSE_DAYS = 14;

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: "Escribe un correo válido." }));

export const nameSchema = z
  .string()
  .trim()
  .min(1, { error: "Escribe tu nombre." })
  .max(40, { error: "El nombre puede tener hasta 40 letras." });

export const passwordSchema = z
  .string()
  .min(8, { error: "La contraseña necesita al menos 8 caracteres." })
  .max(200, { error: "La contraseña es demasiado larga." });

const dailyGoal = z
  .number()
  .int()
  .refine((value) => DAILY_GOALS.includes(value), {
    error: "El panal puede ser de 3, 5 o 7 celdas.",
  });

const timeZone = z.string().refine(
  (zone) => {
    try {
      new Intl.DateTimeFormat("es", { timeZone: zone });
      return true;
    } catch {
      return false;
    }
  },
  { error: "Esa zona horaria no existe." },
);

export const MAX_TIMES_PER_WEEK = 6;

export const LAST_DAY_OF_MONTH = 31;

const weekday = z.number().int().min(0).max(6);

const pausePeriod = z
  .object({ from: dateSchema, to: dateSchema })
  .refine(({ from, to }) => from <= to, { error: "La invernada termina antes de empezar." })
  .refine(({ from, to }) => (Date.parse(to) - Date.parse(from)) / 86_400_000 < MAX_PAUSE_DAYS, {
    error: `Una invernada dura como máximo ${MAX_PAUSE_DAYS} días.`,
  });

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  timeZone: timeZone.optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { error: "Escribe tu contraseña." }),
});

export const profileUpdateSchema = z
  .object({
    name: nameSchema,
    dailyGoal,
    timeZone,
    restDay: weekday.nullable(),
    pausePeriod: pausePeriod.nullable(),
  })
  .partial();

export const onboardingGoalSchema = z.object({ dailyGoal });

export const ruleSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("diaria") }),
  z.object({
    kind: z.literal("dias"),
    days: z
      .array(weekday)
      .min(1, { error: "Elige al menos un día." })
      .max(7)
      .transform((days) => [...new Set(days)].sort((a, b) => a - b)),
  }),
  z.object({
    kind: z.literal("veces"),
    count: z.number().int().min(1).max(MAX_TIMES_PER_WEEK),
  }),
  z.object({ kind: z.literal("mes"), day: z.number().int().min(1).max(LAST_DAY_OF_MONTH) }),
]);

export const titleSchema = z
  .string()
  .trim()
  .min(1, { error: "Escribe qué vas a hacer." })
  .max(80, { error: "El título puede tener hasta 80 letras." });

export const titleOnlySchema = z.object({ title: titleSchema });

const activityFields = {
  title: titleSchema,
  type: z.enum(["unica", "recurrente"]),
  priority: z.enum(["normal", "high"]).default("normal"),
  rule: ruleSchema.nullable().default(null),
  dueDate: dateSchema.nullable().default(null),
  hiveId: idSchema.nullable().default(null),
  assigneeId: idSchema.nullable().default(null),
};

export const activitySchema = z.object(activityFields).superRefine((data, ctx) => {
  if (data.type === "recurrente" && !data.rule) {
    ctx.addIssue({ code: "custom", path: ["rule"], message: "Elige cada cuánto se repite." });
  }
  if (data.type === "unica" && data.rule) {
    ctx.addIssue({ code: "custom", path: ["rule"], message: "Una única no se repite." });
  }
  if (data.type === "recurrente" && (data.dueDate || data.priority === "high")) {
    ctx.addIssue({
      code: "custom",
      path: ["type"],
      message: "La fecha y la prioridad alta son solo para las únicas.",
    });
  }
  if (data.type === "recurrente" && data.hiveId) {
    ctx.addIssue({
      code: "custom",
      path: ["hiveId"],
      message: "Las celdas de una colmena son únicas: se cumplen una vez.",
    });
  }
  if (data.assigneeId && !data.hiveId) {
    ctx.addIssue({
      code: "custom",
      path: ["assigneeId"],
      message: "Solo se asignan las celdas de una colmena.",
    });
  }
});

export const activityUpdateSchema = z
  .object({
    title: titleSchema,
    priority: activityFields.priority.unwrap(),
    rule: ruleSchema,
    dueDate: dateSchema.nullable(),
    hiveId: idSchema.nullable(),
    assigneeId: idSchema.nullable(),
    archived: z.boolean(),
  })
  .partial();

export const fillCellSchema = z.object({ activityId: idSchema });

export const activityViewSchema = z.enum(["active", "done", "archived"]).default("active");

export const RECENT_DONE_DAYS = 7;

export const createHiveSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Ponle nombre a la colmena." })
    .max(60, { error: "El nombre puede tener hasta 60 letras." }),
  description: z
    .string()
    .trim()
    .max(280, { error: "La descripción puede tener hasta 280 letras." })
    .nullable()
    .default(null),
  dueDate: dateSchema.nullable().default(null),
});

export const hiveUpdateSchema = z
  .object({
    name: createHiveSchema.shape.name,
    description: createHiveSchema.shape.description.unwrap(),
    dueDate: dateSchema.nullable(),
    archived: z.boolean(),
    ownerId: idSchema,
  })
  .partial();

export const MAX_REPORT_DAYS = 92;

export const reportPeriodSchema = z
  .object({ from: dateSchema, to: dateSchema })
  .refine(({ from, to }) => from <= to, { error: "El periodo termina antes de empezar." })
  .refine(({ from, to }) => (Date.parse(to) - Date.parse(from)) / 86_400_000 < MAX_REPORT_DAYS, {
    error: `Un reporte abarca como máximo ${MAX_REPORT_DAYS} días.`,
  });

export function getFieldErrors(error) {
  const fields = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!(key in fields)) fields[key] = issue.message;
  }
  return fields;
}
