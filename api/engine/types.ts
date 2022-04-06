import { DBPEvent } from "../storage/db_types";
import {
  IAdventure,
  IDialogue,
  IHero,
  IResource,
  ISpell,
  IUpdate,
} from "../storage/types";

export type UserEventType =
  | "createUser"
  | "finishStory"
  | "startFight"
  | "attackSpell"
  | "selectHero"
  | "selectSpell";

export type ActionEventType =
  | "createUserAction"
  | "addHero"
  | "selectSpellAction"
  | "selectHeroAction"
  | "openAdventure"
  | "updateNPC"
  | "addSpell"
  | "addResource"
  | "openStory"
  | "generateFight"
  | "startFightAction"
  | "attackSpell"
  | "addResource";

export type IPlayerAdventure = IAdventure & {
  open: boolean;
  created_at: Date;
  expires_at: Date | null;
};

export type IPlayerHero = IHero & {
  selected: boolean;
  created_at: Date;
  expires_at: Date | null;
};

export type IPlayerCharacter = {
  id: number;
  image: string;
  dialogue: IDialogue;
  created_at: Date;
  expires_at: Date | null;
};

export type IPlayerResource = IResource & {
  created_at: Date;
  quantity: number;
};

export type IPlayerSpell = ISpell & {
  copy_id: number;
  created_at: Date;
  expires_at: Date | null;
  updates: IUpdate[] | [];
};

export type IPlayerUpdate = IUpdate & { created_at: Date; expires_at: Date };

export type IPlayer = {
  id: number;
  experience: number;
  life: number;
  maxlife: number;
  mana: number;
  maxmana: number;
  created_at: Date;
  updated_at: Date;
  rank: number;
};

export type IUserEvent = DBPEvent;
