import type { ProgressEntry } from "../entities";

export interface UpsertProgressInput {
  challengeId: string;
  userId: string;
  periodKey: string;
  value: number;
  photoUrl?: string | null;
}

export interface ProgressRepository {
  findEntry(challengeId: string, userId: string, periodKey: string): Promise<ProgressEntry | null>;
  upsertEntry(input: UpsertProgressInput): Promise<ProgressEntry>;
}
