import {
  DBAdventure,
  DBStory,
  DBAction,
  DBCharacter,
  DBElement,
  DBHero,
  DBSchool,
  DBSpell,
  DBResource,
  DBUpdate,
  DBUpdateResource,
  DBPSpell,
  DBPSpellUpdate,
  DBDialogue,
  DBLine,
  DBFightElement,
  DBFight,
} from "./db_types";
import {
  IStory,
  IAdventure,
  IAction,
  IElement,
  IHero,
  ISpell,
  IUpdate,
  IUpdateResource,
  IPUpdatedSpell,
  IResource,
  IDialogue,
  ILine,
  IFight,
  IReel,
} from "./types";

export const combinedFightsData = (
  fights: DBFight[],
  fightElements: DBFightElement[],
  combinedElements: IElement[],
  combinedHeroes: IHero[]
): IFight[] => {
  const updatedFights: IFight[] = fights.map((f: DBFight) => {
    const enemy = combinedHeroes.find((c: IHero) => c.id === f.enemy_id);
    if (!enemy) throw new Error(`Can't find an enemy for ${f.enemy_id}`);
    const elements = fightElements.map((f: DBFightElement) => {
      const element = combinedElements.find(
        (e: IElement) => e.id === f.element_id
      );
      if (!element)
        throw new Error(`Can't find an element for ${f.element_id}`);
      return element;
    });
    return {
      id: f.id,
      story_id: f.story_id,
      base_hero_num: f.base_hero_num,
      enemy: enemy,
      background: f.background,
      base_elements: elements,
    };
  });
  return updatedFights;
};

export const combineDialoguesData = (
  dialogues: DBDialogue[],
  lines: DBLine[],
  characters: DBCharacter[]
): IDialogue[] => {
  const updatedDialogues: IDialogue[] = dialogues.map((d: DBDialogue) => {
    const updatedLines: ILine[] = lines.map((l: DBLine) => {
      const character = characters.find(
        (c: DBCharacter) => c.id === l.character_id
      );
      if (!character)
        throw new Error(`Can't find a character for ${l.character_id}`);
      return {
        id: l.id,
        character: character,
        image: l.image,
        position: l.position,
        text: l.text,
      };
    });
    return {
      id: d.id,
      story_id: d.story_id,
      lines: updatedLines,
      background: d.background,
      layout: d.layout,
    };
  });

  return updatedDialogues;
};

export const combineStoriesData = (
  stories: DBStory[],
  combinedDialogues: IDialogue[],
  combinedFigths: IFight[]
): IStory[] => {
  const updatedStories = stories.map((s: DBStory) => {
    let item: IDialogue | IFight | IReel;
    if (s.type === "fight") {
      const res = combinedFigths.find((f: IFight) => f.story_id === s.id);
      if (!res) throw new Error(`Can't find a fight for ${s.id}`);
      item = res;
    } else if (s.type === "dialogue") {
      const res = combinedDialogues.find((d: IDialogue) => d.story_id === s.id);
      if (!res) throw new Error(`Can't find a dialogue for ${s.id}`);
      item = res;
    } else {
      throw new Error(`Unknown type for ${s.id}`);
    }
    return {
      id: s.id,
      type: s.type,
      name: s.name,
      next_id: s.next_id,
      open: false,
      actions: null,
      item: item,
      adventure_id: s.adventure_id,
    };
  });
  return updatedStories;
};

export const combineAdventuresData = (
  adventures: DBAdventure[],
  stories: IStory[],
  actions: DBAction[]
): IAdventure[] => {
  const updatedStories: IStory[] = stories.map((s: IStory) => {
    const updatedActions: IAction[] | null = [];
    actions.map((a: DBAction) =>
      a.parent_id === s.id && a.parent_type === "story"
        ? updatedActions.push({
            id: a.id,
            type: a.type,
            item_id: a.item_id,
            data_id: a.data_id ? a.data_id : null,
          })
        : null
    );

    return {
      ...s,
      open: false,
      actions: updatedActions,
    };
  });

  const updatedAdventures: IAdventure[] = adventures.map((a: DBAdventure) => {
    const stories: IStory[] = updatedStories
      .filter((s: IStory) => s.adventure_id === a.id)
      .map((i: IStory) => {
        return {
          ...i,
          actions: i.actions,
          open: false,
        };
      });
    return {
      id: a.id,
      type: a.type,
      name: a.name,
      description: a.description,
      stories: stories,
    };
  });
  return updatedAdventures;
};

