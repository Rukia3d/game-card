import React from "react";
import "./Spells.css";
// Types
import { ISpellUpdate } from "../utils/types";
// Utils
// Components
import { SpellUpdate } from "./SpellUpdate";

export const SpellUpdates = ({
  spellUpgrades,
  updateSpell,
}: {
  spellUpgrades: ISpellUpdate[];
  updateSpell: (s: ISpellUpdate) => void;
}) => {
  return (
    <div>
      {spellUpgrades.map((s: ISpellUpdate, i: number) => (
        <SpellUpdate update={s} key={i} updateSpell={updateSpell} canUpdate />
      ))}
    </div>
  );
};