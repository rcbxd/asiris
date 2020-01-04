const express = require("express");
const db = require("./util/db");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const auth = require("./api/auth");
const cors = require("cors");
const Message = require("./models/Message");
const Chat = require("./models/Chat");
const chats = require("./api/chats");

app.use(cors());

io.set("origins", "*:*");
io.on("connection", async socket => {
  console.log("Client Successfully Connected");
  socket.on("connect-room", room => {
    socket.join(room);
    socket.on("msg", msg => {
      io.to(room).emit("message_sent", msg);
    });
  });
  io.emit("chat", "hello world");
});

app.use(express.urlencoded());
app.use(express.json());
app.use("/api/account/", auth);
app.use("/api/chat/", chats);

Message.belongsTo(Chat, { constraints: true, onDelete: "CASCADE" });
Chat.hasMany(Message, { constraints: true, onDelete: "CASCADE" });

db.sync({
  force: false
})
  .then(() => {
    server.listen(5000, () => {
      console.log(`started backend on port 5000`);
    });
  })
  .catch(err => {
    throw err;
  });
