import { createSlice } from "@reduxjs/toolkit";

export const cellsSlice = createSlice({
  name: "cells",
  initialState: () => ({
    hiveFilter: "all",
    priorityFilter: "all",
  }),
  reducers: {
    setHiveFilter(state, action) {
      state.hiveFilter = action.payload;
    },
    setPriorityFilter(state, action) {
      state.priorityFilter = action.payload;
    },
    clearCellFilters(state) {
      state.hiveFilter = "all";
      state.priorityFilter = "all";
    },
  },
  selectors: {
    selectHiveFilter: (state) => state.hiveFilter,
    selectPriorityFilter: (state) => state.priorityFilter,
    selectHasCellFilters: (state) => state.hiveFilter !== "all" || state.priorityFilter !== "all",
  },
});

export const { setHiveFilter, setPriorityFilter, clearCellFilters } = cellsSlice.actions;
export const { selectHiveFilter, selectPriorityFilter, selectHasCellFilters } =
  cellsSlice.selectors;

export default cellsSlice.reducer;
