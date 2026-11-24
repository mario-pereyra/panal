import { loginSchema, registerSchema } from "@panal/contratos";
import { useEffect, useState } from "react";
import { useForm } from "../../components/ui/useForm.js";
import { usePendingInvite } from "../../core/auth/useAuth.js";
import { useIsOnline } from "../../core/connection/useConnection.js";
import { getDeviceTimeZone } from "../../lib/device.js";
import { useGetInvitationQuery, useLoginMutation, useRegisterMutation } from "../../store/api.js";
import { getGeneralErrorMessage, parseApiError } from "../../store/apiErrors.js";

function formatCountdown(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function getLoginErrorMessage(rawError, waitSeconds) {
  if (!rawError) return null;
  const parsed = parseApiError(rawError);
  if (parsed?.code !== "too_many_attempts") return getGeneralErrorMessage(rawError);
  if (waitSeconds <= 0) return null;
  return `Demasiados intentos. Podrás volver a probar en ${formatCountdown(waitSeconds)}.`;
}

export function getPasswordStrength(password) {
  if (!password) return { cells: 0, label: "Al menos 8 caracteres" };
  if (password.length < 8) return { cells: 1, label: "Todavía corta: al menos 8 caracteres" };
  const classesCount = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((pattern) =>
    pattern.test(password),
  ).length;
  if (password.length >= 12 && classesCount >= 2) return { cells: 3, label: "Fuerte" };
  return { cells: 2, label: "Aceptable. Más larga, más segura" };
}

function useCountdown(initialSeconds) {
  const [remaining, setRemaining] = useState(initialSeconds);
  useEffect(() => {
    setRemaining(initialSeconds);
    if (initialSeconds <= 0) return undefined;
    const timer = setInterval(() => setRemaining((previous) => Math.max(0, previous - 1)), 1000);
    return () => clearInterval(timer);
  }, [initialSeconds]);
  return remaining;
}

export function useLoginForm() {
  const [login, loginState] = useLoginMutation();
  const isOnline = useIsOnline();
  const parsedError = loginState.error ? parseApiError(loginState.error) : null;
  const waitSeconds = useCountdown(parsedError?.retryAfter ?? 0);

  const form = useForm({
    initialValues: { email: "", password: "" },
    schema: loginSchema,
    onSubmit: async (data) => {
      const result = await login(data);
      if (result.error) {
        form.setServerErrors(parseApiError(result.error).fields ?? {});
      }
    },
  });

  return {
    form,
    isSubmitting: loginState.isLoading || form.isSubmitting,
    errorMessage: getLoginErrorMessage(loginState.error, waitSeconds),
    waitSeconds,
    isOnline,
  };
}

export function useRegisterForm() {
  const [register, registerState] = useRegisterMutation();
  const isOnline = useIsOnline();
  const { pendingInvite } = usePendingInvite();
  const { data: invitationData } = useGetInvitationQuery(pendingInvite, {
    skip: !pendingInvite,
  });
  const timeZone = getDeviceTimeZone();
  const parsedError = registerState.error ? parseApiError(registerState.error) : null;

  const form = useForm({
    initialValues: { name: "", email: "", password: "" },
    schema: registerSchema,
    onSubmit: async (data) => {
      const result = await register({ ...data, timeZone });
      if (result.error) {
        form.setServerErrors(parseApiError(result.error).fields ?? {});
      }
    },
  });

  return {
    form,
    strength: getPasswordStrength(form.values.password),
    isSubmitting: registerState.isLoading || form.isSubmitting,
    errorMessage: getGeneralErrorMessage(registerState.error),
    emailTaken: parsedError?.code === "email_taken",
    isOnline,
    invitation: invitationData?.invitation ?? invitationData ?? null,
  };
}
