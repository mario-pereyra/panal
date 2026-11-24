import { getLogicalDay } from "@panal/motor";
import { createSlice } from "@reduxjs/toolkit";
import { panalApi, selectMe } from "../../store/api.js";

export const clockSlice = createSlice({
  name: "clock",
  initialState: () => ({ now: Date.now() }),
  reducers: {
    setNow(state, action) {
      state.now = action.payload;
    },
  },
});

export const { setNow } = clockSlice.actions;

export const selectNow = (state) => state.clock.now;

const DAY_DEPENDENT_TAGS = ["Dashboard", "Activities", "Hives", "Progress", "Report"];

export const syncClock =
  (now = Date.now()) =>
  (dispatch, getState) => {
    const previousNow = selectNow(getState());
    dispatch(setNow(now));
    const timeZone = selectMe(getState())?.timeZone;
    if (timeZone && getLogicalDay(previousNow, timeZone) !== getLogicalDay(now, timeZone)) {
      dispatch(panalApi.util.invalidateTags(DAY_DEPENDENT_TAGS));
    }
  };

export default clockSlice.reducer;
