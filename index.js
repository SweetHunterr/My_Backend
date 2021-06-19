const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

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
    console.log("Terkoneksi Ke Database");
  }
});

app.get("/", (req, res) => {
  res.send(
    '<html><body><form action="/todo" method="post"><input name="deskripsi"/><button>Add</button></form></body></html>'
  );
  res.end();
});

app.post("/todo", (req, res) => {
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

app.get("/todo", (req, res) => {
  mysqlConnection.query("select * from tb_deskripsi", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
    }
  });
});

app.delete("/todo/:id", (req, res) => {
  const { id } = req.params;
  mysqlConnection.query(`delete from tb_deskripsi where id = ${id}`);
});

app.listen(3000, () => {
  console.log("Server Sudah Berjalan ... ");
});
