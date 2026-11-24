import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  activateServiceWorkerUpdate,
  listenForInstallPrompt,
  promptAppInstall,
  registerServiceWorker,
} from "../../../pwa/registration.js";
import {
  selectCanInstall,
  selectHasUpdate,
  selectIsInstalled,
  selectIsOnline,
  setCanInstall,
  setHasUpdate,
  setInstalled,
  setOnline,
} from "./connectionSlice.js";

let activeListenersCount = 0;
let removeInstallListeners = null;
let serviceWorkerRegistered = false;
let onlineHandler = null;
let offlineHandler = null;

function attachGlobalConnectionListeners(dispatch) {
  if (typeof window === "undefined") return () => {};

  if (!serviceWorkerRegistered) {
    serviceWorkerRegistered = true;
    registerServiceWorker({
      onUpdateAvailable: () => dispatch(setHasUpdate(true)),
    });
  }

  if (activeListenersCount === 0) {
    removeInstallListeners = listenForInstallPrompt({
      onCanInstall: () => dispatch(setCanInstall(true)),
      onInstalled: () => dispatch(setInstalled(true)),
    });
    onlineHandler = () => dispatch(setOnline(true));
    offlineHandler = () => dispatch(setOnline(false));
    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);
  }

  activeListenersCount += 1;

  return () => {
    activeListenersCount = Math.max(0, activeListenersCount - 1);
    if (activeListenersCount === 0) {
      removeInstallListeners?.();
      removeInstallListeners = null;
      if (onlineHandler) window.removeEventListener("online", onlineHandler);
      if (offlineHandler) window.removeEventListener("offline", offlineHandler);
      onlineHandler = null;
      offlineHandler = null;
    }
  };
}

export function useConnection() {
  const dispatch = useDispatch();
  const isOnline = useSelector(selectIsOnline);
  const canInstall = useSelector(selectCanInstall);
  const isInstalled = useSelector(selectIsInstalled);
  const hasUpdate = useSelector(selectHasUpdate);

  useEffect(() => attachGlobalConnectionListeners(dispatch), [dispatch]);

  const installApp = useCallback(async () => {
    const accepted = await promptAppInstall({
      onPromptConsumed: () => dispatch(setCanInstall(false)),
    });
    if (accepted) dispatch(setInstalled(true));
    return accepted;
  }, [dispatch]);

  return {
    isOnline,
    canInstall,
    isInstalled,
    hasUpdate,
    installApp,
    applyUpdate: activateServiceWorkerUpdate,
  };
}

export function useIsOnline() {
  return useSelector(selectIsOnline);
}
