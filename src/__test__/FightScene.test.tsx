import React from "react";
import { act, render, screen } from "@testing-library/react";
import { FightScene } from "../Fight/FightScene";
import { fightState } from "../utils/teststates";
import userEvent from "@testing-library/user-event";

const SHORTANIMATION = 500;
const LONGANIMATION = 1500;

afterEach(() => {
  jest.useRealTimers();
});

test("Renders FightScene screen and follows though the flow", async () => {
  const setInfo = jest.fn();
  const setResult = jest.fn();
  const prefightState = { ...fightState };
  jest.useFakeTimers();

  render(
    <FightScene
      prefightState={prefightState}
      setInfo={setInfo}
      setResult={setResult}
    />
  );
  expect(screen.getByLabelText("animation-GIVECARDS")).toBeInTheDocument();

  act(() => {
    jest.advanceTimersByTime(LONGANIMATION);
  });
  expect(screen.getByLabelText("animation-ELEMENT")).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(SHORTANIMATION);
  });
  expect(screen.getByLabelText("animation-ENEMYACT")).toBeInTheDocument();
  userEvent.click(screen.getAllByLabelText("spell_card_border")[0]);
  expect(screen.getByLabelText("animation-HEROACT")).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(SHORTANIMATION);
  });
  expect(screen.getByLabelText("animation-FIGHT")).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(SHORTANIMATION);
  });
  expect(screen.getByLabelText("animation-ACTIONEND")).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(SHORTANIMATION);
  });
  expect(screen.getByLabelText("animation-GIVECARD")).toBeInTheDocument();
  jest.clearAllTimers();
  jest.useRealTimers();
});

test("Renders FightScene screen and wins", async () => {
  const setInfo = jest.fn();
  const setResult = jest.fn();
  const prefightState = { ...JSON.parse(JSON.stringify(fightState)) };
  prefightState.enemyDeck.shift();
  jest.useFakeTimers();

  render(
    <FightScene
      prefightState={prefightState}
      setInfo={setInfo}
      setResult={setResult}
    />
  );
  expect(screen.getByLabelText("animation-GIVECARDS")).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(LONGANIMATION);
  });
  act(() => {
    jest.advanceTimersByTime(SHORTANIMATION);
  });
  expect(screen.getByLabelText("animation-ENEMYACT")).toBeInTheDocument();
  userEvent.click(screen.getAllByLabelText("spell_card_border")[1]);
  expect(screen.getByLabelText("animation-HEROACT")).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(SHORTANIMATION);
  });
  act(() => {
    jest.advanceTimersByTime(SHORTANIMATION);
  });
  expect(screen.getByLabelText("animation-FIGHT")).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(SHORTANIMATION);
  });
  expect(screen.getByLabelText("animation-ACTIONEND")).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(SHORTANIMATION);
  });
  expect(screen.getByLabelText("animation-WON")).toBeInTheDocument();
  jest.clearAllTimers();
  jest.useRealTimers();
});
