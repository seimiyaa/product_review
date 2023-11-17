const path = require("path");
const express = require("express");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "express_db",
});

app.get("/", (req, res) => {
  let sortBy = "";

  if (!req.query.option || req.query.option === "default") {
    sortBy = "id ASC";
  } else if (req.query.option === "low") {
    sortBy = "rating ASC";
  } else if (req.query.option === "high") {
    sortBy = "rating DESC";
  }

  const sql = `SELECT * FROM personas ORDER BY ${sortBy}`;
  con.query(sql, function (err, personas, fields) {
    if (err) throw err;
    res.render("index", {
      personas: personas,
      req: req,
    });
  });
});

app.post("/", (req, res) => {
  const sql = "INSERT INTO personas SET ?";
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);

    // レビューを追加した後、再びすべてのレビューを取得してホームページにリダイレクト
    const selectAllSql = "SELECT * FROM personas ORDER BY id ASC"; // 適切なソート条件を指定する
    con.query(selectAllSql, function (err, personas, fields) {
      if (err) throw err;
      res.render("index", {
        personas: personas,
        req: req,
      });
    });
  });
});

app.get("/update/:id", (req, res) => {
  const sql = "SELECT * FROM personas WHERE id = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.render("update", {
      persona: result[0],
    });
  });
});

app.post("/update/:id", (req, res) => {
  const sql = "UPDATE personas SET ? WHERE id = " + req.params.id;
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect("/");
  });
});

app.get("/delete/:id", (req, res) => {
  const sql = "DELETE FROM personas WHERE id = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect("/");
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
console.log("テスト");
