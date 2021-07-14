import React from "react";
import { render, screen } from "@testing-library/react";
import { Heroes } from "../Main/Heroes";
import { GameContext } from "../App";
import userEvent from "@testing-library/user-event";
import { GameState } from "../utils/types";

const gameState = {
  sceneCharacters: [
    { id: "maya", name: "Maya", image: "../img/maya.png", state: "story" },
    { id: "tara", name: "Tara", image: "../img/tara.png", state: "story" },
  ],
  dialogues: [],
  player: {
    id: 1,
    cards: [],
    experience: 300,
    lifes: 3,
    heroes: ["maya", "tara", "nell", "dart", "grey"].map((s: string) => ({
      id: s,
      selected: false,
      name: "",
      image: "",
    })),
    resources: [
      { id: "iron", name: "Iron", image: "../", commonality: 5, quantity: 1 },
    ],
  },
  adventures: [],
  heroes: [],
};

const context = {
  adventure: null,
  setAdventure: jest.fn(),
  story: null,
  setStory: jest.fn(),
  gameState: gameState,
  dialogue: null,
  setDialogue: jest.fn(),
  setGameState: jest.fn((s: GameState) => s),
  backToMain: jest.fn(),
  backToStory: jest.fn(),
};

test("Renders Heroes screen with characters ready for a dialogue", () => {
  render(
    <GameContext.Provider value={context}>
      <Heroes />
    </GameContext.Provider>
  );
  expect(screen.getByAltText("heroes_background")).toBeInTheDocument();
  expect(screen.getByAltText("hero_maya")).toBeInTheDocument();
  expect(screen.getByAltText("hero_tara")).toBeInTheDocument();
  expect(screen.getByAltText("hero_nell")).toBeInTheDocument();
  expect(screen.getByAltText("hero_dart")).toBeInTheDocument();
  expect(screen.getByAltText("hero_grey")).toBeInTheDocument();
  // First character selects correctly
  userEvent.click(screen.getByAltText("hero_maya"));
  expect(
    context.setGameState.mock.calls[0][0].player.heroes[0].selected
  ).toBeTruthy();
  // Two following characters selects correctly
  userEvent.click(screen.getByAltText("hero_tara"));
  userEvent.click(screen.getByAltText("hero_nell"));
  expect(
    context.setGameState.mock.calls[0][0].player.heroes[0].selected
  ).toBeTruthy();
  expect(
    context.setGameState.mock.calls[0][0].player.heroes[1].selected
  ).toBeTruthy();
  expect(
    context.setGameState.mock.calls[0][0].player.heroes[2].selected
  ).toBeTruthy();

  // Auto unselect works if there are 3 characters already
  userEvent.click(screen.getByAltText("hero_dart"));
  expect(
    context.setGameState.mock.calls[0][0].player.heroes[3].selected
  ).toBeTruthy();
  expect(
    context.setGameState.mock.calls[0][0].player.heroes[0].selected
  ).not.toBeTruthy();

  // Manual unselect works when clicking
  userEvent.click(screen.getByAltText("hero_dart"));
  expect(
    context.setGameState.mock.calls[0][0].player.heroes[3].selected
  ).not.toBeTruthy();
});