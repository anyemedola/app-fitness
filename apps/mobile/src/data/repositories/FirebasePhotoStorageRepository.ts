import { uploadChallengePhoto } from "@app-fitness/firebase";

import type { PhotoStorageRepository } from "../../domain/repositories/PhotoStorageRepository";

export class FirebasePhotoStorageRepository implements PhotoStorageRepository {
  upload(userId: string, challengeId: string, localUri: string): Promise<string> {
    return uploadChallengePhoto(userId, challengeId, localUri);
  }
}
