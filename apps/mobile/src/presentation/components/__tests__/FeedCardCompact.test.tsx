import { screen } from "@testing-library/react-native";
import React from "react";

import { renderWithTheme } from "../../../__tests__/testUtils/renderWithTheme";
import { FeedCardCompact } from "../FeedCardCompact";

describe("FeedCardCompact", () => {
  it("renders the author's name and the post text", () => {
    renderWithTheme(
      <FeedCardCompact
        post={{
          id: "f1",
          groupId: "suor",
          authorId: "marina",
          challengeId: "salada",
          kind: "photo",
          text: "Almoço campeão 🥗",
          createdAt: Date.now() - 60_000,
          reactions: {},
        }}
      />,
    );

    expect(screen.getByText("Marina")).toBeTruthy();
    expect(screen.getByText(/Almoço campeão/)).toBeTruthy();
  });

  it("falls back to a placeholder name for unknown authors", () => {
    renderWithTheme(
      <FeedCardCompact
        post={{
          id: "f2",
          groupId: "suor",
          authorId: "unknown-user",
          challengeId: null,
          kind: "join",
          text: "entrou no grupo.",
          createdAt: Date.now(),
          reactions: {},
        }}
      />,
    );

    expect(screen.getByText("Alguém")).toBeTruthy();
  });
});
