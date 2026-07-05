/** pt-BR oriented formatting helpers shared by mobile and backend. */

/** Formats a decimal using a comma instead of a dot, e.g. 1.4 -> "1,4". */
export function formatDecimalPtBr(value: number): string {
  return value.toString().replace(".", ",");
}

/** Formats a water-type challenge progress, e.g. (1.4, 2, "L") -> "1,4 / 2 L". */
export function formatProgress(value: number, target: number, unit?: string): string {
  const v = Number.isInteger(value) ? String(value) : formatDecimalPtBr(value);
  const suffix = unit ? ` ${unit}` : "";
  return `${v} / ${target}${suffix}`;
}

/** Formats an integer count of points/reps using pt-BR thousand separators. */
export function formatNumberPtBr(value: number): string {
  return value.toLocaleString("pt-BR");
}

/** Clamps a ratio between 0 and 1, useful for progress bars/rings. */
export function clampRatio(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

/** Rounds a percentage (0..1) to the nearest integer, e.g. 0.583 -> 58. */
export function toPercent(ratio: number): number {
  return Math.round(clampRatio(ratio) * 100);
}
