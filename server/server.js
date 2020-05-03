const express = require("express");
var cors = require("cors");
var app = express();
app.use(cors());
const port = 8000;
var counter = 0;
var games = [];
var mqtt = require("mqtt");
/*
var client = mqtt.connect(
  "http://broker.hivemq.com:1883/"
);
//http://broker.hivemq.com:1883/
client.on("connect", function() {
  console.log("Subscriber is connected");
  client.subscribe("mytopic");
});

client.on("message", function(topic, message) {
  console.log(message.toString());
});

client.on("connect", function() {
  client.publish("mytopic", "Hello mqtt");
});
*/
app.get("/", (req, res) => res.send("Hello World!"));

app.get("/new_game", (req, res) => {
  let openGame = games.filter(g => g.players < 2);

  if (openGame.length === 0) {
    games.push({ name: "game_" + counter, players: 1, role: 0 });
    console.log({ name: "game_" + counter, players: 1, role: 0 });
    res.send({ name: "game_" + counter, players: 1, role: 0 });
  } else {
    openGame[0].players++;
    openGame[0].role = 1;
    counter++;
    console.log(openGame[0]);

    res.send(openGame[0]);
  }
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
