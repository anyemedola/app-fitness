export type ChallengeKind = "WATER" | "PHOTO" | "COUNT" | "STREAK" | "YESNO";
export type ChallengeCadence = "DAILY" | "WEEKLY" | "STREAK";

/** A challenge as relevant to the current user: definition + their current-period progress. */
export interface Challenge {
  id: string;
  groupId: string;
  title: string;
  description: string | null;
  kind: ChallengeKind;
  cadence: ChallengeCadence;
  unit: string | null;
  target: number;
  requirePhoto: boolean;
  value: number;
  periodKey: string;
}

export interface ProgressResult {
  value: number;
  periodKey: string;
  photoUrl?: string | null;
}
