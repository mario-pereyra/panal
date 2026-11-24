import { DEFAULT_DAILY_GOAL } from "@panal/contratos";
import { createSlice } from "@reduxjs/toolkit";
import { readStorage, removeStorage, writeStorage } from "../../lib/storage.js";

const STORAGE_KEY = "panal:onboarding";

const INITIAL_STATE = {
  step: 1,
  dailyGoal: DEFAULT_DAILY_GOAL,
  activityId: null,
  title: "",
  cellId: null,
};

function loadInitialState() {
  const stored = readStorage(STORAGE_KEY, null);
  if (!stored) return INITIAL_STATE;
  if (typeof stored === "object") return { ...INITIAL_STATE, ...stored };
  try {
    return { ...INITIAL_STATE, ...JSON.parse(stored) };
  } catch {
    return INITIAL_STATE;
  }
}

export const onboardingSlice = createSlice({
  name: "onboarding",
  initialState: loadInitialState,
  reducers: {
    setDailyGoal(state, action) {
      state.dailyGoal = action.payload;
      writeStorage(STORAGE_KEY, state);
    },
    setStep(state, action) {
      state.step = action.payload;
      writeStorage(STORAGE_KEY, state);
    },
    setCreatedActivity(state, action) {
      state.activityId = action.payload.id;
      state.title = action.payload.title;
      state.step = 3;
      writeStorage(STORAGE_KEY, state);
    },
    setFilledCell(state, action) {
      state.cellId = action.payload;
      writeStorage(STORAGE_KEY, state);
    },
    resetOnboarding() {
      removeStorage(STORAGE_KEY);
      return INITIAL_STATE;
    },
  },
  selectors: {
    selectOnboarding: (state) => state,
  },
});

export const { setDailyGoal, setStep, setCreatedActivity, setFilledCell, resetOnboarding } =
  onboardingSlice.actions;

export const { selectOnboarding } = onboardingSlice.selectors;

export default onboardingSlice.reducer;
