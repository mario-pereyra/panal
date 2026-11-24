import { createSlice } from "@reduxjs/toolkit";

export const activitySlice = createSlice({
  name: "activity",
  initialState: () => ({ drafts: {} }),
  reducers: {
    saveDraft(state, action) {
      const { key, values } = action.payload;
      state.drafts[key] = values;
    },
    discardDraft(state, action) {
      delete state.drafts[action.payload];
    },
  },
  selectors: {
    selectDraftByKey: (state, key) => state.drafts[key] ?? null,
  },
});

export const { saveDraft, discardDraft } = activitySlice.actions;
export const { selectDraftByKey } = activitySlice.selectors;
export default activitySlice.reducer;
