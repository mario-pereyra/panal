import { Button } from "../../components/ui/Button.jsx";
import { Dialog, useCloseDialog } from "../../components/ui/Dialog.jsx";
import { FormAlert, TextAreaField, TextField } from "../../components/ui/Form.jsx";
import styles from "./CreateHiveModal.module.css";
import { useCreateHiveForm } from "./useHives.js";

export function CreateHiveModal({ onClose, hive }) {
  const title = hive ? "Editar colmena" : "Fundar una colmena";
  const subtitle = hive
    ? undefined
    : "Un proyecto con su enjambre: cada celda llena suma para todas las abejas.";
  const submitLabel = hive ? "Guardar" : "Fundar";

  return (
    <Dialog title={title} subtitle={subtitle} onClose={onClose}>
      <CreateHiveFormFields hive={hive} submitLabel={submitLabel} />
    </Dialog>
  );
}

function CreateHiveFormFields({ hive, submitLabel }) {
  const closeDialog = useCloseDialog();
  const { form, isSaving, errorMessage, isOnline, today } = useCreateHiveForm(hive, closeDialog);

  return (
    <form className={styles.formulario} onSubmit={form.handleSubmit} noValidate>
      <FormAlert message={errorMessage} />
      <TextField
        label="Nombre"
        name="name"
        autoComplete="off"
        required
        autoFocus
        value={form.values.name}
        error={form.errors.name}
        onChange={(event) => form.setFieldValue("name", event?.target ? event.target.value : event)}
        onBlur={form.handleBlur}
      />
      <TextAreaField
        label="Descripción (opcional)"
        name="description"
        value={form.values.description}
        error={form.errors.description}
        onChange={(event) =>
          form.setFieldValue("description", event?.target ? event.target.value : event)
        }
        onBlur={form.handleBlur}
      />
      <TextField
        label="Fecha de entrega (opcional)"
        name="dueDate"
        type="date"
        min={today}
        value={form.values.dueDate}
        error={form.errors.dueDate}
        onChange={(event) =>
          form.setFieldValue("dueDate", event?.target ? event.target.value : event)
        }
        onBlur={form.handleBlur}
      />
      <div className={styles.botones}>
        <Button variant="ghost" onClick={closeDialog}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSaving || !isOnline}>
          {isSaving ? "Guardando…" : submitLabel}
        </Button>
      </div>
      {!isOnline && (
        <p className={styles.sinConexion} role="status">
          Sin conexión: hace falta señal para guardar.
        </p>
      )}
    </form>
  );
}
