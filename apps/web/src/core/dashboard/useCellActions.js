import { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useFillCellMutation,
  useUnfillCellMutation,
  useUpdateActivityMutation,
} from "../../store/api.js";
import { parseApiError } from "../../store/apiErrors.js";
import { enqueueCelebrations } from "../celebrations/celebrationsSlice.js";
import { useToasts } from "../toasts/useToasts.js";

function formatCellFailureMessage(error) {
  const parsed = parseApiError(error);
  if (parsed?.code === "offline") {
    return "Sin conexión: la celda volvió a como estaba. Inténtalo con señal.";
  }
  return `No se guardó la celda. ${parsed?.message ?? ""}`.trim();
}

export function useToggleCell() {
  const dispatch = useDispatch();
  const { showToast } = useToasts();
  const [fillCell, fillState] = useFillCellMutation();
  const [unfillCell, unfillState] = useUnfillCellMutation();
  const inFlightIds = useRef(new Set());
  const [pendingCount, setPendingCount] = useState(0);

  const toggleCell = useCallback(
    async (row) => {
      if (!row?.id || inFlightIds.current.has(row.id)) return false;
      inFlightIds.current.add(row.id);
      setPendingCount((count) => count + 1);
      try {
        const result = row.filled
          ? await unfillCell({
              id: row.cellId,
              activityId: row.id,
              hiveId: row.hiveId,
            })
          : await fillCell({
              id: crypto.randomUUID(),
              activityId: row.id,
              type: row.type,
              overdue: row.overdue,
              hiveId: row.hiveId,
            });
        if (result.error) {
          showToast({
            message: formatCellFailureMessage(result.error),
            tone: "error",
          });
          return false;
        }
        const celebrations = result.data?.celebrations ?? [];
        if (celebrations.length > 0) {
          dispatch(enqueueCelebrations(celebrations));
        }
        return true;
      } finally {
        inFlightIds.current.delete(row.id);
        setPendingCount((count) => Math.max(0, count - 1));
      }
    },
    [dispatch, fillCell, showToast, unfillCell],
  );

  const isPending = pendingCount > 0 || fillState.isLoading || unfillState.isLoading;
  toggleCell.toggleCell = toggleCell;
  toggleCell.isPending = isPending;
  return toggleCell;
}

export function useArchiveActivity() {
  const { showToast } = useToasts();
  const [updateActivity] = useUpdateActivityMutation();

  const restoreActivity = useCallback(
    async (id) => {
      const result = await updateActivity({ id, archived: false });
      if (result.error) {
        showToast({
          message: "No se pudo recuperar. Inténtalo otra vez.",
          tone: "error",
        });
        return false;
      }
      showToast({ message: "Celda recuperada: vuelve a tu panal." });
      return true;
    },
    [showToast, updateActivity],
  );

  const archiveActivity = useCallback(
    async (id) => {
      const result = await updateActivity({ id, archived: true });
      if (result.error) {
        showToast({
          message: "No se pudo archivar. Inténtalo otra vez.",
          tone: "error",
        });
        return false;
      }
      showToast({
        message: "Celda archivada",
        action: {
          label: "Deshacer",
          mutation: "updateActivity",
          args: { id, archived: false },
        },
      });
      return true;
    },
    [showToast, updateActivity],
  );

  archiveActivity.archiveActivity = archiveActivity;
  archiveActivity.restoreActivity = restoreActivity;
  return archiveActivity;
}
