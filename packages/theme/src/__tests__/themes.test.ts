import { darkTheme } from "../darkTheme";
import { lightTheme } from "../lightTheme";

describe("theme parity", () => {
  it("light and dark themes expose the same color keys", () => {
    expect(Object.keys(lightTheme.colors).sort()).toEqual(Object.keys(darkTheme.colors).sort());
  });

  it("share the same accent (brand color is constant across schemes)", () => {
    expect(lightTheme.colors.accent).toBe(darkTheme.colors.accent);
    expect(lightTheme.colors.accentInk).toBe(darkTheme.colors.accentInk);
  });

  it("flags dark/light correctly", () => {
    expect(lightTheme.dark).toBe(false);
    expect(darkTheme.dark).toBe(true);
  });

  it("share identical spacing/radius/typography tokens", () => {
    expect(lightTheme.spacing).toEqual(darkTheme.spacing);
    expect(lightTheme.radius).toEqual(darkTheme.radius);
    expect(lightTheme.typography).toEqual(darkTheme.typography);
  });
});
