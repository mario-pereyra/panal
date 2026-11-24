export function announce(message, options = {}) {
  if (typeof document === "undefined" || !message) return;
  const delay = typeof options === "number" ? options : (options.delay ?? 0);
  setTimeout(() => {
    if (typeof document.ariaNotify === "function") {
      document.ariaNotify(message);
      return;
    }
    const region = document.getElementById("anuncios");
    if (!region) return;
    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    region.append(paragraph);
    setTimeout(() => paragraph.remove(), 10_000);
  }, delay);
}
