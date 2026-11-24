import { useState } from "react";
import { useSelector } from "react-redux";
import {
  selectTodayDashboard,
  selectTodayStreak,
} from "../../core/dashboard/dashboardSelectors.js";
import { useGetDashboardQuery, useGetReportQuery } from "../../store/api.js";
import {
  getReportPeriodRange,
  selectConsistencySummary,
  selectReportView,
} from "./reportsSelectors.js";

export function useReports() {
  const [periodKey, setPeriodKey] = useState("week");
  const dashboardQuery = useGetDashboardQuery();
  const dashboard = useSelector(selectTodayDashboard);
  const streak = useSelector(selectTodayStreak);
  const consistency = useSelector(selectConsistencySummary);

  const periodRange = getReportPeriodRange(dashboard?.today, periodKey);
  const reportQuery = useGetReportQuery(periodRange ?? undefined, {
    skip: !periodRange,
  });
  const reportView = useSelector((state) => selectReportView(state, periodKey));

  return {
    periodKey,
    setPeriodKey,
    isLoading: dashboardQuery.isLoading || (reportQuery.isLoading && !reportQuery.data),
    isFetching: reportQuery.isFetching,
    isError: (dashboardQuery.isError || reportQuery.isError) && !reportView?.dailyView,
    retry: () => {
      dashboardQuery.refetch();
      if (periodRange) reportQuery.refetch();
    },
    user: dashboard?.user,
    streak,
    consistency,
    dailyView: reportView?.dailyView ?? null,
    recurringSeries: reportView?.recurringSeries ?? [],
    recurringTable: reportView?.recurringTable ?? { dayHeaders: [], rows: [] },
    breakdownJars: reportView?.breakdownJars ?? null,
    hives: reportView?.hives ?? [],
    isEmpty: Boolean(reportView?.isEmpty),
  };
}