export const combineHeroesData = (
  heroes: DBHero[],
  characters: DBCharacter[],
  elements: IElement[]
): IHero[] => {
  const updatedHeroes: IHero[] = heroes.map((h: DBHero) => {
    const element = elements.find((e: IElement) => e.id === h.element_id);
    if (!element)
      throw new Error(`Can't find an element for ${h.character_id}`);
    const character = characters.find(
      (c: DBCharacter) => c.id === h.character_id
    );
    if (!character)
      throw new Error(`Can't find an character for ${h.character_id}`);
    return {
      id: character.id,
      name: character.name,
      description: character.description,
      element: element,
    };
  });
  return updatedHeroes;
};

export const combineElementData = (
  elements: DBElement[],
  schools: DBSchool[]
): IElement[] => {
  const updatedElements = elements.map((e: DBElement) => {
    const school = schools.find((s: DBSchool) => s.id === e.school_id);
    if (!school) throw new Error(`Can't find a school for ${e.name}`);
    return {
      id: e.id,
      name: e.name,
      description: e.description,
      code: e.code,
      school: school,
    };
  });
  return updatedElements;
};

export const combineSpellData = (
  spells: DBSpell[],
  elements: DBElement[],
  schools: DBSchool[]
): ISpell[] => {
  const updatedSpells: ISpell[] = spells.map((e: DBSpell) => {
    const element = elements.find((s: DBElement) => s.id === e.element_id);
    if (!element) throw new Error(`Can't find a school for ${e.name}`);
    const school = schools.find((s: DBSchool) => s.id === element.school_id);
    if (!school) throw new Error(`Can't find a school for ${element.name}`);

    return {
      id: e.id,
      name: e.name,
      description: e.description,
      base_strength: e.base_strength,
      element: { ...element, school: school },
    };
  });
  return updatedSpells;
};

export const combineUpdateData = (
  updates: DBUpdate[],
  update_resources: DBUpdateResource[],
  resources: DBResource[],
  actions: DBAction[],
  schools: DBSchool[]
): IUpdate[] => {
  const combinedUpdates = updates.map((u: DBUpdate) => {
    const school = schools.find((s: DBSchool) => s.id === u.school_id);
    if (!school) throw new Error(`Can't find a school for ${u.name}`);

    const updatedResources: IUpdateResource[] = update_resources.map(
      (ur: DBUpdateResource) => {
        const resource = resources.find(
          (r: DBResource) => r.id === ur.resource_id
        );
        if (!resource)
          throw new Error(`Can't find a resource for ${ur.resource_id}`);
        return {
          id: resource.id,
          school: school,
          name: resource.name,
          description: resource.description,
          commonality: resource.commonality,
          base_quantity: ur.quantity,
        };
      }
    );

    const updatedActions: IAction[] | null = [];
    actions.map((a: DBAction) =>
      a.parent_id === u.id && a.parent_type === "spell"
        ? updatedActions.push({
            id: a.id,
            type: a.type,
            item_id: a.item_id,
            data_id: a.data_id ? a.data_id : null,
          })
        : null
    );

    return {
      id: u.id,
      name: u.name,
      description: u.description,
      effect: u.effect,
      base_mana: u.base_mana,
      school: school,
      resource_base: updatedResources,
      actions: updatedActions,
    };
  });
  return combinedUpdates;
};

export const combinePlayerspells = (
  player_spells: DBPSpell[],
  player_applied_updates: DBPSpellUpdate[]
): IPUpdatedSpell[] => {
  const combinedSpellUpdates = player_spells.map((s: DBPSpell) => {
    const updates = player_applied_updates.filter(
      (p: DBPSpellUpdate) =>
        p.spell_id === s.spell_id && s.copy_id === p.copy_id
    );
    return {
      spell: s,
      updates: updates ? updates : [],
    };
  });
  return combinedSpellUpdates;
};

export const combineResourceData = (
  updates: DBResource[],
  schools: DBSchool[]
): IResource[] => {
  const combinedUpdates = updates.map((u: DBResource) => {
    const school = schools.find((s: DBSchool) => s.id === u.school_id);
    if (!school) throw new Error(`Can't find a school for ${u.name}`);
    return {
      id: u.id,
      school: school,
      name: u.name,
      description: u.description,
      commonality: u.commonality,
    };
  });
  return combinedUpdates;
};
