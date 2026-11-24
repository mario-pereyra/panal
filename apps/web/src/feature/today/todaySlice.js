import { createSlice } from "@reduxjs/toolkit";
import { readStorage, writeStorage } from "../../lib/storage.js";

const STORAGE_KEY = "panal:dismissed-banner";

export const todaySlice = createSlice({
  name: "today",
  initialState: () => ({
    dismissedBannerDay: readStorage(STORAGE_KEY, null),
  }),
  reducers: {
    dismissBanner(state, action) {
      state.dismissedBannerDay = action.payload;
      writeStorage(STORAGE_KEY, action.payload);
    },
  },
  selectors: {
    selectDismissedBannerDay: (state) => state.dismissedBannerDay,
  },
});

export const { dismissBanner } = todaySlice.actions;
export const { selectDismissedBannerDay } = todaySlice.selectors;
export default todaySlice.reducer;
