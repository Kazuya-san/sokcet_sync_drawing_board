const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const uuid = require("uuid");

// io.on("connection", (socket) => {
//   console.log("New user connected");
//   socket.on("chat message", (msg) => {
//     socket.broadcast.emit("chat message", msg);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

io.on("connection", (socket) => {
  console.log("New user connected");

  //listen for join-room event
  socket.on("join-room", (roomId) => {
    //console.log(roomId, userId);
    socket.join(roomId);
    //io.to(roomId).emit("user-connected", userId);
  });

  socket.on("chat message", (roomId, msg) => {
    io.to(roomId).emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    // console.log(io.sockets.adapter.rooms);
  });
});

const paths = __dirname + "/public";
app.use(express.static(paths + "/scripts"));

app.get("/", function (req, res) {
  // console.log("redirecting");
  return res.redirect(`/board/${uuid.v4()}`);
});

app.get("/board/:id", function (req, res) {
  res.sendFile(path.join(paths, "/index.html"));
});

const PORT = process.env.PORT || 5005;

server.listen(PORT, () => {
  console.log("listening on *:" + PORT);
});
