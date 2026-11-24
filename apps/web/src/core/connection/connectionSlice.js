import { createSlice } from "@reduxjs/toolkit";
import { isStandaloneApp, supportsWebInstall } from "../../../pwa/browser.js";

export const connectionSlice = createSlice({
  name: "connection",
  initialState: () => ({
    isOnline: typeof navigator === "undefined" ? true : navigator.onLine,
    canInstall: supportsWebInstall() && !isStandaloneApp(),
    isInstalled: isStandaloneApp(),
    hasUpdate: false,
  }),
  reducers: {
    setOnline(state, action) {
      state.isOnline = action.payload;
    },
    setCanInstall(state, action) {
      state.canInstall = Boolean(action.payload) && !state.isInstalled;
    },
    setInstalled(state, action) {
      const installed = action.payload ?? true;
      state.isInstalled = installed;
      if (installed) state.canInstall = false;
    },
    setHasUpdate(state, action) {
      state.hasUpdate = action.payload ?? true;
    },
  },
});

export const { setOnline, setCanInstall, setInstalled, setHasUpdate } = connectionSlice.actions;

export const selectIsOnline = (state) => state.connection.isOnline;
export const selectCanInstall = (state) => state.connection.canInstall;
export const selectIsInstalled = (state) => state.connection.isInstalled;
export const selectHasUpdate = (state) => state.connection.hasUpdate;

export default connectionSlice.reducer;
