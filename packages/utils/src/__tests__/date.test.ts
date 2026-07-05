import { formatDayHeader, isSameDay, daysBetween, formatRelativeTime, startOfIsoWeek } from "../date";

describe("formatDayHeader", () => {
  it("formats as WEEKDAY · DAY MONTH", () => {
    // Thursday, June 10, 2027 (local time)
    const date = new Date(2027, 5, 10);
    expect(formatDayHeader(date)).toBe("QUI · 10 JUN");
  });
});

describe("isSameDay", () => {
  it("is true for two timestamps on the same calendar day", () => {
    const a = new Date(2027, 5, 10, 8, 0);
    const b = new Date(2027, 5, 10, 23, 59);
    expect(isSameDay(a, b)).toBe(true);
  });

  it("is false across midnight", () => {
    const a = new Date(2027, 5, 10, 23, 59);
    const b = new Date(2027, 5, 11, 0, 1);
    expect(isSameDay(a, b)).toBe(false);
  });
});

describe("daysBetween", () => {
  it("counts whole calendar days", () => {
    const a = new Date(2027, 5, 10);
    const b = new Date(2027, 5, 17);
    expect(daysBetween(a, b)).toBe(7);
  });
});

describe("startOfIsoWeek", () => {
  it("returns the Monday of the current week", () => {
    const thursday = new Date(2027, 5, 10); // Thursday
    const monday = startOfIsoWeek(thursday);
    expect(monday.getDay()).toBe(1);
    expect(monday.getDate()).toBe(7);
  });
});

describe("formatRelativeTime", () => {
  it("labels sub-minute gaps as 'agora'", () => {
    const now = new Date(2027, 5, 10, 12, 0, 30);
    const from = new Date(2027, 5, 10, 12, 0, 0);
    expect(formatRelativeTime(from, now)).toBe("agora");
  });

  it("labels minutes", () => {
    const now = new Date(2027, 5, 10, 12, 12, 0);
    const from = new Date(2027, 5, 10, 12, 0, 0);
    expect(formatRelativeTime(from, now)).toBe("12 min");
  });

  it("labels hours", () => {
    const now = new Date(2027, 5, 10, 14, 0, 0);
    const from = new Date(2027, 5, 10, 12, 0, 0);
    expect(formatRelativeTime(from, now)).toBe("2 h");
  });

  it("labels days", () => {
    const now = new Date(2027, 5, 15, 12, 0, 0);
    const from = new Date(2027, 5, 10, 12, 0, 0);
    expect(formatRelativeTime(from, now)).toBe("5 d");
  });
});
