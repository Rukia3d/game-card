import React from "react";
import "./Heroes.scss";
// Types
import { IEnemy, IEnemyFight, IHero, IPlayerHero } from "../utils/types";
// Utils
// Components
import { AnimatedSpriteCycle } from "../Animations/AnimatedSpriteCycle";

export const HeroesPreview = ({
  characters,
  enemy,
}: {
  characters: IPlayerHero[];
  enemy: IEnemyFight;
}) => {
  return (
    <div className="FightPreview">
      {characters.map((h: IHero, i: number) => (
        <div
          className="HeroActive"
          style={{ position: "absolute", left: 70 * i }}
          key={i}
        >
          <AnimatedSpriteCycle
            width={500}
            height={500}
            img={`../img/Heroes/Animations/${h.id}_idle.png`}
            frames={9}
            breakpoint={1}
          />
        </div>
      ))}
      <div className="HeroActive" style={{ position: "absolute", right: 0 }}>
        <AnimatedSpriteCycle
          width={500}
          height={500}
          img={`../img/Enemies/${enemy.element.color}/${enemy.id}_idle.png`}
          frames={10}
          breakpoint={1}
        />
      </div>
    </div>
  );
};
