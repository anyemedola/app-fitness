import type { Challenge, ChallengeCadence, ChallengeKind, ProgressResult } from "../entities/Challenge";

export interface CheckResult {
  qualified?: boolean;
  entry: ProgressResult | null;
}

export interface CreateChallengeInput {
  groupId: string;
  title: string;
  description?: string;
  kind: ChallengeKind;
  cadence: ChallengeCadence;
  unit?: string;
  target: number;
  requirePhoto?: boolean;
}

export interface ChallengeRepository {
  getToday(groupId?: string): Promise<Challenge[]>;
  addProgress(challengeId: string, delta: number): Promise<ProgressResult>;
  uploadPhoto(challengeId: string, photoUrl: string): Promise<ProgressResult>;
  check(challengeId: string, completedAt?: Date): Promise<CheckResult>;
  create(input: CreateChallengeInput): Promise<Challenge>;
}
