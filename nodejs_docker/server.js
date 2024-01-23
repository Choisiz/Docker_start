const express = require("express");

const PORT = 8080;

const app = express();

app.get("/", (req, res) => {
  res.send("안녕하세요_수정");
});

app.listen(PORT);
console.log("server is running");
