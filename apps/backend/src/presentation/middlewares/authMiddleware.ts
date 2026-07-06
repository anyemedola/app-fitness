import type { NextFunction, Request, RequestHandler, Response } from "express";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export type IdTokenVerifier = (idToken: string) => Promise<{ uid: string }>;

/**
 * Verifies the `Authorization: Bearer <Firebase ID token>` header and attaches `req.userId`.
 * Takes the verifier as a parameter (rather than importing firebase-admin directly) so
 * controllers/tests can inject a fake verifier instead of hitting real Firebase.
 */
export function createAuthMiddleware(verifyIdToken: IdTokenVerifier): RequestHandler {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Missing Authorization: Bearer <token> header" });
      return;
    }
    const token = header.slice("Bearer ".length);
    try {
      const { uid } = await verifyIdToken(token);
      req.userId = uid;
      next();
    } catch {
      res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}
