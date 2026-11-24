export const isStandaloneApp = () =>
  typeof window !== "undefined" &&
  Boolean(window.matchMedia?.("(display-mode: standalone)").matches);

export const supportsWebInstall = () =>
  typeof Navigator !== "undefined" && typeof Navigator.prototype.install === "function";
