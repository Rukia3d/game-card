import React, { useState } from "react";
import { enemyAttack, getNextElement, updateDecks } from "../utils/fightlogic";
import { elementType, Enemy, FightState, Spell } from "../utils/types";
import { BigCard } from "./BigCard";
import { EnemyBlock } from "./EnemyBlock";
import "./Fight.css";
import { HeroBlock } from "./HeroBlock";

const SHORTANIMATION = 500;
const LONGANIMATION = 1500;

export const BigCardsBlock = ({
  enemyCard,
  heroCard,
  element,
  setInfo,
}: {
  enemyCard: Spell | null;
  heroCard: Spell | null;
  element: elementType;
  setInfo: (s: null | Spell | Enemy) => void;
}) => {
  return (
    <>
      {enemyCard ? (
        <BigCard card={enemyCard} setInfo={setInfo} element={element} />
      ) : null}
      {enemyCard && heroCard ? (
        <BigCard card={heroCard} setInfo={setInfo} element={element} />
      ) : null}
    </>
  );
};

export const FightScene = ({
  prefightState,
  setInfo,
  setResult,
}: {
  prefightState: FightState;
  setInfo: (s: null | Spell | Enemy) => void;
  setResult: (r: null | String) => void;
}) => {
  const [fightState, setfightState] = useState<FightState>(prefightState);
  const [firstAction, setFirstAction] = useState(true);
  const [enemyCard, setEnemyCard] = useState<Spell | null>(null);
  const [heroCard, setHeroCard] = useState<Spell | null>(null);
  const [animation, setAnimation] = useState<String | null>(null);

  const startFight = () => {
    if (fightState.hero.life <= 0) {
      setAnimation("LOST");
      setTimeout(() => {
        setResult("Lost");
      }, SHORTANIMATION);
      return;
    }
    if (fightState.enemyDeck.length <= 1) {
      setAnimation("WON");
      setTimeout(() => {
        setResult("Won");
      }, SHORTANIMATION);
      return;
    }
    const newElement = getNextElement(fightState.elements, fightState.element);
    setfightState((newstate) => ({
      ...newstate,
      element: newElement,
    }));
    setAnimation(`ELEMENT`);
    setTimeout(() => {
      enemyAct(0);
    }, SHORTANIMATION);
  };

  const enemyAct = (index: number) => {
    if (fightState.enemyDeck.length === index)
      throw new Error("Enemy Deck is empty");
    setEnemyCard(fightState.enemyDeck[index]);
    setAnimation(`ENEMYACT`);
    setfightState((newstate) => ({
      ...newstate,
      enemyCardIndex: 0,
    }));
  };

  const heroAct = (index: number) => {
    if (fightState.enemyCardIndex === null) {
      console.warn("You are acting first");
      return;
    }
    if (fightState.heroCardIndex !== null) {
      console.warn("Card already selected");
      return;
    }
    setHeroCard(fightState.heroDeck[index]);
    setfightState((newstate) => ({
      ...newstate,
      heroCardIndex: index,
    }));
    setAnimation(`HEROACT`);
    setTimeout(() => {
      matchCards();
    }, SHORTANIMATION);
  };

  const matchCards = () => {
    setfightState((newstate) => {
      return enemyAttack(newstate);
    });
    setAnimation(`FIGHT`);
    setTimeout(() => {
      actionEnd();
    }, SHORTANIMATION);
  };

  const actionEnd = () => {
    setHeroCard(null);
    setEnemyCard(null);
    setfightState((newstate) => {
      return updateDecks(newstate);
    });
    setAnimation(`ACTIONEND`);
    setTimeout(() => {
      updateCards();
    }, SHORTANIMATION);
  };

  const updateCards = () => {
    setAnimation(`GIVECARD`);
    setfightState((newstate) => ({
      ...newstate,
      enemyCardIndex: null,
      heroCardIndex: null,
    }));

    setTimeout(() => {
      startFight();
    }, SHORTANIMATION);
  };

  if (firstAction) {
    setAnimation(`GIVECARDS`);
    setTimeout(() => {
      startFight();
    }, LONGANIMATION);
    setFirstAction(false);
  }
  const tempStyle = {
    position: "absolute" as "absolute",
    top: "20px",
    left: "20px",
    zIndex: 50000,
  };

  return (
    <>
      <div className="Animation" style={tempStyle}>
        <h1>{animation}</h1>
      </div>
      <BigCardsBlock
        enemyCard={enemyCard}
        heroCard={heroCard}
        element={fightState.element}
        setInfo={setInfo}
      />
      <EnemyBlock
        fightState={fightState}
        enemyAct={enemyAct}
        setInfo={setInfo}
      />
      <HeroBlock
        fightState={fightState}
        selectCard={heroAct}
        setInfo={setInfo}
      />
    </>
  );
};
