import React from "react";
import { render, screen } from "@testing-library/react";
import { GameContext, GameContextType } from "../App";
import {
  baseCards15,
  dialogues,
  dialstory,
  element,
} from "../utils/test_gameobjects";
import userEvent from "@testing-library/user-event";
import { Dialogue } from "../Dialogues/Dialogue";
import {
  dialogueLayout,
  colorType,
  ISpell,
  storyChangeType,
  schoolType,
  GameState,
} from "../utils/types";
import { gameState, testAdventure } from "../utils/test_states";

const context: GameContextType = {
  adventure: testAdventure,
  setAdventure: jest.fn(),
  story: dialstory,
  setStory: jest.fn(),
  gameState: gameState,
  addition: null,
  setAdditionScreen: jest.fn(),
  setGameState: jest.fn(),
  backToMain: jest.fn(),
};

test("Renders dialogue page", async () => {
  render(
    <GameContext.Provider value={context}>
      <Dialogue dialogue={dialogues[0]} setDialogue={jest.fn()} />
    </GameContext.Provider>
  );
  expect(screen.getByLabelText("dialogue-screen")).toBeInTheDocument();
  expect(screen.getByLabelText("character_image_maya")).toBeInTheDocument();
  expect(screen.getByLabelText("dialogue_line_0")).toBeInTheDocument();
  userEvent.click(screen.getByLabelText("dialogue_line_0"));
  expect(
    screen.queryByAltText("character_image_olija")
  ).not.toBeInTheDocument();
  expect(screen.getByLabelText("character_image_maya")).toBeInTheDocument();
  expect(screen.getByLabelText("dialogue_line_0")).toBeInTheDocument();
});

test("Renders dialogue page and triggers Character screen", async () => {
  const setAdditionScreen = jest.fn();
  const nellSpells: ISpell[] = new Array(6).fill(0).map((x, n) => ({
    ...baseCards15[0],
    id: "some" + n,
    name: "Some Hit " + n,
    color: "red",
  }));
  const newGameState: GameState = {
    ...gameState,
    player: {
      ...gameState.player,
      heroes: [
        {
          element: element,
          id: "maya",
          name: "Maya",
          selected: true,
          description: "some",
          created_at: new Date(),
        },
      ],
    },
    game: {
      ...gameState.game,
      spells: gameState.game.spells.concat(nellSpells),
    },
  };
  const newContext = {
    ...context,
    gameState: newGameState,
    story: {
      ...dialstory,
      action: [{ type: "addHero" as storyChangeType, id: "nell", data: "red" }],
    },
    setAdditionScreen: setAdditionScreen,
  };
  const newDialogue = {
    ...dialogues[0],
    layout: "double" as dialogueLayout,
    lines: dialogues[0].lines.concat({
      id: "id1",
      character: "tara",
      image: "excited",
      position: "R",
      text: "test",
    }),
  };
  render(
    <GameContext.Provider value={newContext}>
      <Dialogue dialogue={newDialogue} setDialogue={jest.fn()} />
    </GameContext.Provider>
  );
  expect(screen.getByLabelText("dialogue-screen")).toBeInTheDocument();
  expect(screen.getByLabelText("character_image_maya")).toBeInTheDocument();
  expect(screen.getByLabelText("dialogue_line_0")).toBeInTheDocument();
  userEvent.click(screen.getByLabelText("dialogue_line_0"));
  userEvent.click(screen.getByLabelText("dialogue_line_1"));
  expect(setAdditionScreen.mock.calls.length).toBe(1);
});
