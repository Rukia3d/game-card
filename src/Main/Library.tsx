import React, { useContext, useState } from "react";
import { GameContext } from "../App";
import "./Library.css";
// Types
import { elementType, ISpell, ISpellUpdate } from "../utils/types";
// Utils
// Components
import { Spells } from "../Spells/Spells";
import { TopMenu } from "../UI/TopMenu";
import { SpellUpdates } from "../Spells/SpellUpdates";
import { InfoCard } from "../Info/InfoCard";

const LibraryPanel = ({
  element,
  setElement,
}: {
  element: elementType;
  setElement: (s: elementType) => void;
}) => {
  return (
    <div className="SpellPanel" onClick={() => setElement(element)}>
      <img
        src={`../img/Spells/${element}_spellsAll.png`}
        alt={`image_${element}_spells`}
      />
    </div>
  );
};

export const Library = () => {
  const context = useContext(GameContext);
  if (!context || !context.gameState) {
    throw new Error("No data");
  }
  const spells = context.gameState.player.spells;

  const [item, setItem] = useState(2);
  const [element, setElement] = useState<elementType | null>(null);
  const elements = spells
    .map((s: ISpell) => s.element)
    .filter((v: any, i: any, a: any) => a.indexOf(v) === i && v);

  if (element) {
    return (
      <div className="Spells">
        <TopMenu />
        <Spells
          element={element}
          setElement={setElement}
          spells={spells.filter((s: ISpell) => s.element === element)}
        />
        <SpellUpdates
          spellUpgrades={context.gameState.player.spellUpdates}
          updateSpell={() => {}}
        />
      </div>
    );
  }

  if (item === 1) {
    return (
      <InfoCard item={context.gameState.player.heroes[0]} setInfo={() => {}} />
    );
  }

  if (item === 2) {
    return <InfoCard item={context.gameState.enemies[0]} setInfo={() => {}} />;
  }

  return (
    <div className="Spells">
      <TopMenu />
      <div className="SpellsList">
        {elements.sort().map((s: elementType, i: number) => (
          <LibraryPanel key={i} element={s} setElement={setElement} />
        ))}
      </div>
      <SpellUpdates
        spellUpgrades={context.gameState.player.spellUpdates}
        updateSpell={() => {}}
      />
    </div>
  );
};
