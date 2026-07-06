import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { getFirebaseStorage } from "./config";

/**
 * Uploads a challenge proof photo (e.g. the "Salada em 1 refeição" check-in) to Storage
 * and returns its public download URL. `localUri` is the `file://`/`content://` URI
 * returned by `expo-image-picker` (see `packages/ui`'s `PhotoUploader`).
 */
export async function uploadChallengePhoto(userId: string, challengeId: string, localUri: string): Promise<string> {
  const response = await fetch(localUri);
  const blob = await response.blob();

  const path = `photos/${userId}/${challengeId}/${Date.now()}.jpg`;
  const storageRef = ref(getFirebaseStorage(), path);
  await uploadBytes(storageRef, blob, { contentType: "image/jpeg" });

  return getDownloadURL(storageRef);
}
