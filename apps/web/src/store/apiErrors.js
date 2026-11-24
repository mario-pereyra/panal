import { ERRORS } from "@panal/contratos/errors";

const OFFLINE_ERROR = {
  code: "offline",
  message: "No hay conexión. Lo que escribiste sigue aquí; vuelve a intentarlo con señal.",
  fields: {},
  retryAfter: undefined,
};

export function parseApiError(error) {
  if (!error) return null;
  if (error.code && error.message && "fields" in error) return error;
  const { status, data } = error;
  if (status === "FETCH_ERROR" || status === "TIMEOUT_ERROR") return OFFLINE_ERROR;
  const serverError = data?.error;
  if (serverError?.code) {
    return {
      code: serverError.code,
      message:
        serverError.message ?? ERRORS[serverError.code]?.message ?? ERRORS.internal_error.message,
      fields: serverError.fields ?? {},
      retryAfter: serverError.retryAfter,
    };
  }
  return {
    code: "internal_error",
    message: ERRORS.internal_error.message,
    fields: {},
    retryAfter: undefined,
  };
}

export function getGeneralErrorMessage(error) {
  if (!error) return null;
  const parsed = parseApiError(error);
  return parsed && parsed.code !== "invalid_data" ? parsed.message : null;
}
