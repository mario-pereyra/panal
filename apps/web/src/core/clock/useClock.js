import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { syncClock } from "./clockSlice.js";

const TICK_INTERVAL_MS = 30_000;

export function useClockSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    const tick = () => dispatch(syncClock(Date.now()));
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") tick();
    };
    const intervalId = setInterval(tick, TICK_INTERVAL_MS);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dispatch]);
}
