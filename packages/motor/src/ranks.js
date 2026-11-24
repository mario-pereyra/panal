export const RANKS = [
  { level: 1, minDrops: 0, name: "Novata" },
  { level: 2, minDrops: 100, name: "Nodriza" },
  { level: 3, minDrops: 250, name: "Cerera" },
  { level: 4, minDrops: 450, name: "Exploradora" },
  { level: 5, minDrops: 700, name: "Recolectora" },
  { level: 6, minDrops: 1000, name: "Almacenera" },
  { level: 7, minDrops: 1400, name: "Guardiana" },
  { level: 8, minDrops: 1900, name: "Danzante" },
  { level: 9, minDrops: 2500, name: "Arquitecta" },
  { level: 10, minDrops: 3200, name: "Maestra del panal" },
];

export function getRank(drops) {
  const total = Math.max(0, Math.floor(drops));
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (total >= rank.minDrops) current = rank;
  }
  const next = RANKS[current.level] ?? null;
  return {
    level: current.level,
    name: current.name,
    drops: total,
    nextName: next ? next.name : null,
    remainingDrops: next ? next.minDrops - total : 0,
    progress: next ? (total - current.minDrops) / (next.minDrops - current.minDrops) : 1,
  };
}
