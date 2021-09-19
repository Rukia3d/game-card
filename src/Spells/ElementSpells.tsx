import React, { useContext, useState } from "react";
import "./ElementSpells.css";

import { CloseButton } from "../UI/CloseButton";

import { elementType, Spell } from "../utils/types";
import { InfoCard } from "../UI/InfoCard";
import { GameContext } from "../App";
import { changeCardsInDeck } from "../utils/gamelogic";
import { ElementSpellWithInfo } from "./ElementSpellWithInfo";
import { ElementSpellLibrary } from "./ElementSpellLibrary";

export const ElementSpells = ({
  element,
  spells,
  setElement,
}: {
  element: elementType;
  spells: Spell[];
  setElement: (s: elementType | null) => void;
}) => {
  const context = useContext(GameContext);
  if (
    !context ||
    !context.gameState ||
    !context.setGameState ||
    !context.gameState.player ||
    !context.gameState.player.spells
  ) {
    throw new Error("No data");
  }
  const player = context.gameState.player;
  const playerCards = context.gameState.player.spells;
  const gameState = context.gameState;
  const [info, setInfo] = useState<null | Spell>(null);
  const [forge, setForge] = useState<null | Spell>(null);

  const selectCard = (s: Spell) => {
    const newPlayerCards = changeCardsInDeck(playerCards, s);
    const newPlayer = { ...player, cards: newPlayerCards };
    context.setGameState({ ...gameState, player: newPlayer });
  };
  return (
    <div className="ElementSpells">
      <h1>{`${element.charAt(0).toUpperCase() + element.slice(1)} spells`}</h1>
      <CloseButton onClick={() => setElement(null)} />
      {info ? <InfoCard item={info} setInfo={setInfo} /> : null}
      {forge ? <ElementSpellLibrary item={forge} setForge={setForge} /> : null}
      <div className="ElementSpellsList" aria-label="character_spells">
        {spells.map((c: Spell, i: number) => (
          <ElementSpellWithInfo
            forge
            key={i}
            selectCard={selectCard}
            setInfo={setInfo}
            element={c.element}
            card={c}
            setForge={setForge}
          />
        ))}
      </div>
    </div>
  );
};
