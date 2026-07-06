import { fireEvent, screen } from "@testing-library/react-native";
import React from "react";

import { renderWithTheme } from "../../../test-utils";
import { Button } from "../index";

describe("Button", () => {
  it("renders its label", () => {
    renderWithTheme(<Button onPress={() => {}}>Lançar desafio</Button>);
    expect(screen.getByText("Lançar desafio")).toBeTruthy();
  });

  it("calls onPress when tapped", () => {
    const onPress = jest.fn();
    renderWithTheme(<Button onPress={onPress}>Entrar</Button>);
    fireEvent.press(screen.getByText("Entrar"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", () => {
    const onPress = jest.fn();
    renderWithTheme(
      <Button onPress={onPress} disabled>
        Entrar
      </Button>,
    );
    fireEvent.press(screen.getByText("Entrar"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("shows a spinner instead of the label while loading", () => {
    renderWithTheme(
      <Button onPress={() => {}} loading>
        Entrar
      </Button>,
    );
    expect(screen.queryByText("Entrar")).toBeNull();
  });
});
