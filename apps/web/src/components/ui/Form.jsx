import { useId, useState } from "react";
import { cn } from "../../lib/classNames.js";
import styles from "./Form.module.css";
import { EyeIcon } from "./icons.jsx";

function FieldShell({ label, error, hint, className, children }) {
  const inputId = useId();
  const hintId = useId();
  const errorId = useId();
  const describedBy = cn(hint && hintId, error && errorId) || undefined;

  return (
    <div className={cn(styles.field, className)} data-error={error ? "" : undefined}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      {children({
        inputId,
        describedBy,
        ariaInvalid: error ? "true" : "false",
      })}
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  hint,
  type = "text",
  accessory,
  className,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const effectiveType = isPassword && showPassword ? "text" : type;

  return (
    <FieldShell label={label} error={error} hint={hint} className={className}>
      {({ inputId, describedBy, ariaInvalid }) => (
        <div className={styles.box}>
          <input
            id={inputId}
            name={name}
            type={effectiveType}
            value={value ?? ""}
            onChange={onChange}
            onBlur={onBlur}
            className={styles.input}
            aria-invalid={ariaInvalid}
            aria-describedby={describedBy}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              className={styles.togglePassword}
              aria-pressed={showPassword}
              aria-label="Mostrar la contraseña"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <EyeIcon crossed={!showPassword} />
            </button>
          ) : (
            accessory
          )}
        </div>
      )}
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  hint,
  rows = 3,
  className,
  ...props
}) {
  return (
    <FieldShell label={label} error={error} hint={hint} className={className}>
      {({ inputId, describedBy, ariaInvalid }) => (
        <textarea
          id={inputId}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          rows={rows}
          className={cn(styles.input, styles.textarea)}
          aria-invalid={ariaInvalid}
          aria-describedby={describedBy}
          {...props}
        />
      )}
    </FieldShell>
  );
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  error,
  hint,
  className,
  ...props
}) {
  return (
    <FieldShell label={label} error={error} hint={hint} className={className}>
      {({ inputId, describedBy, ariaInvalid }) => (
        <select
          id={inputId}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          className={cn(styles.input, styles.select)}
          aria-invalid={ariaInvalid}
          aria-describedby={describedBy}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  );
}

export function RadioCardGroup({
  label,
  name,
  value,
  onChange,
  options = [],
  hideLabel = false,
  error,
  hint,
}) {
  const hintId = useId();
  const errorId = useId();
  const describedBy = cn(hint && hintId, error && errorId) || undefined;

  return (
    <fieldset
      className={styles.group}
      aria-describedby={describedBy}
      data-error={error ? "" : undefined}
    >
      <legend className={hideLabel ? "solo-lectores" : styles.label}>{label}</legend>
      <div className={styles.options}>
        {options.map((option) => {
          const title = option.title ?? option.label;
          const description = option.description ?? option.detail;
          return (
            <label key={String(option.value)} className={styles.option}>
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange?.(option.value)}
              />
              <span>{title}</span>
              {description && <span className={styles.optionDetail}>{description}</span>}
              {option.badge && <span className={styles.optionBadge}>{option.badge}</span>}
            </label>
          );
        })}
      </div>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function SwitchField({ label, description, checked, onChange, disabled, name }) {
  const id = useId();
  const descriptionId = useId();

  return (
    <div className={styles.switchRow}>
      <label className={styles.switchLabel} htmlFor={id}>
        <span>{label}</span>
        {description && (
          <span id={descriptionId} className={styles.hint}>
            {description}
          </span>
        )}
      </label>
      <input
        id={id}
        name={name}
        className={styles.switchInput}
        type="checkbox"
        role="switch"
        {...{ switch: "" }}
        checked={Boolean(checked)}
        disabled={disabled}
        aria-describedby={description ? descriptionId : undefined}
        onChange={(event) => onChange?.(event.target.checked)}
      />
    </div>
  );
}

export function ChipGroup({ label, name, values = [], onChange, options = [], error, hint }) {
  const hintId = useId();
  const errorId = useId();
  const describedBy = cn(hint && hintId, error && errorId) || undefined;

  const toggleValue = (optionValue, checked) => {
    const nextValues = checked
      ? [...values, optionValue]
      : values.filter((item) => item !== optionValue);
    onChange?.(nextValues);
  };

  return (
    <fieldset
      className={styles.group}
      aria-describedby={describedBy}
      data-error={error ? "" : undefined}
    >
      <legend className={styles.label}>{label}</legend>
      <div className={styles.chips}>
        {options.map((option) => (
          <label key={String(option.value)} className={styles.chip}>
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={values.includes(option.value)}
              onChange={(event) => toggleValue(option.value, event.target.checked)}
              aria-label={option.ariaLabel ?? option.label}
            />
            <span aria-hidden="true">{option.label}</span>
          </label>
        ))}
      </div>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function FormAlert({ message, children }) {
  const content = message ?? children;
  if (!content) return null;
  return (
    <p className={styles.formAlert} role="alert">
      {content}
    </p>
  );
}
