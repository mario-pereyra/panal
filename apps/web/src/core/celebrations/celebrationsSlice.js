import { createSlice } from "@reduxjs/toolkit";

export const celebrationsSlice = createSlice({
  name: "celebrations",
  initialState: () => ({ queue: [] }),
  reducers: {
    enqueueCelebrations(state, action) {
      const items = Array.isArray(action.payload) ? action.payload : [action.payload];
      state.queue.push(...items.filter(Boolean));
    },
    dismissCelebration(state) {
      state.queue = [];
    },
  },
});

export const { enqueueCelebrations, dismissCelebration } = celebrationsSlice.actions;

export default celebrationsSlice.reducer;
