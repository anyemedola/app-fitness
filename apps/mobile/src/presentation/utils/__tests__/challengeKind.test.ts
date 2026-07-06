import { toDomainKind, toUiKind } from "../challengeKind";

describe("challengeKind conversions", () => {
  const pairs: [Parameters<typeof toDomainKind>[0], Parameters<typeof toUiKind>[0]][] = [
    ["water", "WATER"],
    ["photo", "PHOTO"],
    ["count", "COUNT"],
    ["streak", "STREAK"],
    ["yesno", "YESNO"],
  ];

  it.each(pairs)("maps ui kind %s to domain kind %s and back", (uiKind, domainKind) => {
    expect(toDomainKind(uiKind)).toBe(domainKind);
    expect(toUiKind(domainKind)).toBe(uiKind);
  });
});
