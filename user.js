const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middlewares/auth.js");

const mysql = require("mysql");
const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_user",
});

mysqlConnection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Terkoneksi Ke Database User.JS");
  }
});

router.post(
  "/user",
  (req, res, next) => {
    mysqlConnection.query(
      "select count(*) as jumlah_user from tb_user",
      (err, result) => {
        if (result[0].jumlah_user > 0) {
          auth(req, res, next);
        } else {
          next();
        }
      }
    );
  },
  (req, res, next) => {
    const name = req.body.username;
    mysqlConnection.query(
      "select username from tb_user where username = '" + name + "'",
      (err, rows) => {
        if (rows.length > 0) {
          res.send("Username Telah Digunakan. Cobalah Username Lainnya.");
        } else {
          next();
        }
      }
    );
  },
  (req, res) => {
    const uname = req.body.username;
    const passwd = req.body.password;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(passwd, salt);

    mysqlConnection.query(
      "insert into tb_user values(null, '" +
        uname +
        "', '" +
        hashedPassword +
        "')",
      (err) => {
        if (err) {
          console.log(err);
        } else {
          res.send(
            "Data Telah Ditambahkan Ke Database. Selanjutnya, Untuk Membuat Akun Yang Baru Silahkan " +
              "Login Terlebih Dahulu."
          );
          res.end();
        }
      }
    );
  }
);

router.get("/user", auth, (req, res) => {
  mysqlConnection.query("select * from tb_user", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
    }
  });
});

router.delete("/user/:id", auth, (req, res) => {
  mysqlConnection.query("select * from tb_user", (err, rows) => {
    if (rows.length > 1) {
      const { id } = req.params;
      mysqlConnection.query(`delete from tb_user where id = ${id}`);
      res.send("Berhasil Dihapus");
    } else {
      res.send(
        "Tidak Dapat Menghapus Akun, Karena Tersisa Satu Akun Pada Database"
      );
    }
  });
});

module.exports = router;
