import { createSlice } from "@reduxjs/toolkit";
import { readStorage, removeStorage, writeStorage } from "../../lib/storage.js";

const MOTION_STORAGE_KEY = "panal:movimiento";

function loadInitialReduceMotion() {
  const stored = readStorage(MOTION_STORAGE_KEY, false);
  return stored === true || stored === "reducido";
}

export const preferencesSlice = createSlice({
  name: "preferences",
  initialState: () => ({
    reduceMotion: loadInitialReduceMotion(),
  }),
  reducers: {
    setReduceMotion(state, action) {
      const enabled = action.payload === true || action.payload === "reducido";
      state.reduceMotion = enabled;
      if (enabled) writeStorage(MOTION_STORAGE_KEY, "reducido");
      else removeStorage(MOTION_STORAGE_KEY);
    },
  },
});

export const { setReduceMotion } = preferencesSlice.actions;

export const selectReduceMotion = (state) => state.preferences.reduceMotion;

export default preferencesSlice.reducer;
