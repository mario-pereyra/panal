import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { clearCachedData } from "../../../pwa/registration.js";
import { panalApi, useGetMeQuery, useLogoutMutation } from "../../store/api.js";
import { parseApiError } from "../../store/apiErrors.js";
import { clearPendingInvite, selectPendingInvite, setPendingInvite } from "./authSlice.js";

export function useMe() {
  const query = useGetMeQuery();
  const user = query.data?.user ?? query.data ?? null;
  const parsedError = parseApiError(query.error);
  const isUnauthorized = query.error?.status === 401;
  const isOffline = !user && parsedError?.code === "offline";

  return {
    user,
    isLoading: query.isLoading && !query.error,
    isError: Boolean(query.error) && !isUnauthorized,
    isAuthenticated: Boolean(user),
    isOnboarded: Boolean(user?.onboardedAt),
    isUnauthorized,
    isOffline,
    error: parsedError,
    refetch: query.refetch,
  };
}

export function useLogout() {
  const [logoutMutation, state] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    await logoutMutation();
    dispatch(panalApi.util.resetApiState());
    await clearCachedData();
    navigate("/entrar", { replace: true });
  }, [dispatch, logoutMutation, navigate]);

  logout.logout = logout;
  logout.isLoading = state.isLoading;
  return logout;
}

export function usePendingInvite() {
  const dispatch = useDispatch();
  const pendingInvite = useSelector(selectPendingInvite);
  const saveInvite = useCallback((code) => dispatch(setPendingInvite(code)), [dispatch]);
  const clearInvite = useCallback(() => dispatch(clearPendingInvite()), [dispatch]);

  return {
    pendingInvite,
    saveInvite,
    clearInvite,
  };
}
