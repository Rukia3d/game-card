const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;
app.use(cors());
const playerCards = require("../src/data/heroCards.json");

app.get("/api/player/", (req, res) => {
    console.log("Requesting player game data");
    const gameState = {
        sceneCharacters: [{ id: "maya", image: "../img/maya.png", state: "dial1" }],
        player: { id: 1, cards: playerCards, experience: 300 },
        adventures: [
          {
            id: "story",
            name: "Act 1",
            image: "../img/storyline.png",
            state: "open",
            stories: [
              {
                id: "fight1",
                type: "fight",
                image: "../img/arena_1.png",
                enemy: "dude",
                state: "open",
                characters: ["maya", "tara"],
              },
              {
                id: "dial1",
                type: "dialogue",
                image: "../img/dialogue_1.png",
                state: "open",
                characters: ["maya"],
              },
              {
                id: "fight2",
                type: "fight",
                image: "../img/arena_1.png",
                enemy: "dude",
                state: "closed",
                characters: ["maya", "tara"],
              },
              {
                id: "dial2",
                type: "dialogue",
                image: "../img/dialogue_1.png",
                state: "closed",
                characters: ["maya"],
              },
            ],
          },
          {
            id: "arena",
            name: "Arena",
            image: "../img/devastation.png",
            state: "closed",
            stories: [],
          },
        ],
        heroes: ["maya"],
      }
    res.send(gameState);
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});