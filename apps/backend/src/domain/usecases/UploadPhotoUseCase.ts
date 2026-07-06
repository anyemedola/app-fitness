import type { ProgressEntry } from "../entities";
import { dayKey } from "../period";
import type { ChallengeRepository } from "../repositories/ChallengeRepository";
import type { ProgressRepository } from "../repositories/ProgressRepository";

export interface UploadPhotoInput {
  challengeId: string;
  userId: string;
  /** Public URL of the photo, already uploaded to Firebase Storage by the client. */
  photoUrl: string;
  now?: Date;
}

/** Records a photo check-in for a `PHOTO`-kind challenge (e.g. "Salada em 1 refeição"). */
export class UploadPhotoUseCase {
  constructor(
    private readonly challenges: ChallengeRepository,
    private readonly progress: ProgressRepository,
  ) {}

  async execute(input: UploadPhotoInput): Promise<ProgressEntry> {
    const challenge = await this.challenges.findById(input.challengeId);
    if (!challenge) throw new Error(`Challenge ${input.challengeId} not found`);
    if (challenge.kind !== "PHOTO") {
      throw new Error(`UploadPhotoUseCase does not support challenges of kind ${challenge.kind}`);
    }
    if (!input.photoUrl) throw new Error("photoUrl is required");

    const periodKey = dayKey(input.now ?? new Date());
    return this.progress.upsertEntry({
      challengeId: challenge.id,
      userId: input.userId,
      periodKey,
      value: challenge.target,
      photoUrl: input.photoUrl,
    });
  }
}
