import { useId, useState } from "react";
import { Button } from "../../components/ui/Button.jsx";
import { Dialog, useCloseDialog } from "../../components/ui/Dialog.jsx";
import { RadioCardGroup } from "../../components/ui/Form.jsx";
import { CreateHiveModal } from "./CreateHiveModal.jsx";
import styles from "./HiveDetailPage.module.css";

const CONFIRMATIONS = {
  leave: {
    getTitle: (name) => `¿Salir de ${name}?`,
    description:
      "Tus celdas llenas siguen contando para la colmena. Para volver necesitarás un enlace nuevo.",
    confirmLabel: "Salir",
  },
  remove: {
    getTitle: (name) => `¿Quitar a ${name}?`,
    description:
      "Sus celdas llenas siguen contando y las pendientes quedan libres. Para volver necesitará un enlace nuevo.",
    confirmLabel: "Quitar",
  },
  archive: {
    getTitle: (name) => `¿Archivar ${name}?`,
    description:
      "Dejará de aparecer en Colmenas para todo el enjambre. Lo ya llenado no se pierde.",
    confirmLabel: "Archivar",
  },
};

export function HiveModals({
  hive,
  detailState,
  menuOpen,
  setMenuOpen,
  activeAction,
  setActiveAction,
  memberToRemove,
}) {
  const confirmation = CONFIRMATIONS[activeAction];

  return (
    <>
      {menuOpen && (
        <Dialog title={hive.name} onClose={() => setMenuOpen(false)} closeOnBackdrop>
          <HiveActionMenu
            hive={hive}
            isOnline={detailState.isOnline}
            onSelectAction={setActiveAction}
            onRestore={detailState.restoreHive}
          />
        </Dialog>
      )}

      {activeAction === "edit" && (
        <CreateHiveModal hive={hive} onClose={() => setActiveAction(null)} />
      )}

      {activeAction === "transfer" && (
        <Dialog
          title="Pasar la fundación"
          subtitle="Quien elijas administra la colmena desde ahora: la edita, la archiva y ordena el enjambre. Tú sigues dentro."
          onClose={() => setActiveAction(null)}
        >
          <TransferOwnershipContent
            hive={hive}
            isOnline={detailState.isOnline}
            isBusy={detailState.isBusy}
            onTransfer={detailState.transferOwnership}
          />
        </Dialog>
      )}

      {confirmation && (
        <Dialog
          title={confirmation.getTitle(
            activeAction === "remove" ? memberToRemove?.name : hive.name,
          )}
          subtitle={confirmation.description}
          onClose={() => setActiveAction(null)}
        >
          <ConfirmationButtons
            confirmLabel={confirmation.confirmLabel}
            isOnline={detailState.isOnline}
            isBusy={detailState.isBusy}
            onConfirm={
              {
                leave: detailState.leaveHive,
                archive: detailState.archiveHive,
                remove: () => detailState.removeHiveMember(memberToRemove),
              }[activeAction]
            }
          />
        </Dialog>
      )}
    </>
  );
}

function HiveActionMenu({ hive, isOnline, onSelectAction, onRestore }) {
  const closeDialog = useCloseDialog();
  const noteId = useId();
  const { permissions } = hive;

  const chooseAction = (nextAction) => () => {
    closeDialog();
    onSelectAction(nextAction);
  };

  return (
    <div className={styles.menu}>
      {permissions.canEdit && !hive.isClosed && (
        <Button variant="secondary" disabled={!isOnline} onClick={chooseAction("edit")}>
          Editar
        </Button>
      )}
      {permissions.canRestore && (
        <Button
          disabled={!isOnline}
          onClick={async () => {
            if (await onRestore()) closeDialog();
          }}
        >
          Recuperar
        </Button>
      )}
      {permissions.canTransfer && (
        <Button variant="secondary" disabled={!isOnline} onClick={chooseAction("transfer")}>
          Pasar la fundación
        </Button>
      )}
      <Button
        variant="danger"
        disabled={!isOnline}
        onClick={permissions.canLeave ? chooseAction("leave") : undefined}
        aria-disabled={!permissions.canLeave || undefined}
        aria-describedby={permissions.canLeave ? undefined : noteId}
      >
        Salir de la colmena
      </Button>
      {!permissions.canLeave && (
        <p id={noteId} className={styles.nota}>
          Para salir, primero pasa la fundación a otra abeja.
        </p>
      )}
      {permissions.canArchive && (
        <Button variant="danger" disabled={!isOnline} onClick={chooseAction("archive")}>
          Archivar
        </Button>
      )}
    </div>
  );
}

function TransferOwnershipContent({ hive, isOnline, isBusy, onTransfer }) {
  const closeDialog = useCloseDialog();
  const otherMembers = hive.members.filter((member) => member.id !== hive.myUserId);
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className={styles.menu}>
      <RadioCardGroup
        label="A quién"
        name="new-owner"
        options={otherMembers.map((member) => ({
          value: member.id,
          title: member.name,
        }))}
        value={selectedId}
        onChange={setSelectedId}
      />
      <div className={styles.botones}>
        <Button variant="secondary" onClick={closeDialog}>
          Cancelar
        </Button>
        <Button
          disabled={!selectedId || isBusy || !isOnline}
          onClick={async () => {
            const chosen = otherMembers.find((member) => member.id === selectedId);
            if (chosen && (await onTransfer(chosen))) closeDialog();
          }}
        >
          Pasar la fundación
        </Button>
      </div>
    </div>
  );
}

function ConfirmationButtons({ confirmLabel, isOnline, isBusy, onConfirm }) {
  const closeDialog = useCloseDialog();

  return (
    <div className={styles.botones}>
      <Button variant="secondary" onClick={closeDialog} autoFocus>
        Cancelar
      </Button>
      <Button
        variant="danger"
        disabled={isBusy || !isOnline}
        onClick={async () => {
          if (await onConfirm()) closeDialog();
        }}
      >
        {confirmLabel}
      </Button>
    </div>
  );
}
