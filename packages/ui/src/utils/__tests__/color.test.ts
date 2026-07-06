import { hueToColor } from "../color";

describe("hueToColor", () => {
  it("returns a 7-character hex color", () => {
    expect(hueToColor(130)).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("wraps hues outside 0-360", () => {
    expect(hueToColor(490)).toBe(hueToColor(130));
    expect(hueToColor(-10)).toBe(hueToColor(350));
  });

  it("produces different colors for different hues", () => {
    expect(hueToColor(0)).not.toBe(hueToColor(200));
  });
});
