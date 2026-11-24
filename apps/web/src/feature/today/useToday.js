import { useDispatch, useSelector } from "react-redux";
import { useIsOnline } from "../../core/connection/useConnection.js";
import {
  selectActiveHiveSummary,
  selectConsistencyWeeks,
  selectTodayCells,
  selectTodayDashboard,
  selectTodayStreak,
  selectTodaySummary,
  selectZumMood,
} from "../../core/dashboard/dashboardSelectors.js";
import { useToggleCell } from "../../core/dashboard/useCellActions.js";
import { useGetDashboardQuery } from "../../store/api.js";
import { selectTodayBanner } from "./todaySelectors.js";
import { dismissBanner } from "./todaySlice.js";

export function useToday() {
  const query = useGetDashboardQuery();
  const { toggleCell } = useToggleCell();
  const isOnline = useIsOnline();
  const dispatch = useDispatch();

  const dashboard = useSelector(selectTodayDashboard);
  const cells = useSelector(selectTodayCells);
  const summary = useSelector(selectTodaySummary);
  const streak = useSelector(selectTodayStreak);
  const zumMood = useSelector(selectZumMood);
  const activeHive = useSelector(selectActiveHiveSummary);
  const consistencyWeeks = useSelector(selectConsistencyWeeks);
  const banner = useSelector(selectTodayBanner);

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    retry: query.refetch,
    isOnline,
    today: dashboard?.today,
    user: dashboard?.user,
    zumMood,
    summary,
    cells,
    streak,
    activeHive,
    consistencyWeeks,
    banner,
    dismissBanner: () => dashboard?.today && dispatch(dismissBanner(dashboard.today)),
    toggleCell,
  };
}
