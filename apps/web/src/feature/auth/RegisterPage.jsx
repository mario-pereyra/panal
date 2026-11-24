import { Link } from "react-router";
import { Button } from "../../components/ui/Button.jsx";
import { FormAlert, TextField } from "../../components/ui/Form.jsx";
import { getHexagonPoints } from "../../components/ui/hexagon.js";
import { AuthLayout } from "./AuthLayout.jsx";
import styles from "./AuthLayout.module.css";
import { useRegisterForm } from "./useAuthForm.js";

const TAGLINE_ITEMS = ["Llena celdas", "Cuida tu racha", "Suma a tu colmena"];

export function RegisterPage() {
  const { form, strength, isSubmitting, errorMessage, emailTaken, isOnline, invitation } =
    useRegisterForm();

  return (
    <AuthLayout
      title="Crear mi panal"
      mood="animando"
      tagline={
        <ul role="list">
          {TAGLINE_ITEMS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      }
    >
      {invitation?.hive?.name && (
        <p className={styles.aviso}>{`Te espera la colmena ${invitation.hive.name}.`}</p>
      )}
      <form className={styles.campos} onSubmit={form.handleSubmit} noValidate>
        {emailTaken ? (
          <p className={styles.aviso} role="alert">
            Ese correo ya tiene un panal. <Link to="/entrar">Entra con él</Link>.
          </p>
        ) : (
          <FormAlert message={errorMessage} />
        )}
        <TextField
          label="Nombre"
          name="name"
          autoComplete="name"
          required
          value={form.values.name}
          error={form.errors.name}
          onChange={(event) =>
            form.setFieldValue("name", event?.target ? event.target.value : event)
          }
          onBlur={form.handleBlur}
        />
        <TextField
          label="Correo"
          name="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          value={form.values.email}
          error={form.errors.email}
          onChange={(event) =>
            form.setFieldValue("email", event?.target ? event.target.value : event)
          }
          onBlur={form.handleBlur}
        />
        <div className={styles.campos}>
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={form.values.password}
            error={form.errors.password}
            onChange={(event) =>
              form.setFieldValue("password", event?.target ? event.target.value : event)
            }
            onBlur={form.handleBlur}
          />
          <p className={styles.fuerza} aria-live="polite">
            <svg
              className={styles.celdasDeFuerza}
              width="72"
              height="22"
              viewBox="0 0 72 22"
              aria-hidden="true"
            >
              {[0, 1, 2].map((cellIndex) => (
                <g
                  key={cellIndex}
                  data-llena={cellIndex < strength.cells ? "" : undefined}
                  transform={`translate(${12 + cellIndex * 24} 11)`}
                >
                  <polygon points={getHexagonPoints(9.5)} />
                </g>
              ))}
            </svg>
            <span>{strength.label}</span>
          </p>
        </div>
        <Button type="submit" className={styles.enviar} disabled={isSubmitting || !isOnline}>
          {isSubmitting ? "Creando tu panal…" : "Crear mi panal"}
        </Button>
        {!isOnline && (
          <p className={styles.aviso} role="status">
            Sin conexión. Para crear tu panal hace falta señal.
          </p>
        )}
      </form>
      <p className={styles.pie}>
        <Link to="/entrar">Ya tengo un panal</Link>
      </p>
    </AuthLayout>
  );
}
