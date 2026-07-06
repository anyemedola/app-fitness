import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function buildCredential() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and " +
        "FIREBASE_PRIVATE_KEY (see .env.example) — these come from a service account JSON " +
        "downloaded in the Firebase console under Project settings > Service accounts.",
    );
  }
  return cert({ projectId, clientEmail, privateKey });
}

/** Verifies a Firebase Auth ID token, returning the caller's UID. Lazily initializes the Admin SDK. */
export async function verifyFirebaseIdToken(idToken: string): Promise<{ uid: string }> {
  if (!getApps().length) {
    initializeApp({ credential: buildCredential() });
  }
  const decoded = await getAuth().verifyIdToken(idToken);
  return { uid: decoded.uid };
}
