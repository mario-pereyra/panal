import { getFieldErrors } from "@panal/contratos";
import { useCallback, useRef, useState } from "react";
import { announce } from "../../lib/a11y.js";

function areValuesEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, index) => Object.is(item, b[index]));
  }
  return false;
}

export function useForm({
  initialValues = {},
  schema,
  transform = (values) => values,
  onSubmit,
} = {}) {
  const [baseline, setBaseline] = useState(initialValues);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const touchedRef = useRef(new Set());

  const validateValues = useCallback(
    (candidateValues) => {
      if (!schema) return { data: transform(candidateValues), errors: {} };
      const result = schema.safeParse(transform(candidateValues));
      return result.success
        ? { data: result.data, errors: {} }
        : { data: null, errors: getFieldErrors(result.error) };
    },
    [schema, transform],
  );

  const pruneResolvedErrors = useCallback(
    (nextValues) => {
      setErrors((prevErrors) => {
        const keys = Object.keys(prevErrors);
        if (keys.length === 0) return prevErrors;
        const currentErrors = validateValues(nextValues).errors;
        const nextErrors = {};
        for (const key of keys) {
          if (key in currentErrors) nextErrors[key] = currentErrors[key];
        }
        return nextErrors;
      });
    },
    [validateValues],
  );

  const setFieldValue = useCallback(
    (name, valueOrEvent) => {
      const extracted =
        valueOrEvent && typeof valueOrEvent === "object" && "target" in valueOrEvent
          ? valueOrEvent.target.value
          : valueOrEvent;
      setValues((prev) => {
        const nextValue = typeof extracted === "function" ? extracted(prev[name]) : extracted;
        const nextValues = { ...prev, [name]: nextValue };
        pruneResolvedErrors(nextValues);
        return nextValues;
      });
    },
    [pruneResolvedErrors],
  );

  const setFields = useCallback(
    (updates) => {
      setValues((prev) => {
        const patch = typeof updates === "function" ? updates(prev) : updates;
        const nextValues = { ...prev, ...patch };
        pruneResolvedErrors(nextValues);
        return nextValues;
      });
    },
    [pruneResolvedErrors],
  );

  const validateSingleField = useCallback(
    (fieldName, event = null) => {
      if (!fieldName) return;
      if (
        !touchedRef.current.has(fieldName) &&
        areValuesEqual(values[fieldName], baseline[fieldName])
      ) {
        return;
      }
      touchedRef.current.add(fieldName);
      setTouched((prev) => (prev[fieldName] ? prev : { ...prev, [fieldName]: true }));
      const fieldError = validateValues(values).errors[fieldName];
      setErrors((prev) => {
        if (prev[fieldName] === fieldError) return prev;
        const next = { ...prev };
        if (fieldError) next[fieldName] = fieldError;
        else delete next[fieldName];
        return next;
      });
      if (fieldError && !errors[fieldName]) {
        const label = event?.target?.labels?.[0]?.textContent ?? "";
        announce(label ? `${label}: ${fieldError}` : fieldError, { delay: 500 });
      }
    },
    [baseline, errors, validateValues, values],
  );

  const handleBlur = useCallback(
    (eventOrName) => {
      if (typeof eventOrName === "string") {
        validateSingleField(eventOrName);
        return (event) => validateSingleField(eventOrName, event);
      }
      const fieldName = eventOrName?.target?.name;
      validateSingleField(fieldName, eventOrName);
    },
    [validateSingleField],
  );

  const setServerErrors = useCallback((fieldErrors = {}) => {
    if (!fieldErrors || Object.keys(fieldErrors).length === 0) return;
    setErrors(fieldErrors);
  }, []);

  const resetForm = useCallback(
    (nextInitial = baseline) => {
      touchedRef.current.clear();
      setBaseline(nextInitial);
      setValues(nextInitial);
      setErrors({});
      setTouched({});
    },
    [baseline],
  );

  const executeSubmit = async (event, submitHandler = onSubmit) => {
    event?.preventDefault?.();
    const { data, errors: nextErrors } = validateValues(values);
    setErrors(nextErrors);
    if (!data) {
      const errorTouched = Object.fromEntries(Object.keys(nextErrors).map((key) => [key, true]));
      setTouched((prev) => ({ ...prev, ...errorTouched }));
      return false;
    }
    if (!submitHandler) return true;
    setIsSubmitting(true);
    try {
      await submitHandler(data, values);
      return true;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (eventOrCallback) => {
    if (typeof eventOrCallback === "function") {
      return (event) => executeSubmit(event, eventOrCallback);
    }
    return executeSubmit(eventOrCallback, onSubmit);
  };

  const allKeys = new Set([...Object.keys(baseline ?? {}), ...Object.keys(values ?? {})]);
  const isDirty = [...allKeys].some((key) => !areValuesEqual(baseline?.[key], values?.[key]));

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    setFieldValue,
    setFields,
    handleBlur,
    handleSubmit,
    setServerErrors,
    resetForm,
  };
}
