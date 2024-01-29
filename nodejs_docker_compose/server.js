const express = require("express");
const redis = require("redis");

const PORT = 8080;
const app = express();
const client = redis.createClient({
  host: "redis-server",
  port: 6379,
});

client.set("number", 0);

app.get("/", (req, res) => {
  client.get("number", (err, number) => {
    //res.send("숫자1업합니다.", number);
    res.status(200).send("숫자1업합니다. " + number);
    client.set("number", parseInt(number) + 1);
  });
});

app.listen(PORT);

console.log("server start");
