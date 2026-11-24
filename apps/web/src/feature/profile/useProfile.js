import { useState } from "react";
import { useSelector } from "react-redux";
import { useLogout, useMe } from "../../core/auth/useAuth.js";
import { useConnection } from "../../core/connection/useConnection.js";
import { useReducedMotion } from "../../core/preferences/usePreferences.js";
import { useToasts } from "../../core/toasts/useToasts.js";
import {
  useCancelPauseMutation,
  useGetProgressQuery,
  useUpdateProfileMutation,
} from "../../store/api.js";
import { getGeneralErrorMessage } from "../../store/apiErrors.js";
import {
  selectProfileBadges,
  selectProfilePause,
  selectProfileRank,
  selectProfileSettings,
  selectProfileTotals,
} from "./profileSelectors.js";

export function useProfile() {
  const { showToast } = useToasts();
  const motionPrefs = useReducedMotion();
  const { user } = useMe();
  const progressQuery = useGetProgressQuery();
  const [updateProfile, updateState] = useUpdateProfileMutation();
  const [cancelPauseMutation, cancelPauseState] = useCancelPauseMutation();
  const connection = useConnection();
  const logoutResult = useLogout();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logoutFn = typeof logoutResult === "function" ? logoutResult : logoutResult?.logout;

  const handleLogout = async () => {
    if (!logoutFn) return;
    setIsLoggingOut(true);
    try {
      await logoutFn();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const saveSetting = async (changes, confirmationMessage = "Ajuste guardado") => {
    const result =
      "pausePeriod" in changes && changes.pausePeriod === null
        ? await cancelPauseMutation()
        : await updateProfile(changes);
    if (result.error) {
      const reason = getGeneralErrorMessage(result.error) ?? "Inténtalo otra vez.";
      showToast({
        message: `No se guardó el ajuste. ${reason}`,
        tone: "error",
      });
      return false;
    }
    showToast({ message: confirmationMessage });
    return true;
  };

  return {
    user,
    isLoading: progressQuery.isLoading,
    isError: progressQuery.isError && !progressQuery.data,
    retry: progressQuery.refetch,
    rank: useSelector(selectProfileRank),
    badges: useSelector(selectProfileBadges),
    totals: useSelector(selectProfileTotals),
    settings: useSelector(selectProfileSettings),
    pauseState: useSelector(selectProfilePause),
    saveSetting,
    isSaving: updateState.isLoading || cancelPauseState.isLoading,
    ...motionPrefs,
    ...connection,
    logout: handleLogout,
    isLoggingOut: Boolean(logoutResult?.isLoading || isLoggingOut),
  };
}
