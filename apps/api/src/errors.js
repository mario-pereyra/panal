import { ERRORS, getFieldErrors, idSchema } from "@panal/contratos";

export class AppError extends Error {
  constructor(code, { message, fields, ...extra } = {}) {
    const entry = ERRORS[code] ?? ERRORS.internal_error;
    super(message ?? entry.message);
    this.code = ERRORS[code] ? code : "internal_error";
    this.status = entry.status;
    this.fields = fields;
    this.extra = extra;
  }

  get body() {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.fields ? { fields: this.fields } : {}),
        ...this.extra,
      },
    };
  }
}

export function throwError(code, details) {
  throw new AppError(code, details);
}

export function validate(schema, data, { field } = {}) {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  const fields = getFieldErrors(result.error);
  throw new AppError("invalid_data", {
    fields: field ? { [field]: Object.values(fields)[0] } : fields,
  });
}

export function validateUuid(value, { onInvalid = "not_found", field = "id" } = {}) {
  if (onInvalid === "invalid_data") {
    return validate(idSchema, value, { field });
  }
  const result = idSchema.safeParse(value);
  if (!result.success) throw new AppError(onInvalid);
  return result.data;
}

export async function readJsonBody(c, schema) {
  let data;
  try {
    data = await c.req.json();
  } catch {
    throw new AppError("invalid_data", {
      fields: { form: "Envía los datos en formato JSON." },
    });
  }
  return validate(schema, data);
}

export function errorHandler(error, c) {
  if (error instanceof AppError) {
    if (typeof error.extra.retryAfter === "number") {
      c.header("Retry-After", String(error.extra.retryAfter));
    }
    return c.json(error.body, error.status);
  }
  console.error(error);
  const fallback = new AppError("internal_error");
  return c.json(fallback.body, fallback.status);
}
