export const getDeviceTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
