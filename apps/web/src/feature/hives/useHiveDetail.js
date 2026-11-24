import { daysBetween, getLogicalDay } from "@panal/motor";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useIsOnline } from "../../core/connection/useConnection.js";
import { useToggleCell } from "../../core/dashboard/useCellActions.js";
import { useToasts } from "../../core/toasts/useToasts.js";
import { formatDays } from "../../lib/formatters.js";
import {
  selectMe,
  useCreateHiveInvitationMutation,
  useGetHiveInvitationQuery,
  useGetHiveQuery,
  useRemoveHiveMemberMutation,
  useUpdateHiveMutation,
} from "../../store/api.js";
import { getGeneralErrorMessage, parseApiError } from "../../store/apiErrors.js";
import { filterHiveRowsByTab, selectHiveDetailView } from "./hivesSelectors.js";

function formatInviteExpiration(expiresDay, today) {
  const days = Math.max(0, [...daysBetween(today, expiresDay)].length - 1);
  if (days === 0) return "Vence hoy";
  return `Vence en ${formatDays(days)}`;
}

export function useHiveDetail(hiveId) {
  const [activeTab, setActiveTab] = useState("pending");
  const navigate = useNavigate();
  const { showToast } = useToasts();
  const isOnline = useIsOnline();
  const query = useGetHiveQuery(hiveId);
  const hive = useSelector((state) => selectHiveDetailView(state, hiveId));
  const cells = useMemo(() => filterHiveRowsByTab(hive?.rows, activeTab), [hive?.rows, activeTab]);
  const { toggleCell } = useToggleCell();
  const [removeMember, removeState] = useRemoveHiveMemberMutation();
  const [updateHive, updateState] = useUpdateHiveMutation();

  const parsedError = query.error ? parseApiError(query.error) : null;
  let loadError = null;
  if (parsedError?.code === "forbidden" || parsedError?.code === "not_found") {
    loadError = {
      title: "Esta colmena es de otro enjambre.",
      description:
        "Solo sus integrantes pueden verla. Si te invitaron, abre el enlace de invitación.",
    };
  } else if (query.isError) {
    loadError = {
      title: "No pudimos traer la colmena",
      retry: query.refetch,
    };
  }

  const finishAndLeave = (result, successMessage) => {
    if (result.error) {
      showToast({
        message: getGeneralErrorMessage(result.error) ?? "No se pudo completar la acción.",
        tone: "error",
      });
      return false;
    }
    showToast({ message: successMessage });
    navigate("/colmenas", { replace: true });
    return true;
  };

  const finishInPlace = (result, successMessage) => {
    if (result.error) {
      showToast({
        message: getGeneralErrorMessage(result.error) ?? "No se pudo completar la acción.",
        tone: "error",
      });
      return false;
    }
    showToast({ message: successMessage });
    return true;
  };

  const leaveHive = async () =>
    finishAndLeave(
      await removeMember({ hiveId, userId: hive.myUserId }),
      `Saliste de ${hive.name}.`,
    );

  const archiveHive = async () =>
    finishAndLeave(
      await updateHive({ id: hiveId, archived: true }),
      `${hive.name} quedó archivada.`,
    );

  const restoreHive = async () =>
    finishInPlace(
      await updateHive({ id: hiveId, archived: false }),
      `${hive.name} volvió a Colmenas.`,
    );

  const transferOwnership = async (member) =>
    finishInPlace(
      await updateHive({ id: hiveId, ownerId: member.id }),
      `${member.name} administra ahora la colmena.`,
    );

  const removeHiveMember = async (member) =>
    finishInPlace(
      await removeMember({ hiveId, userId: member.id }),
      `${member.name} ya no está en el enjambre.`,
    );

  return {
    hive,
    cells,
    activeTab,
    setActiveTab,
    isLoading: query.isLoading,
    loadError,
    isOnline,
    toggleCell,
    leaveHive,
    archiveHive,
    restoreHive,
    transferOwnership,
    removeHiveMember,
    isBusy: removeState.isLoading || updateState.isLoading,
  };
}

export function useInvite(hiveId) {
  const isOnline = useIsOnline();
  const invitationQuery = useGetHiveInvitationQuery(hiveId);
  const detailQuery = useGetHiveQuery(hiveId);
  const hive = useSelector((state) => selectHiveDetailView(state, hiveId));
  const me = useSelector(selectMe);
  const [createInvitation, createState] = useCreateHiveInvitationMutation();

  const invitation = invitationQuery.data?.invitation ?? null;
  const hasNoInvitation = invitationQuery.isSuccess && !invitation;

  const requestedForHiveRef = useRef(null);
  useEffect(() => {
    if (hasNoInvitation && isOnline && requestedForHiveRef.current !== hiveId) {
      requestedForHiveRef.current = hiveId;
      createInvitation(hiveId);
    }
  }, [hasNoInvitation, isOnline, createInvitation, hiveId]);

  const expirationLabel =
    invitation?.expiresAt && hive?.today && me?.timeZone
      ? formatInviteExpiration(getLogicalDay(invitation.expiresAt, me.timeZone), hive.today)
      : null;

  return {
    invitation,
    expirationLabel,
    isLoading: invitationQuery.isLoading || detailQuery.isLoading,
    errorMessage: getGeneralErrorMessage(invitationQuery.error ?? createState.error),
    hive,
    isOnline,
    regenerate: () => createInvitation(hiveId),
    isCreating: createState.isLoading,
  };
}
