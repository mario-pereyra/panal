export const BEE_COLORS = [
  "var(--abeja-1)",
  "var(--abeja-2)",
  "var(--abeja-3)",
  "var(--abeja-4)",
  "var(--abeja-5)",
  "var(--abeja-6)",
];

export const FORMER_MEMBER_COLOR = "var(--lino-borde)";

export function getBeeColor(index = 0) {
  const safeIndex = Math.abs(Number(index) || 0);
  return BEE_COLORS[safeIndex % BEE_COLORS.length];
}

export function getInitial(name = "") {
  return String(name).trim().charAt(0).toUpperCase();
}
