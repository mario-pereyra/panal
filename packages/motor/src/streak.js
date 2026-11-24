import { addDays } from "./day.js";
import { DROPS } from "./drops.js";

export const MAX_RESERVES = 2;
export const DAYS_PER_MILESTONE = 7;

export function createInitialFlight() {
  return {
    streak: 0,
    best: 0,
    reserves: 1,
    activeDays: 0,
    closedDays: 0,
    consecutiveClosed: 0,
    bestConsecutiveClosed: 0,
    milestones: 0,
    comebacks: 0,
    usedReserves: 0,
    lastReserveDay: null,
    brokenStreakDay: null,
    lostStreak: 0,
    marks: {},
  };
}

function recordMarks(marks, day, conditions) {
  const additions = Object.entries(conditions).filter(([key, met]) => met && !(key in marks));
  return additions.length === 0
    ? marks
    : { ...marks, ...Object.fromEntries(additions.map(([key]) => [key, day])) };
}

export function advanceFlightDay(flight, entry) {
  if (entry.filled > 0) {
    const streak = flight.streak + 1;
    const isMilestone = streak % DAYS_PER_MILESTONE === 0;
    const isComeback = flight.streak === 0 && flight.brokenStreakDay !== null;
    const consecutiveClosed = entry.closed ? flight.consecutiveClosed + 1 : 0;
    return {
      ...flight,
      streak,
      best: Math.max(flight.best, streak),
      reserves: isMilestone ? Math.min(MAX_RESERVES, flight.reserves + 1) : flight.reserves,
      activeDays: flight.activeDays + 1,
      closedDays: flight.closedDays + (entry.closed ? 1 : 0),
      consecutiveClosed,
      bestConsecutiveClosed: Math.max(flight.bestConsecutiveClosed, consecutiveClosed),
      milestones: flight.milestones + (isMilestone ? 1 : 0),
      comebacks: flight.comebacks + (isComeback ? 1 : 0),
      marks: recordMarks(flight.marks, entry.day, {
        firstCell: true,
        firstClose: entry.closed,
        streak7: streak >= 7,
        streak30: streak >= 30,
        streak100: streak >= 100,
        comeback: isComeback,
        sevenClosed: consecutiveClosed >= 7,
      }),
    };
  }

  if (entry.rest || !entry.finished || entry.scheduled === 0) return flight;

  if (flight.streak === 0) return { ...flight, consecutiveClosed: 0 };
  if (flight.reserves > 0) {
    return {
      ...flight,
      reserves: flight.reserves - 1,
      usedReserves: flight.usedReserves + 1,
      lastReserveDay: entry.day,
      consecutiveClosed: 0,
    };
  }
  return {
    ...flight,
    streak: 0,
    brokenStreakDay: entry.day,
    lostStreak: flight.streak,
    consecutiveClosed: 0,
  };
}

export function runFlight(entries, initial = createInitialFlight()) {
  return [...entries].reduce(advanceFlightDay, initial);
}

export function getFlightDrops(flight) {
  return flight.closedDays * DROPS.dailyClose + flight.milestones * DROPS.streakMilestone;
}

export function getTodayStreak(flight, today, todayCounts) {
  const yesterday = addDays(today, -1);
  return {
    current: flight.streak,
    best: flight.best,
    reserves: flight.reserves,
    todayCounts,
    reserveUsedYesterday: flight.lastReserveDay === yesterday,
    lostYesterday: flight.brokenStreakDay === yesterday ? flight.lostStreak : 0,
  };
}
