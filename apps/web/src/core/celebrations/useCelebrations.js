import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTodaySummary } from "../dashboard/dashboardSelectors.js";
import { selectCelebrationQueue, selectCurrentCelebration } from "./celebrationsSelectors.js";
import { dismissCelebration } from "./celebrationsSlice.js";

export function useCelebrations() {
  const dispatch = useDispatch();
  const celebration = useSelector(selectCurrentCelebration);
  const celebrations = useSelector(selectCelebrationQueue);
  const summary = useSelector(selectTodaySummary);
  const closeCelebration = useCallback(() => dispatch(dismissCelebration()), [dispatch]);

  return {
    celebration,
    celebrations,
    goal: summary?.goal ?? 5,
    closeCelebration,
  };
}
