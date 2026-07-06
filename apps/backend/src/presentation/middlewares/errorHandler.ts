import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

/** Converts thrown use-case/repository/validation errors into JSON responses instead of Express's HTML default. */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({ error: "Invalid request body", issues: err.issues });
    return;
  }

  const message = err instanceof Error ? err.message : "Unexpected error";
  const notFound = /not found/i.test(message);
  const badInput = /must be|is required|does not support/i.test(message);
  const status = notFound ? 404 : badInput ? 400 : 500;
  res.status(status).json({ error: message });
}
