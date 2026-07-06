import type { ChallengeKind as UiChallengeKind } from "@app-fitness/ui";

import type { ChallengeKind as DomainChallengeKind } from "../../domain/entities/Challenge";

/**
 * `packages/ui` uses lowercase kind literals (ported from the design reference's JS mock
 * data), while the backend's Prisma enum — and this app's domain entities — use uppercase.
 * These convert at the presentation boundary so neither layer has to compromise its own
 * natural convention.
 */
const TO_UI: Record<DomainChallengeKind, UiChallengeKind> = {
  WATER: "water",
  PHOTO: "photo",
  COUNT: "count",
  STREAK: "streak",
  YESNO: "yesno",
};

const TO_DOMAIN: Record<UiChallengeKind, DomainChallengeKind> = {
  water: "WATER",
  photo: "PHOTO",
  count: "COUNT",
  streak: "STREAK",
  yesno: "YESNO",
};

export function toUiKind(kind: DomainChallengeKind): UiChallengeKind {
  return TO_UI[kind];
}

export function toDomainKind(kind: UiChallengeKind): DomainChallengeKind {
  return TO_DOMAIN[kind];
}
