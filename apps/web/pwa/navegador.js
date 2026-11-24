export const abiertaInstalada = () =>
  typeof window !== "undefined" &&
  Boolean(window.matchMedia?.("(display-mode: standalone)").matches);

// `navigator.install()` abre el diálogo de instalación desde la página; sin él
// hace falta el evento `beforeinstallprompt`.
export const conInstalacionWeb = () =>
  typeof Navigator !== "undefined" && typeof Navigator.prototype.install === "function";
