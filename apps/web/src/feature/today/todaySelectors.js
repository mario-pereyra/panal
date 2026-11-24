import { createSelector } from "@reduxjs/toolkit";
import {
  selectActiveHiveSummary,
  selectTodayDashboard,
  selectTodayStreak,
} from "../../core/dashboard/dashboardSelectors.js";
import { formatDays } from "../../lib/formatters.js";
import { selectDismissedBannerDay } from "./todaySlice.js";

export { selectActiveHiveSummary };

export const selectTodayBanner = createSelector(
  [selectTodayDashboard, selectTodayStreak, selectDismissedBannerDay],
  (dashboard, streak, dismissedDay) => {
    if (!dashboard || !streak || dismissedDay === dashboard.today) return null;
    if (streak.lostYesterday > 0) {
      return {
        tone: "wing",
        text: `Tu racha de ${formatDays(streak.lostYesterday)} descansó ayer. Tu mejor racha sigue siendo de ${formatDays(streak.best)}: hoy empieza otra.`,
      };
    }
    if (streak.reserveUsedYesterday) {
      return {
        tone: "wax",
        text: "Ayer usaste una reserva de miel: tu racha sigue intacta.",
      };
    }
    return null;
  },
);
