const bcrypt = require("bcryptjs");

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
    console.log("Terkoneksi Ke Database Auth.JS");
  }
});

module.exports = function (req, res, next) {
  const username = req.headers.username;
  const password = req.headers.password;

  mysqlConnection.query(
    "select password as pwd from tb_user where username = '" + username + "'",
    (err, result) => {
      const pwd = result[0].pwd;
      const resultLogin = bcrypt.compareSync(password, pwd);
      if (resultLogin) {
        next();
      } else {
        res.send(401);
      }
    }
  );
};
