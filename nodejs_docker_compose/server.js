const express = require("express");
const redis = require("redis");

const PORT = 8080;
const app = express();

/*레디스 구현 */
const client = redis.createClient({
  host: "redis-server", //서버가 작동하는곳 을 기입
  port: 6379,
});

//숫자는 0부터 시작
client.set("number", 0);

app.get("/", (req, res) => {
  client.get("number", (err, number) => {
    //res.send("숫자1업합니다.", number);
    client.set("number", parseInt(number) + 1);
    res.status(200).send("숫자+1up:" + number);
  });
});

app.listen(PORT);

console.log("server start");
