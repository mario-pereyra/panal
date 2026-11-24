import { Link } from "react-router";
import { Button } from "../../components/ui/Button.jsx";
import { FormAlert, TextField } from "../../components/ui/Form.jsx";
import { AuthLayout } from "./AuthLayout.jsx";
import styles from "./AuthLayout.module.css";
import { useLoginForm } from "./useAuthForm.js";

export function LoginPage() {
  const { form, isSubmitting, errorMessage, waitSeconds, isOnline } = useLoginForm();

  return (
    <AuthLayout
      title="Entrar al panal"
      mood="esperando"
      tagline={<p>Cada cosa que haces llena una celda</p>}
    >
      <form className={styles.campos} onSubmit={form.handleSubmit} noValidate>
        <FormAlert message={errorMessage} />
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
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={form.values.password}
          error={form.errors.password}
          onChange={(event) =>
            form.setFieldValue("password", event?.target ? event.target.value : event)
          }
          onBlur={form.handleBlur}
        />
        <Button
          type="submit"
          className={styles.enviar}
          disabled={isSubmitting || waitSeconds > 0 || !isOnline}
        >
          {isSubmitting ? "Entrando…" : "Entrar"}
        </Button>
        {!isOnline && (
          <p className={styles.aviso} role="status">
            Sin conexión. Para entrar hace falta señal.
          </p>
        )}
      </form>
      <p className={styles.pie}>
        ¿No tienes panal? <Link to="/crear">Crea el tuyo</Link>
      </p>
    </AuthLayout>
  );
}
