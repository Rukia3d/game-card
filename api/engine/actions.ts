import { IAdventure, IHero } from "../storage/types";
import { player } from "./engine";
import { IPlayerAdventure, IPlayerHero } from "./types";
const MAXADVENTURES = 5;

export const addHero = (
  playerHeroes: IPlayerHero[] | null,
  allHeroes: IHero[],
  id: number,
  expDate?: Date
): IPlayerHero[] => {
  const heroToAdd = allHeroes.find((h: IHero) => h.id === id);
  if (!heroToAdd) {
    throw new Error(`Hero with id ${id} doesn't exist in all heroes database`);
  }
  if (!playerHeroes) {
    return [
      {
        ...heroToAdd,
        selected: false,
        created_at: new Date(),
        expires_at: expDate ? expDate : null,
      },
    ];
  }

  const heroExists = playerHeroes.find(
    (h: IPlayerHero) => h.id === heroToAdd.id
  );
  if (heroExists) {
    console.warn(`Trying to add hero with id ${id} that is already owned`);
    return playerHeroes;
  }

  return playerHeroes.concat([
    {
      ...heroToAdd,
      selected: false,
      created_at: new Date(),
      expires_at: expDate ? expDate : null,
    },
  ]);
};

// convert an array to a set
const arrayToSet = (arr: number[]) => {
  return new Set(arr);
};

const isUnique = (arr: number[]) => {
  return arrayToSet(arr).size === arr.length;
};

const validateSelectHeroesInput = (
  playerHeroes: IPlayerHero[] | null,
  select: number[]
) => {
  if (!playerHeroes || playerHeroes.length < 1) {
    throw new Error(`Can't select heroes, no heroes provided`);
  }
  if (select.length < 1) {
    throw new Error(`Can't select heroes, no select indexes provided`);
  }
  if (select.some((n: number) => n > playerHeroes.length)) {
    throw new Error(
      `Can't add hero with the index higher than all player heroes`
    );
  }
  return playerHeroes;
};

const validateSelectHeroesOutput = (
  playerHeroes: IPlayerHero[],
  select: number[],
  max: number
) => {
  const currentlySelected = playerHeroes.filter((h: IPlayerHero) => h.selected);
  const currentlySelectedIndexes = currentlySelected.map(
    (h: IPlayerHero) => h.id
  );
  if (!isUnique(select) || !isUnique(currentlySelectedIndexes)) {
    throw new Error(`Can't select the same hero twice`);
  }

  if (currentlySelected.length != max) {
    throw new Error(
      `Not enough heroes, ${currentlySelected.length} is selected, max is ${max} `
    );
  }
};
export const selectHeroes = (
  playerHeroes: IPlayerHero[] | null,
  select: number[],
  max: number
): IPlayerHero[] => {
  const newHeroes: IPlayerHero[] = validateSelectHeroesInput(
    playerHeroes,
    select
  );

  select.forEach((s: number) => (newHeroes[s].selected = true));

  while (newHeroes.filter((h: IPlayerHero) => h.selected).length > max) {
    newHeroes.forEach((p: IPlayerHero, i: number) => {
      if (p.selected && select.indexOf(i) == -1) {
        p.selected = false;
      }
    });
  }

  validateSelectHeroesOutput(newHeroes, select, max);
  return newHeroes;
};

export const openAdventure = (
  playerAdventures: IPlayerAdventure[] | null,
  adventures: IAdventure[],
  id: number,
  expDate?: Date
): IPlayerAdventure[] => {
  const adventureToAdd = adventures.find((a: IAdventure) => a.id === id);
  if (!adventureToAdd) {
    throw new Error(
      `Adventure with id ${id} doesn't exist in all adventures database`
    );
  }
  if (!playerAdventures) {
    return [
      {
        ...adventureToAdd,
        open: true,
        created_at: new Date(),
        expires_at: expDate ? expDate : null,
      },
    ];
  }
  if (playerAdventures.filter((p: IPlayerAdventure) => p.id == id).length > 0) {
    console.warn("Trying to add adventure that is already added");
    return playerAdventures;
  }
  const newAdventures = playerAdventures;
  if (newAdventures.length < MAXADVENTURES) {
    return playerAdventures.concat([
      {
        ...adventureToAdd,
        open: true,
        created_at: new Date(),
        expires_at: expDate ? expDate : null,
      },
    ]);
  } else {
    const oldestExpAdventure = newAdventures
      .filter(
        (a: IPlayerAdventure) =>
          a.expires_at &&
          new Date(a.expires_at).getTime() < new Date().getTime()
      )
      .sort(function (curr, next) {
        const d1 = new Date(curr.expires_at as Date).getTime();
        const d2 = new Date(next.expires_at as Date).getTime();

        if (d1 < d2) return -1;
        if (d2 > d1) return 1;

        return 0;
      });

    console.log("oldestExpAdventure", oldestExpAdventure);
    if (!oldestExpAdventure[0]) {
      throw new Error(
        `Can't add a new adventure with id ${id} - old adventures haven't expired`
      );
    }
    const oldestAdventureIndex = newAdventures.indexOf(oldestExpAdventure[0]);
    newAdventures.splice(oldestAdventureIndex, 1);
    newAdventures.push({
      ...adventureToAdd,
      open: true,
      created_at: new Date(),
      expires_at: expDate ? expDate : null,
    });
    return newAdventures;
  }
};
