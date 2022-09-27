const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("New user connected");
  socket.on("chat message", (msg) => {
    socket.broadcast.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const paths = __dirname + "/public/";
app.use(express.static(paths));

app.get("/", function (req, res) {
  res.sendFile(path.join(paths, "index.html"));
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("listening on *:" + PORT);
});
