// UEFA Champions League league phase (2024/25 format, 36 teams).
// ponytail: zones follow table position only; ties on the boundary are not broken by UEFA tie-break rules.
export const ZONES = [
  { key: "r16", label: "Lolos ke babak 16 besar", from: 1, to: 8 },
  { key: "playoff", label: "Babak playoff fase gugur", from: 9, to: 24 },
  { key: "out", label: "Tersingkir", from: 25, to: Infinity },
];

export const zoneForRank = (rank) => ZONES.find((z) => rank >= z.from && rank <= z.to);
