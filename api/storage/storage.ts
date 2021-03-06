import { Database } from "sqlite3";
import { IUserEvent } from "../engine/types";
import {
  combineAdventuresData,
  combinedFightsData,
  combineDialoguesData,
  combineElementData,
  combineEvents,
  combineHeroesData,
  combineResourceData,
  combineSpellData,
  combineStoriesData,
  combineUpdateData,
  transformAttackSpellEvents,
  transformCreatePlayerEvent,
  transformStartFightEvents,
  transformStoryEvents,
} from "./combiners";
import {
  DBAdventure,
  DBCharacter,
  DBDialogue,
  DBElement,
  DBFight,
  DBFightElement,
  DBHero,
  DBLine,
  DBPAttackSpellEvent,
  DBPCreateEvent,
  DBPStartFightEvent,
  DBPStoryEvent,
  DBResource,
  DBSchool,
  DBSpell,
  DBStory,
  DBUpdate,
  DBUpdateResource,
} from "./db_types";
import {
  getPlayerAttackSpellEvents,
  getPlayerEvents,
  getPlayerFinishDialogueEvents,
  getPlayerFinishReelEvents,
  getPlayerLooseFightEvents,
  getPlayerStartFightEvents,
  getPlayerWinFightEvents,
} from "./dynamic_data_readers";
import {
  getAllAdventures,
  getAllCharacters,
  getAllDialogues,
  getAllElements,
  getAllFightElements,
  getAllFights,
  getAllHeroes,
  getAllLines,
  getAllResources,
  getAllSchools,
  getAllSpells,
  getAllStories,
  getAllUpdateResources,
  getAllUpdates,
} from "./static_data_csv";
import {
  IAdventure,
  ICharacter,
  IDialogue,
  IElement,
  IFight,
  IHero,
  IResource,
  ISpell,
  IUpdate,
} from "./types";

export const loadDialogues = async (): Promise<IDialogue[]> => {
  const dialogues: DBDialogue[] = await getAllDialogues();
  const lines: DBLine[] = await getAllLines();
  const characters: DBCharacter[] = await getAllCharacters();
  return combineDialoguesData(dialogues, lines, characters);
};

export const loadElements = async (): Promise<IElement[]> => {
  const elements: DBElement[] = await getAllElements();
  const schools: DBSchool[] = await getAllSchools();
  return combineElementData(elements, schools);
};

export const loadFights = async (): Promise<IFight[]> => {
  const fights: DBFight[] = await getAllFights();
  const fightElements: DBFightElement[] = await getAllFightElements();
  const combinedElements = await loadElements();
  const heroes = await loadHeroes();
  return combinedFightsData(fights, fightElements, combinedElements, heroes);
};

export const loadAdventures = async (): Promise<IAdventure[]> => {
  const adventures: DBAdventure[] = await getAllAdventures();
  const stories: DBStory[] = await getAllStories();

  const combinedDialogues = await loadDialogues();
  const combinedFigths = await loadFights();
  const combinedStories = combineStoriesData(
    stories,
    combinedDialogues,
    combinedFigths
  );
  return combineAdventuresData(adventures, combinedStories);
};

export const loadPlayerEvents = async (
  player_id: number,
  db: Database
): Promise<IUserEvent[]> => {
  //console.log("loadPlayerEvents");
  const creationEvents: DBPCreateEvent[] = await getPlayerEvents(player_id, db);
  const fightEvents: DBPStartFightEvent[] = await getPlayerStartFightEvents(
    player_id,
    db
  );
  const attackEvents: DBPAttackSpellEvent[] = await getPlayerAttackSpellEvents(
    player_id,
    db
  );
  const dialogueEvents: DBPStoryEvent[] = await getPlayerFinishDialogueEvents(
    player_id,
    db
  );
  const reelEvents: DBPStoryEvent[] = await getPlayerFinishReelEvents(
    player_id,
    db
  );
  const looseEvents: DBPStoryEvent[] = await getPlayerLooseFightEvents(
    player_id,
    db
  );
  const winEvents: DBPStoryEvent[] = await getPlayerWinFightEvents(
    player_id,
    db
  );

  const eventsData: IUserEvent[] = combineEvents(
    transformCreatePlayerEvent(creationEvents),
    transformStartFightEvents(fightEvents),
    transformAttackSpellEvents(attackEvents),
    transformStoryEvents(dialogueEvents),
    transformStoryEvents(reelEvents),
    transformStoryEvents(winEvents),
    transformStoryEvents(looseEvents)
  );
  //console.log("loadPlayerEvents eventsData", eventsData);
  return eventsData;
};

export const loadHeroes = async (): Promise<IHero[]> => {
  const characters: DBCharacter[] = await getAllCharacters();
  const heroes: DBHero[] = await getAllHeroes();
  const elements = await loadElements();

  return combineHeroesData(heroes, characters, elements);
};

export const loadCharacters = async (): Promise<ICharacter[]> => {
  const characters: DBCharacter[] = await getAllCharacters();
  return characters;
};

export const loadSpells = async (): Promise<ISpell[]> => {
  const spells: DBSpell[] = await getAllSpells();
  const elements: DBElement[] = await getAllElements();
  const schools: DBSchool[] = await getAllSchools();

  return combineSpellData(spells, elements, schools);
};

export const loadUpdates = async (): Promise<IUpdate[]> => {
  const updates: DBUpdate[] = await getAllUpdates();
  const update_resources: DBUpdateResource[] = await getAllUpdateResources();
  const resources: DBResource[] = await getAllResources();
  const schools: DBSchool[] = await getAllSchools();

  return combineUpdateData(updates, update_resources, resources, schools);
};

export const loadResources = async (): Promise<IResource[]> => {
  const updates: DBResource[] = await getAllResources();
  const schools: DBSchool[] = await getAllSchools();

  return combineResourceData(updates, schools);
};
