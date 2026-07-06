export type ChallengeKind = "WATER" | "PHOTO" | "COUNT" | "STREAK" | "YESNO";
export type ChallengeCadence = "DAILY" | "WEEKLY" | "STREAK";

export interface Challenge {
  id: string;
  groupId: string;
  ownerId: string;
  title: string;
  description: string | null;
  kind: ChallengeKind;
  cadence: ChallengeCadence;
  unit: string | null;
  target: number;
  requirePhoto: boolean;
  createdAt: Date;
}
