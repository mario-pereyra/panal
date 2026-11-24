import { useSelector } from "react-redux";
import { useGetDashboardQuery } from "../../store/api.js";
import {
  selectActiveHiveSummary,
  selectConsistencyWeeks,
  selectTodayCells,
  selectTodayDashboard,
  selectTodayDrops,
  selectTodayRank,
  selectTodayStreak,
  selectTodaySummary,
  selectZumMood,
} from "./dashboardSelectors.js";

export function useTodayDashboard() {
  const query = useGetDashboardQuery();
  const dashboard = useSelector(selectTodayDashboard);
  const summary = useSelector(selectTodaySummary);
  const streak = useSelector(selectTodayStreak);
  const todayDrops = useSelector(selectTodayDrops);
  const rank = useSelector(selectTodayRank);
  const zumMood = useSelector(selectZumMood);
  const cells = useSelector(selectTodayCells);
  const activeHive = useSelector(selectActiveHiveSummary);
  const consistencyWeeks = useSelector(selectConsistencyWeeks);

  return {
    dashboard,
    today: dashboard?.today ?? null,
    user: dashboard?.user ?? null,
    summary,
    streak,
    todayDrops,
    rank,
    zumMood,
    cells,
    activeHive,
    consistencyWeeks,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
