const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();

app.use(bodyParser.json());

//table create
// db.pool.query(
//   `CREATE TABLE lists(
//     id INTEGER AUTO_INCREMENT,
//     value TEXT,
//     PRIMARY KEY(id)
// )`,
//   (err, result, fileds) => {
//     console.log("result", result);
//   }
// );

//DB lists 테이블에 있는 모든 데이터를 프론트 서베에 보내주기
app.get("/api/hi", function (req, res) {
  //데이테베이스에서 모든 정보 가져오기
  res.status(200).send("good");
});

//db -> front
app.get("/api/values", (req, res, next) => {
  db.pool.query("SELECT * FROM lists;", (err, results, fields) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.json(results);
    }
  });
});

//front -> db
app.post("/api/value", (req, res, next) => {
  db.pool.query(`INSERT INTO lists (value) VALUES("${req.body.value}")`);
  if (err) {
    return res.status(500).send(err);
  } else {
    return res.json({ success: true, value: req.body.value });
  }
});

app.listen(5000, () => {
  console.log("start run port: 5000");
});
