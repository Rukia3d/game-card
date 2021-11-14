import React, { useContext, useEffect, useState } from "react";
import "../Main/Heroes.css";
// Types
import { herosSelectionError, IFight, IHero, IStory } from "../utils/types";
import { HeroesSelection } from "../Heroes/HeroesSelection";
import { GameContext } from "../App";
import {
  checkFightCharactersIds,
  filterActiveCharacters,
} from "../utils/helpers";

// Utils
// Components

const getHeaderText = (error: herosSelectionError) => {
  "Select heroes";
  switch (error) {
    case "none":
      return "No heros selected";
    case "less":
      return "You need more heroes for this fight";
    case "more":
      return "Number of heroes for this fight is limited";
    case "incorrect":
      return "This fight is restricted";
    default:
      return "Select heroes";
  }
};

export const StoryHeroes = ({
  story,
  fight,
  setSelectionError,
}: {
  story: IStory;
  fight: IFight;
  setSelectionError: (s: herosSelectionError) => void;
}) => {
  const context = useContext(GameContext);
  if (!context || !context.gameState || !context.adventure) {
    throw new Error("No data in context");
  }
  const [selected, setSelected] = useState(
    filterActiveCharacters(context.gameState.player.heroes).map((c: IHero) => {
      return c.id;
    })
  );
  const [error, setError] = useState(
    checkFightCharactersIds(fight.characters, selected)
  );

  useEffect(() => {
    if (!context.gameState) return;
    const newActive = filterActiveCharacters(
      context.gameState.player.heroes
    ).map((c: IHero) => {
      return c.id;
    });
    setSelected(newActive);
    setError(checkFightCharactersIds(fight.characters, newActive));
  }, [context.gameState, fight.characters]);

  const checkSelection = () => {
    setSelectionError(null);
    context.setStory(story);
  };

  return (
    <div className="StoryHeroes">
      {error === null ? (
        <button onClick={checkSelection}>Fight</button>
      ) : (
        <h1>{getHeaderText(error)}</h1>
      )}
      <h3>Required heroes: {fight.characters}</h3>
      <HeroesSelection />
    </div>
  );
};
