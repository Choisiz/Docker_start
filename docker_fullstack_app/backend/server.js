const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();

app.use(bodyParser.json());

db.pool.query(
  `CREATE TABLE lists(
    id INTEGER AUTO_INCREMENT,
    value TEXT,
    PRIMARY KEY(id)
)`,
  (err, result, fileds) => {
    console.log("result", result);
  }
);
//db -> front
app.get("/api/values", (req, res) => {
  db.pool.query("SELECT * FROM lists;", (err, results, fileds) => {
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

app.get("/api/values", (req, res) => {});

app.listen(5000, () => {
  console.log("start run port: 5000");
});
