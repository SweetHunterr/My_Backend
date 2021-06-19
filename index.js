const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

const routerTodo = require("./routers/todo.js");
const routerUser = require("./routers/user.js");

app.use(routerTodo);
app.use(routerUser);

server.listen(3000, () => {
  console.log("Server Sudah Berjalan ... ");
});

io.on("connection", (socket) => {
  console.log("Pengguna terhubung : " + socket.id);

  socket.on("getTodo", (data) => {
    socket.broadcast.emit("getTodo", data);
  });
});
