import { MAX_PAUSE_DAYS } from "@panal/contratos";
import { addDays } from "@panal/motor";
import { createSelector } from "@reduxjs/toolkit";
import { selectMe, selectProgress } from "../../store/api.js";

export const selectProfileRank = createSelector(
  [selectProgress],
  (progress) => progress?.rank ?? null,
);

const isCandidateBadge = (badge) => !badge.earned && badge.available && !badge.secret;

export const selectProfileBadges = createSelector([selectProgress], (progress) => {
  const badges = progress?.badges ?? [];
  const nextBadge = badges
    .filter(isCandidateBadge)
    .reduce(
      (best, badge) =>
        best && best.current / best.goal >= badge.current / badge.goal ? best : badge,
      null,
    );

  return {
    list: badges.map((badge) => ({
      ...badge,
      isNext: badge.id === nextBadge?.id,
      isHidden: Boolean(badge.secret && !badge.earned),
      progressRatio: isCandidateBadge(badge) && badge.goal > 1 ? badge.current / badge.goal : null,
    })),
    earnedCount: badges.filter((badge) => badge.earned).length,
    totalCount: badges.length,
  };
});

export const selectProfileSettings = createSelector([selectMe], (me) => {
  if (!me) return null;
  const nextGoal = me.nextGoal && me.nextGoal !== me.dailyGoal ? me.nextGoal : null;
  return {
    name: me.name,
    dailyGoal: me.dailyGoal,
    nextGoal,
    selectedGoal: nextGoal ?? me.dailyGoal,
    restDay: me.restDay,
    pausePeriod: me.pausePeriod,
    timeZone: me.timeZone,
  };
});

export const selectProfilePause = createSelector([selectMe, selectProgress], (me, progress) => {
  const today = progress?.today ?? me?.today;
  if (!me || !today) return null;
  const activeUntil = me.pausePeriod && me.pausePeriod.to >= today ? me.pausePeriod.to : null;
  return {
    today,
    activeUntil,
    proposedUntil: addDays(today, 6),
    maxUntil: addDays(today, MAX_PAUSE_DAYS - 1),
  };
});

export const selectProfileTotals = createSelector([selectProgress], (progress) =>
  progress ? { drops: progress.drops, streak: progress.streak } : null,
);
