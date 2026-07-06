import { ThemeProvider } from "@app-fitness/theme";
import { render, type RenderOptions } from "@testing-library/react-native";
import React from "react";

export function renderWithTheme(ui: React.ReactElement, options?: RenderOptions) {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options);
}
