import React from "react";
import { render, screen } from "@testing-library/react";
import { Shop } from "../Main/Shop";
import { GameContext, GameContextType } from "../App";
import { gameState } from "../utils/test_states";

const context: GameContextType = {
  adventure: null,
  setAdventure: jest.fn(),
  story: null,
  setStory: jest.fn(),
  gameState: gameState,
  addition: null,
  setAdditionScreen: jest.fn(),
  setGameState: jest.fn(),
  backToMain: jest.fn(),
};

test("Renders College with a background", async () => {
  render(
    <GameContext.Provider value={context}>
      <Shop />
    </GameContext.Provider>
  );
  expect(screen.getByLabelText("shop_background")).toBeInTheDocument();
});
