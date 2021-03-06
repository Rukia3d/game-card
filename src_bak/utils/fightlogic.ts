import { removePlayedCard, shuffle } from "./helpers";
import { generateDeck, generateEnemyDeck } from "./prefightloginc";
import {
  FightState,
  colorType,
  ISpellUpdate,
  IHero,
  ISpell,
  IEnemy,
  IPlayerSpellUpdate,
  IPlayerSpell,
  IPlayerHero,
} from "./types";

export const getNextElement = (
  elements: colorType[],
  element: colorType
): colorType => {
  const index = elements.indexOf(element);
  if (index === -1)
    throw new Error("Can't find the element to give you the next one");
  if (index === elements.length - 1) {
    return elements[0];
  }
  return elements[index + 1];
};

export const manaPriceOfUpdates = (updates: ISpellUpdate[]) => {
  let res = 0;
  for (let i = 0; i < updates.length; i++) {
    res = res + updates[i].mana;
  }
  return res;
};

export const heroIsPresent = (
  update: IPlayerSpellUpdate,
  spell: IPlayerSpell,
  heroes: IPlayerHero[]
) => {
  return (
    heroes.filter((h: IPlayerHero) => h.element.school.id === update.school.id)
      .length > 0
  );
};

export const findEnemy = (enemies: IEnemy[], enemyId: string) => {
  const enemy = enemies.find((e: any) => e.id === enemyId);
  if (!enemy) {
    throw new Error("No enemy for this fight, something went very wrong");
  }
  return enemy;
};

export const initFight = (
  storyCharacters: IPlayerHero[],
  spells: IPlayerSpell[],
  enemySpells: IPlayerSpell[]
) => {
  const heroDeck = shuffle(
    generateDeck(
      storyCharacters,
      spells.filter((s: IPlayerSpell) => s.selected)
    )
  );
  if (heroDeck.length === 0) {
    throw new Error(`Couldn't generate cards for player`);
  }
  const enemyDeck = shuffle(generateEnemyDeck(enemySpells));
  if (enemyDeck.length < 1) {
    throw new Error(`Couldn't generate cards for enemy`);
  }

  // TODO Generate the elements correctly
  const elements: colorType[] = shuffle([
    "fire",
    "earth",
    "metal",
    "water",
    "air",
  ]);
  return [heroDeck, enemyDeck, elements];
};

export const updateDecks = (fightState: FightState): FightState => {
  if (fightState.heroCardIndex === null)
    throw new Error("No hero card to play");
  if (fightState.enemyCardIndex === null)
    throw new Error("No enemy card to play");
  const heroCard = fightState.heroHand[fightState.heroCardIndex];
  const enemyCard = fightState.enemyDeck[fightState.enemyCardIndex];
  const [newDeck, newDrop] = updateHeroDeck(fightState, heroCard);
  const newHeroHand = removePlayedCard(
    fightState.heroHand,
    fightState.heroCardIndex
  );
  const newCard = newDeck.shift();
  if (!newCard) {
    throw new Error("Can't find a new card to give to a player");
  }
  newHeroHand.push(newCard);
  const newState = {
    ...fightState,
    heroDeck: newDeck,
    heroDrop: newDrop,
    enemyDrop: fightState.enemyDrop.concat([enemyCard]),
    heroHand: newHeroHand,
    enemyDeck: fightState.enemyDeck.slice(1),
  };
  return newState;
};

export const changeCardsInDeck = (playerCards: IPlayerSpell[], i: number) => {
  const playerCard = playerCards[i];
  if (!playerCard) {
    throw new Error(
      "Can't find the card you're trying to select in player's cards"
    );
  }
  const currentlySelected = playerCards.filter((c: IPlayerSpell) => c.selected);

  if (currentlySelected.length >= 15) {
    const firstSelectedIndex = playerCards.indexOf(currentlySelected[0]);
    playerCards[firstSelectedIndex] = {
      ...playerCards[firstSelectedIndex],
      selected: false,
    };
  }
  playerCards[i] = { ...playerCard, selected: !playerCard.selected };
  return playerCards;
};

export const updateHeroDeck = (
  fightState: FightState,
  heroCard: IPlayerSpell
) => {
  let newDeck = fightState.heroDeck;
  let newDrop = fightState.heroDrop;
  if (fightState.heroDeck.length <= 0) {
    newDeck = newDrop;
    newDrop = [heroCard];
  } else {
    newDrop.push(heroCard);
  }
  return [newDeck, newDrop];
};
