import { Button } from "../../components/ui/Button.jsx";
import { Dialog, useCloseDialog } from "../../components/ui/Dialog.jsx";
import styles from "./CellActionsMenu.module.css";

export function CellActionsMenu({ row, cells, onClose }) {
  return (
    <Dialog
      title={row.title}
      subtitle={row.subtitle ?? row.detail}
      onClose={onClose}
      closeOnBackdrop
    >
      <MenuActions row={row} cells={cells} />
    </Dialog>
  );
}

function MenuActions({ row, cells }) {
  const closeDialog = useCloseDialog();
  const { isOnline } = cells;
  const canEdit = row.permissions?.canEdit;
  const canArchive = row.permissions?.canArchive;

  const runAfterClose = (action) => () => {
    closeDialog();
    action(row);
  };

  return (
    <div className={styles.acciones}>
      {!isOnline && (
        <p className={styles.sinConexion} role="status">
          Sin conexión: estas acciones esperan a que vuelva la señal.
        </p>
      )}
      {row.archived ? (
        canArchive && (
          <Button onClick={runAfterClose(cells.restoreRow)} disabled={!isOnline}>
            Recuperar
          </Button>
        )
      ) : (
        <>
          {canEdit && (
            <Button to={`/celdas/${row.id}`} modal variant="secondary" onClick={closeDialog}>
              Editar
            </Button>
          )}
          {canEdit && row.type === "unica" && (
            <Button
              variant="secondary"
              onClick={runAfterClose(cells.postponeRow)}
              disabled={!isOnline}
            >
              Posponer un día
            </Button>
          )}
          {canArchive && (
            <Button variant="danger" onClick={runAfterClose(cells.archiveRow)} disabled={!isOnline}>
              Archivar
            </Button>
          )}
        </>
      )}
    </div>
  );
}
