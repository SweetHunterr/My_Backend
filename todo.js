const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.js");
const io = require("socket.io-client");

const mysql = require("mysql");
const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_deskripsi",
});

mysqlConnection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Terkoneksi Ke Database Todo.JS");
  }
});

router.get("/", auth, (req, res) => {
  const socket = io("http://localhost:3000");
  socket.on("connection");

  res.send(
    '<html><body><form action="/todo" method="post"><input name="deskripsi"/><button>Add</button></form></body></html>'
  );
  res.end();
});

router.post("/todo", auth, (req, res) => {
  const data = req.body.deskripsi;
  mysqlConnection.query(
    "insert into tb_deskripsi values(null, '" + data + "')",
    (err) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Data Telah Ditambahkan Ke Database. Terima Kasih :)");
        res.end();
      }
    }
  );
});

router.get("/todo", auth, (req, res) => {
  mysqlConnection.query("select * from tb_deskripsi", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
    }
  });
});

router.delete("/todo/:id", auth, (req, res) => {
  const { id } = req.params;
  mysqlConnection.query(`delete from tb_deskripsi where id = ${id}`);
  res.send("Berhasil Dihapus");
});

module.exports = router;
