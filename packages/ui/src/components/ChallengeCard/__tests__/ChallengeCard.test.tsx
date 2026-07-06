import { fireEvent, screen } from "@testing-library/react-native";
import React from "react";

import { renderWithTheme } from "../../../test-utils";
import { ChallengeCard } from "../index";

describe("ChallengeCard", () => {
  it("renders the title and progress label", () => {
    renderWithTheme(
      <ChallengeCard
        title="2L de água por dia"
        kind="water"
        icon="drop"
        progress={0.7}
        progressLabel="1,4 / 2 L"
        action={{ label: "+250 ml", onPress: () => {} }}
      />,
    );
    expect(screen.getByText("2L de água por dia")).toBeTruthy();
    expect(screen.getByText("1,4 / 2 L")).toBeTruthy();
    expect(screen.getByText("+250 ml")).toBeTruthy();
  });

  it("calls the row onPress and the action onPress independently", () => {
    const onPress = jest.fn();
    const onAction = jest.fn();
    renderWithTheme(
      <ChallengeCard
        title="100 flexões na semana"
        kind="count"
        icon="dumbbell"
        progress={0.64}
        progressLabel="64 / 100 reps"
        action={{ label: "Registrar", onPress: onAction }}
        onPress={onPress}
      />,
    );
    fireEvent.press(screen.getByText("Registrar"));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();

    fireEvent.press(screen.getByText("100 flexões na semana"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("mutes the action button once done", () => {
    renderWithTheme(
      <ChallengeCard
        title="Treino antes das 8h"
        kind="yesno"
        icon="sun"
        progress={1}
        progressLabel="Feito hoje"
        action={{ label: "Feito", done: true, onPress: () => {} }}
      />,
    );
    expect(screen.getByText("Feito")).toBeTruthy();
  });
});
