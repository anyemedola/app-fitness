import { ThemeProvider } from "@app-fitness/theme";
import { render, type RenderOptions } from "@testing-library/react-native";
import React from "react";

/** Wraps a component under test with the real `ThemeProvider`, matching how the app renders it. */
export function renderWithTheme(ui: React.ReactElement, options?: RenderOptions) {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options);
}
