import { ERRORS } from "@panal/contratos";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useMe, usePendingInvite } from "../../core/auth/useAuth.js";
import { useIsOnline } from "../../core/connection/useConnection.js";
import { useAcceptInvitationMutation, useGetInvitationQuery } from "../../store/api.js";
import { getGeneralErrorMessage, parseApiError } from "../../store/apiErrors.js";

export function useJoinHive(code) {
  const navigate = useNavigate();
  const isOnline = useIsOnline();
  const { user, isLoading: isLoadingMe } = useMe();
  const { saveInvite, clearInvite } = usePendingInvite();
  const invitationQuery = useGetInvitationQuery(code);
  const [acceptInvitation, acceptState] = useAcceptInvitationMutation();

  const invitation = invitationQuery.data?.invitation ?? invitationQuery.data ?? null;
  const isUnauthenticated = !isLoadingMe && !user;
  const alreadyMember = Boolean(invitation?.alreadyMember);

  useEffect(() => {
    if (isUnauthenticated && invitation) {
      saveInvite(code);
    }
  }, [isUnauthenticated, invitation, code, saveInvite]);

  useEffect(() => {
    if (alreadyMember) {
      clearInvite();
    }
  }, [alreadyMember, clearInvite]);

  const joinHive = async () => {
    if (!isOnline) return;
    const result = await acceptInvitation(code);
    const errorCode = result.error ? parseApiError(result.error).code : null;
    if (result.error && errorCode !== "already_member") return;
    clearInvite();
    const targetHiveId = result.data?.hiveId ?? invitation?.hive?.id;
    if (targetHiveId) {
      navigate(`/colmenas/${targetHiveId}`, { replace: true });
    }
  };

  const parsedLoadError = invitationQuery.error ? parseApiError(invitationQuery.error) : null;
  const unavailableReason = parsedLoadError
    ? !isOnline
      ? getGeneralErrorMessage(invitationQuery.error)
      : ERRORS.invite_expired.message
    : null;

  return {
    user,
    isOnline,
    isLoading: invitationQuery.isLoading || isLoadingMe,
    unavailableReason,
    invitation,
    alreadyMember,
    joinHive,
    isJoining: acceptState.isLoading,
    joinErrorMessage: getGeneralErrorMessage(acceptState.error),
  };
}
