import React from "react";
import { render, screen } from "@testing-library/react";
import { TopMenu } from "../UI/TopMenu";
import { GameContext } from "../App";
import { updateWinPlayer } from "../utils/gamelogic";

const gameState = {
  sceneCharacters: [],
  dialogues: [],
  player: {
    id: 1,
    cards: [],
    experience: 300,
    mana: 3,
    maxMana: 5,
    heroes: [
      {
        id: "maya",
        name: "Maya",
        image: "../img/maya_spells.png",
      },
    ],
    resources: [
      { id: "iron", name: "Iron", image: "../", commonality: 5, quantity: 1 },
    ],
  },
  adventures: [],
};

test("Renders Top menu with high mana", () => {
  render(
    <GameContext.Provider
      value={{
        adventure: null,
        setAdventure: jest.fn(),
        story: null,
        setStory: jest.fn(),
        gameState: { ...gameState, player: { ...gameState.player, mana: 5 } },
        dialogue: null,
        setDialogue: jest.fn(),
        setGameState: jest.fn(),
        backToMain: jest.fn(),
        backToStory: jest.fn(),
      }}
    >
      <TopMenu />
    </GameContext.Provider>
  );
  expect(screen.getByLabelText("mana_icon")).toBeInTheDocument();
  expect(screen.getByLabelText("mana_value")).toBeInTheDocument();
  expect(screen.getByLabelText("mana_value").innerHTML).toEqual("5");
  expect(screen.getByLabelText("mana_value")).toHaveAttribute(
    "style",
    "color: green;"
  );
});

test("Renders Top menu with medium mana", () => {
  render(
    <GameContext.Provider
      value={{
        adventure: null,
        setAdventure: jest.fn(),
        story: null,
        setStory: jest.fn(),
        gameState: gameState,
        dialogue: null,
        setDialogue: jest.fn(),
        setGameState: jest.fn(),
        backToMain: jest.fn(),
        backToStory: jest.fn(),
      }}
    >
      <TopMenu />
    </GameContext.Provider>
  );
  expect(screen.getByLabelText("mana_icon")).toBeInTheDocument();
  expect(screen.getByLabelText("mana_value")).toBeInTheDocument();
  expect(screen.getByLabelText("mana_value").innerHTML).toEqual("3");
  expect(screen.getByLabelText("mana_value")).toHaveAttribute(
    "style",
    "color: orange;"
  );
});

test("Renders Top menu with low mana", () => {
  render(
    <GameContext.Provider
      value={{
        adventure: null,
        setAdventure: jest.fn(),
        story: null,
        setStory: jest.fn(),
        gameState: { ...gameState, player: { ...gameState.player, mana: 1 } },
        dialogue: null,
        setDialogue: jest.fn(),
        setGameState: jest.fn(),
        backToMain: jest.fn(),
        backToStory: jest.fn(),
      }}
    >
      <TopMenu />
    </GameContext.Provider>
  );
  expect(screen.getByLabelText("mana_icon")).toBeInTheDocument();
  expect(screen.getByLabelText("mana_value")).toBeInTheDocument();
  expect(screen.getByLabelText("mana_value").innerHTML).toEqual("1");
  expect(screen.getByLabelText("mana_value")).toHaveAttribute(
    "style",
    "color: red;"
  );
});
