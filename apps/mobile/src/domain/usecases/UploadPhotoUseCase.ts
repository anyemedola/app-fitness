import type { ProgressResult } from "../entities/Challenge";
import type { ChallengeRepository } from "../repositories/ChallengeRepository";
import type { PhotoStorageRepository } from "../repositories/PhotoStorageRepository";

/** Uploads a proof photo to Storage, then reports the resulting URL to the challenge (e.g. "Salada em 1 refeição"). */
export class UploadPhotoUseCase {
  constructor(
    private readonly challenges: ChallengeRepository,
    private readonly photoStorage: PhotoStorageRepository,
  ) {}

  async execute(userId: string, challengeId: string, localUri: string): Promise<ProgressResult> {
    const photoUrl = await this.photoStorage.upload(userId, challengeId, localUri);
    return this.challenges.uploadPhoto(challengeId, photoUrl);
  }
}
