import type { Group, Member } from "../../domain/entities";

/**
 * Placeholder group/member directory, ported from the design reference's mock data
 * (`data.jsx`). The requested backend endpoints only cover challenges/progress/stats —
 * there's no groups/members API yet, so this stands in until one exists. Swap
 * `LocalGroupRepository` for an `HttpGroupRepository` once that API is added.
 */
export const MEMBERS: Record<string, Member> = {
  lia: { id: "lia", name: "Lia", initials: "LM", hue: 130, streak: 12, points: 940 },
  bruno: { id: "bruno", name: "Bruno", initials: "BR", hue: 25, streak: 5, points: 1120 },
  marina: { id: "marina", name: "Marina", initials: "MA", hue: 250, streak: 21, points: 1340 },
  teo: { id: "teo", name: "Téo", initials: "TÉ", hue: 300, streak: 0, points: 610 },
  julia: { id: "julia", name: "Júlia", initials: "JÚ", hue: 200, streak: 8, points: 880 },
  rafa: { id: "rafa", name: "Rafa", initials: "RA", hue: 60, streak: 3, points: 540 },
  camila: { id: "camila", name: "Camila", initials: "CA", hue: 340, streak: 16, points: 1020 },
  diego: { id: "diego", name: "Diego", initials: "DI", hue: 160, streak: 1, points: 470 },
};

export const GROUPS: Group[] = [
  {
    id: "suor",
    name: "Suor & Risadas",
    emoji: "🔥",
    memberIds: ["lia", "bruno", "marina", "teo", "julia", "rafa", "camila", "diego"],
    activeChallenges: 5,
    todayPct: 0.62,
  },
  {
    id: "firma",
    name: "Time da Firma",
    emoji: "💼",
    memberIds: ["lia", "bruno", "marina", "julia", "rafa", "camila", "diego", "teo"],
    activeChallenges: 3,
    todayPct: 0.4,
  },
  {
    id: "verao",
    name: "Projeto Verão",
    emoji: "🌊",
    memberIds: ["lia", "marina", "camila", "julia", "bruno"],
    activeChallenges: 2,
    todayPct: 0.8,
  },
];

export function getMember(id: string): Member | undefined {
  return MEMBERS[id];
}

export const BADGES = [
  { id: "b1", icon: "flame", label: "Sequência de 12", earned: true },
  { id: "b2", icon: "drop", label: "Hidratado 7 dias", earned: true },
  { id: "b3", icon: "leaf", label: "Rei da salada", earned: true },
  { id: "b4", icon: "trophy", label: "Top 3 da semana", earned: true },
  { id: "b5", icon: "dumbbell", label: "500 flexões", earned: false },
  { id: "b6", icon: "medal", label: "30 dias seguidos", earned: false },
] as const;
