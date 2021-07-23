import {
  changeCardsInDeck,
  generateDeck,
  generateEnemyDeck,
  updatedCards,
  updateHeroDeck,
  updateWinPlayer,
} from "../utils/gamelogic";
import {
  baseCards15,
  enemy,
  enemyCard,
  fightState,
  gameState,
  mayaCard,
} from "../utils/testobjects";
import { ForgeReq, Spell } from "../utils/types";

test("generateDeck function returns correct character cards", () => {
  const deckForOne = generateDeck(["maya"], baseCards15);
  expect(deckForOne.length).toEqual(15);
});

test("generateEnemyDeck function returns correct number for enemy lifes", () => {
  const deckForEnemy = generateEnemyDeck(enemy);
  expect(deckForEnemy.length).toEqual(2);
});

test("updateHeroDeck shuffles if there are no cards left", () => {
  const deckForTwo = generateDeck(["maya", "tara"], baseCards15);
  const deckForEnemy = generateEnemyDeck(enemy);
  const newFightState = {
    ...JSON.parse(JSON.stringify(fightState)),
    heroHand: deckForTwo.slice(0, 3),
    heroDesk: deckForTwo,
    heroDrop: [],
    enemyDeck: deckForEnemy,
  };
  const [newDeck, newDrop] = updateHeroDeck(newFightState, deckForTwo[0]);
  expect(newDeck.length).toEqual(2);
  expect(newDrop.length).toEqual(1);
});

test("updateWinPlayer assigns rewards correctly", () => {
  const resource = [
    { id: "iron", name: "Iron", image: "../", commonality: 5 },
    { id: "iron", name: "Iron", image: "../", commonality: 5 },
    { id: "silk", name: "Silk", image: "../", commonality: 2, quantity: 0 },
    {
      id: "rdust",
      name: "Red dust",
      image: "../",
      commonality: 3,
      quantity: 0,
    },
  ];
  const updatedPlayer = updateWinPlayer(gameState.player, enemy, resource);
  expect(updatedPlayer.resources[1].quantity).toEqual(12);
  expect(updatedPlayer.resources[3].quantity).toEqual(1);
  expect(updatedPlayer.resources[4].quantity).toEqual(1);
  expect(updatedPlayer.experience).toEqual(325);
});

test("Correctly adds Card to Player's deck", () => {
  const spellsUnselected = new Array(15).fill(0).map((x, n) => ({
    ...mayaCard,
    id: "base_hit" + n,
    name: "Base Hit " + n,
  }));

  const spellsSelected = new Array(15).fill(0).map((x, n) => ({
    ...enemyCard,
    id: "base_hit" + n,
    name: "Base Hit " + n,
  }));

  const spellsMore = spellsSelected.concat([mayaCard, mayaCard]);
  spellsUnselected[0].selected = false;
  const addingFirst = changeCardsInDeck(spellsUnselected, spellsUnselected[0]);
  expect(addingFirst.length).toEqual(15);
  expect(addingFirst[0].selected).toBeTruthy();

  spellsUnselected[3].selected = false;
  const addingThird = changeCardsInDeck(spellsUnselected, spellsUnselected[3]);
  expect(addingThird.length).toEqual(15);
  expect(addingThird[3].selected).toBeTruthy();

  spellsSelected[0].selected = true;
  const chaingingFirstTaken = changeCardsInDeck(
    spellsSelected,
    spellsSelected[0]
  );
  expect(chaingingFirstTaken.length).toEqual(15);
  expect(chaingingFirstTaken[0].selected).not.toBeTruthy();

  spellsSelected[3].selected = true;
  const changingThirdTaken = changeCardsInDeck(
    spellsSelected,
    spellsSelected[3]
  );
  expect(changingThirdTaken.length).toEqual(15);
  expect(changingThirdTaken[3].selected).not.toBeTruthy();

  spellsMore.map((s: Spell, i: number) =>
    i < 15 ? (s.selected = true) : (s.selected = false)
  );
  const addingWhenAllSelected = changeCardsInDeck(spellsMore, spellsMore[15]);
  expect(addingWhenAllSelected.length).toEqual(17);
  expect(addingWhenAllSelected[0].selected).not.toBeTruthy();
  expect(addingWhenAllSelected[15].selected).toBeTruthy();
});

test("Correctly updates Crds", () => {
  const card = { ...JSON.parse(JSON.stringify(mayaCard)) };
  const req: ForgeReq = {
    itemType: "base_hit_maya",
    updates: [
      ["gold", 5],
      ["silk", 3],
    ],
    effect: "strengthen",
  };
  const spels = baseCards15.concat(card);
  const res = updatedCards(card, req, spels);
  expect(res[15].id).toEqual(mayaCard.id);
  expect(res[15].strength).toEqual(mayaCard.strength + 1);
  expect(res[15].level).toEqual(mayaCard.level + 1);
});
