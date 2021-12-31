import React from "react";
import "./Fight.scss";
// Types
import { elementType, IEnemy, ISpell } from "../utils/types";
// Utils
// Components
import { SpellBig } from "./SpellBig";

export const SpellsBig = ({
  enemySpell,
  heroSpell,
  element,
  setInfo,
}: {
  enemySpell: ISpell | null;
  heroSpell: ISpell | null;
  element: elementType;
  setInfo: (s: null | IEnemy | ISpell) => void;
}) => {
  return (
    <div className="SpellsBig">
      {enemySpell ? (
        <SpellBig
          spell={enemySpell}
          setInfo={setInfo}
          element={element}
          transparency={enemySpell !== null && heroSpell !== null}
        />
      ) : null}
      {enemySpell && heroSpell ? (
        <SpellBig spell={heroSpell} setInfo={setInfo} element={element} />
      ) : null}
    </div>
  );
};
