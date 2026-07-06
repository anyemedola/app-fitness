import type { ChallengeCadence } from "./entities";

/** "YYYY-MM-DD" in UTC — the bucket key for daily/streak/yesno challenges. */
export function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** "YYYY-Www" (ISO 8601 week) — the bucket key for weekly challenges. */
export function isoWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

export function periodKeyFor(cadence: ChallengeCadence, date: Date): string {
  return cadence === "WEEKLY" ? isoWeekKey(date) : dayKey(date);
}

/** The calendar day immediately before `dateKey` ("YYYY-MM-DD" in, "YYYY-MM-DD" out). */
export function previousDayKey(dateKey: string): string {
  const d = new Date(`${dateKey}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return dayKey(d);
}
