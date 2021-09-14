import React from "react";
import { render, screen } from "@testing-library/react";
import { Character } from "../Characters/Character";
import { GameContext } from "../App";
import { characterToAdd, dialogue, gameState } from "../utils/testobjects";

const context = {
  adventure: gameState.adventures[0],
  setAdventure: jest.fn(),
  story: null,
  setStory: jest.fn(),
  gameState: gameState,
  dialogue: dialogue,
  character: characterToAdd,
  setCharacter: jest.fn(),
  setDialogue: jest.fn(),
  setGameState: jest.fn(),
  backToMain: jest.fn(),
  backToStory: jest.fn(),
};

test("Renders Character screen", async () => {
  const fireSpells = [
    {
      id: "base_hit1_fire",
      name: "Fire Hit 1",
      strength: 1,
      element: "fire" as "fire",
      image: "../img/Spells/spell1.jpg",
      selected: true,
      mana: 0,
      owner: "hero" as "hero",
      type: "",
      level: 0,
      description: "",
      updates: [],
    },
  ];
  const newPlayer = {
    ...gameState.player,
    spells: gameState.player.spells.concat(fireSpells),
  };
  const newContext = {
    ...context,
    gameState: { ...context.gameState, player: newPlayer },
  };
  render(
    <GameContext.Provider value={newContext}>
      <Character />
    </GameContext.Provider>
  );
  expect(screen.getByText(/Nell/)).toBeInTheDocument();
  expect(screen.getByText(/joined the party/)).toBeInTheDocument();
  expect(screen.getByText(/New spells/)).toBeInTheDocument();
  expect(screen.getByText(/Fire Hit 1/)).toBeInTheDocument();
  expect(screen.getByText(/New spell updates/)).toBeInTheDocument();
  expect(screen.getByText(/SomeName1/)).toBeInTheDocument();
  expect(screen.getByText(/Some description1/)).toBeInTheDocument();
  expect(screen.getByText(/Ash: 1/)).toBeInTheDocument();
});

test("Throws no character if none provided", async () => {
  jest.spyOn(console, "error").mockImplementation(() => jest.fn());
  const newContext = { ...context, character: null };
  expect(() =>
    render(
      <GameContext.Provider value={newContext}>
        <Character />
      </GameContext.Provider>
    )
  ).toThrow("No data");
  jest.restoreAllMocks();
});

test("Throws incorrectly formatted character if some data is missing", async () => {
  jest.spyOn(console, "error").mockImplementation(() => jest.fn());
  const newContext = {
    ...context,
    character: { ...characterToAdd, element: undefined },
  };
  expect(() =>
    render(
      <GameContext.Provider value={newContext}>
        <Character />
      </GameContext.Provider>
    )
  ).toThrow("Incorrectly formatted character");
  jest.restoreAllMocks();
});