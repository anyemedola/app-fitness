export interface PhotoStorageRepository {
  /** Uploads a local photo (file:// / content:// URI) and returns its public URL. */
  upload(userId: string, challengeId: string, localUri: string): Promise<string>;
}
