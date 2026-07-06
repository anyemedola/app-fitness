import { screen } from "@testing-library/react-native";
import React from "react";

import { renderWithTheme } from "../../../test-utils";
import { ProgressBar } from "../index";

describe("ProgressBar", () => {
  it("renders the fill width proportional to the value", () => {
    renderWithTheme(<ProgressBar value={0.5} testID="bar" />);
    const fill = screen.getByTestId("bar-fill");
    const flatStyle = Object.assign({}, ...[fill.props.style].flat());
    expect(flatStyle.width).toBe("50%");
  });

  it("clamps values above 1 to 100%", () => {
    renderWithTheme(<ProgressBar value={1.4} testID="bar" />);
    const flatStyle = Object.assign({}, ...[screen.getByTestId("bar-fill").props.style].flat());
    expect(flatStyle.width).toBe("100%");
  });

  it("clamps negative values to 0%", () => {
    renderWithTheme(<ProgressBar value={-0.2} testID="bar" />);
    const flatStyle = Object.assign({}, ...[screen.getByTestId("bar-fill").props.style].flat());
    expect(flatStyle.width).toBe("0%");
  });
});
