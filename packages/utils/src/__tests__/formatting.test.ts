import { formatDecimalPtBr, formatProgress, toPercent, clampRatio, formatNumberPtBr } from "../formatting";

describe("formatDecimalPtBr", () => {
  it("replaces the dot with a comma", () => {
    expect(formatDecimalPtBr(1.4)).toBe("1,4");
  });
});

describe("formatProgress", () => {
  it("formats a water-style progress with unit", () => {
    expect(formatProgress(1.4, 2, "L")).toBe("1,4 / 2 L");
  });

  it("formats an integer progress without decimals", () => {
    expect(formatProgress(64, 100, "reps")).toBe("64 / 100 reps");
  });

  it("omits the unit suffix when not provided", () => {
    expect(formatProgress(1, 1)).toBe("1 / 1");
  });
});

describe("clampRatio", () => {
  it("clamps values outside 0..1", () => {
    expect(clampRatio(-0.5)).toBe(0);
    expect(clampRatio(1.5)).toBe(1);
    expect(clampRatio(0.42)).toBe(0.42);
  });

  it("treats NaN as 0", () => {
    expect(clampRatio(Number.NaN)).toBe(0);
  });
});

describe("toPercent", () => {
  it("rounds to the nearest integer percentage", () => {
    expect(toPercent(0.583)).toBe(58);
    expect(toPercent(1)).toBe(100);
  });
});

describe("formatNumberPtBr", () => {
  it("uses pt-BR thousands separators", () => {
    expect(formatNumberPtBr(1340)).toBe("1.340");
  });
});
