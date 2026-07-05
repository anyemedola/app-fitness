import { resolveScheme } from "../resolveScheme";

describe("resolveScheme", () => {
  it("returns the explicit preference when it is light or dark", () => {
    expect(resolveScheme("light", "dark")).toBe("light");
    expect(resolveScheme("dark", "light")).toBe("dark");
  });

  it("follows the system scheme when preference is 'system'", () => {
    expect(resolveScheme("system", "dark")).toBe("dark");
    expect(resolveScheme("system", "light")).toBe("light");
  });

  it("falls back to light when system scheme is unknown", () => {
    expect(resolveScheme("system", null)).toBe("light");
    expect(resolveScheme("system", undefined)).toBe("light");
  });
});
