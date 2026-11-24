import { createSlice } from "@reduxjs/toolkit";
import {
  readSessionStorage,
  removeSessionStorage,
  writeSessionStorage,
} from "../../lib/storage.js";

const INVITE_STORAGE_KEY = "panal:invitacion";

export const authSlice = createSlice({
  name: "auth",
  initialState: () => ({
    pendingInvite: readSessionStorage(INVITE_STORAGE_KEY, null),
  }),
  reducers: {
    setPendingInvite(state, action) {
      state.pendingInvite = action.payload;
      if (action.payload) writeSessionStorage(INVITE_STORAGE_KEY, action.payload);
      else removeSessionStorage(INVITE_STORAGE_KEY);
    },
    clearPendingInvite(state) {
      state.pendingInvite = null;
      removeSessionStorage(INVITE_STORAGE_KEY);
    },
  },
});

export const { setPendingInvite, clearPendingInvite } = authSlice.actions;

export const selectPendingInvite = (state) => state.auth.pendingInvite;

export default authSlice.reducer;
