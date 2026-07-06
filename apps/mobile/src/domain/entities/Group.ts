export interface Group {
  id: string;
  name: string;
  emoji: string;
  memberIds: string[];
  activeChallenges: number;
  todayPct: number;
}
