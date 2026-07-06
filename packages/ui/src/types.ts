/** Presentational-only unions shared by the UI kit. Domain layers map their own enums onto these. */

export type ChallengeKind = "water" | "photo" | "count" | "streak" | "yesno";

export type IconName =
  | "home"
  | "groups"
  | "trophy"
  | "user"
  | "plus"
  | "drop"
  | "leaf"
  | "dumbbell"
  | "flame"
  | "sun"
  | "camera"
  | "heart"
  | "comment"
  | "bell"
  | "check"
  | "chevron"
  | "chevronLeft"
  | "target"
  | "medal"
  | "plusCircle"
  | "clock"
  | "send"
  | "lock"
  | "settings"
  | "share";

export interface ChallengeSummary {
  id: string;
  title: string;
  kind: ChallengeKind;
  icon: IconName;
  cadence: string;
  unit?: string;
  target: number;
}
