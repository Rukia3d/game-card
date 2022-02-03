import { GameState, IReel, ISpell } from "../src/utils/types";
import { createPlayer, loadPlayer } from "./database";

const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;
app.use(cors());

const reelsInitialSet: IReel[] = [
  {
    id: "c1_reel_1",
    type: "reel",
    action: [],
    imageGroups: [
      {
        id: 1,
        layout: 4,
        images: [
          { id: "c1_reel_1_1_img1", image: "storyline", direction: "down" },
          { id: "c1_reel_1_1_img2", image: "storyline", direction: "up" },
          { id: "c1_reel_1_1_img3", image: "storyline", direction: "left" },
          { id: "c1_reel_1_1_img4", image: "storyline", direction: "left" },
        ],
      },
      {
        id: 2,
        layout: 1,
        images: [
          { id: "c1_reel_1_2_img1", image: "storyline", direction: "left" },
        ],
      },
    ],
  },
  {
    id: "c1_reel_2",
    type: "reel",
    action: [],
    imageGroups: [
      {
        id: 1,
        layout: 3,
        images: [
          {
            id: "c1_reel_2_1_img1",
            image: "storyline",
            direction: "right",
          },
          {
            id: "c1_reel_2_1_img2",
            image: "storyline",
            direction: "left",
          },
          { id: "c1_reel_2_1_img3", image: "storyline", direction: "left" },
        ],
      },
      {
        id: 2,
        layout: 2,
        images: [
          {
            id: "c1_reel_2_2_img1",
            image: "storyline",
            direction: "right",
          },
          { id: "c1_reel_2_2_img2", image: "storyline", direction: "left" },
        ],
      },
    ],
  },
];

app.get("/api/player/", async (req: any, res: any) => {
  console.log("Requesting new player game data", req.query);
  const player = req.query.id
    ? await loadPlayer(req.query.id)
    : await createPlayer();

  const gameState: GameState = {
    player: player,
    reels: reelsInitialSet,
    dialogues: [],
    fights: [],
    npcs: [],
    heroes: [],
    adventures: [],
    enemies: [],
    resources: [],
    spells: [],
    spellUpdates: [],
  };
  res.send(gameState);
});

app.get("/api/rewards/", (req: any, res: any) => {
  console.log("rewards", req.query);
});

app.get("/api/fights/", (req: any, res: any) => {
  console.log("fights", req.query);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
