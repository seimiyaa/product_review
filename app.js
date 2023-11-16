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
  const sql = "SELECT * FROM personas";
  con.query(sql, function (err, personas, fields) {
    if (err) throw err;
    res.render("index", {
      personas: personas,
    });
  });
});

app.post("/", (req, res) => {
  const sql = "INSERT INTO personas SET ?";
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);

    // レビューを追加した後、再びすべてのレビューを取得してホームページにリダイレクト
    const selectAllSql = "SELECT * FROM personas";
    con.query(selectAllSql, function (err, personas, fields) {
      if (err) throw err;
      res.render("index", {
        personas: personas,
      });
    });
  });
});

app.get("/create", (req, res) => {
  res.sendFile(path.join(__dirname, "html/form.html"));
});

app.get("/edit/:id", (req, res) => {
  const sql = "SELECT * FROM personas WHERE id = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.render("edit", {
      persona: result[0],
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
