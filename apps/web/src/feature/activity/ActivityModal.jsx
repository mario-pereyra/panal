import { useId, useState } from "react";
import { Button } from "../../components/ui/Button.jsx";
import { Dialog, useCloseDialog } from "../../components/ui/Dialog.jsx";
import { ActivityFields } from "./ActivityFields.jsx";
import styles from "./ActivityModal.module.css";
import { useActivityForm, useActivityModal } from "./useActivityForm.js";

export function ActivityModal() {
  const modalState = useActivityModal();
  const title = modalState.isEditing ? "Editar actividad" : "Nueva actividad";

  if (modalState.isSearching || modalState.notFound || !modalState.initialValues) {
    return (
      <Dialog title={title} onClose={modalState.exitModal} closeOnBackdrop>
        <p className={styles.aviso}>
          {modalState.isSearching ? "Buscando la celda…" : "Esta celda no existe o ya no es tuya."}
        </p>
      </Dialog>
    );
  }

  return <ActivityFormDialog key={modalState.draftKey} modalState={modalState} title={title} />;
}

function ActivityFormDialog({ modalState, title }) {
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);
  const formId = useId();
  const formState = useActivityForm(modalState, modalState.exitModal);

  const handleBeforeClose = (event) => {
    if (!formState.hasUnsavedChanges || confirmingDiscard) return;
    event?.preventDefault?.();
    setConfirmingDiscard(true);
  };

  return (
    <Dialog
      title={title}
      onClose={modalState.exitModal}
      beforeClose={handleBeforeClose}
      size="lg"
      footer={
        <ModalFooter
          modalState={modalState}
          formId={formId}
          hasUnsavedChanges={formState.hasUnsavedChanges}
          confirmingDiscard={confirmingDiscard}
          setConfirmingDiscard={setConfirmingDiscard}
        />
      }
    >
      <ActivityFields modalState={modalState} formState={formState} formId={formId} />
    </Dialog>
  );
}

function ModalFooter({
  modalState,
  formId,
  hasUnsavedChanges,
  confirmingDiscard,
  setConfirmingDiscard,
}) {
  const closeDialog = useCloseDialog();
  const warningId = useId();

  const discardAndClose = () => {
    modalState.clearDraftValues();
    closeDialog();
  };

  return (
    <div className={styles.pie}>
      <p
        id={warningId}
        className={styles.descarte}
        data-visible={confirmingDiscard ? "" : undefined}
        role="status"
      >
        {confirmingDiscard ? "Tienes cambios sin guardar. ¿Los descartas?" : ""}
      </p>
      <div className={styles.botones}>
        {confirmingDiscard ? (
          <>
            <Button
              variant="danger"
              onClick={discardAndClose}
              aria-describedby={warningId}
              autoFocus
            >
              Descartar
            </Button>
            <Button variant="secondary" onClick={() => setConfirmingDiscard(false)}>
              Seguir editando
            </Button>
          </>
        ) : (
          <>
            {modalState.isEditing && !modalState.isArchived && modalState.canArchive && (
              <Button
                variant="danger"
                disabled={!modalState.isOnline || modalState.isSaving}
                onClick={async () => {
                  if (await modalState.archive()) closeDialog();
                }}
              >
                Archivar
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => (hasUnsavedChanges ? setConfirmingDiscard(true) : closeDialog())}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form={formId}
              disabled={!modalState.isOnline || modalState.isSaving}
            >
              {modalState.isSaving ? "Guardando…" : "Guardar"}
            </Button>
          </>
        )}
      </div>
      {!modalState.isOnline && (
        <p className={styles.nota} role="status">
          Sin conexión: lo escrito queda guardado aquí hasta que vuelva la señal.
        </p>
      )}
    </div>
  );
}
