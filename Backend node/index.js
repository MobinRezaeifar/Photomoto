const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const socketio = require("socket.io");
require("dotenv").config();

const story = require("./routes/StoryRoute");
const uploadRouter = require("./routes/upload");
const downloadRouter = require("./routes/download");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

app.use("/api", uploadRouter);
app.use("/api", downloadRouter);
app.use("/api/story", story);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
    console.log(`User disconnected: ${socket.id}`);
  });

  socket.on("callUser", (data) => {
    const { userToCall, signalData, from, name } = data;
    console.log(`Calling user: ${userToCall} from ${from}`);
    io.to(userToCall).emit("callUser", {
      signal: signalData,
      from: from,
      name: name,
    });
  });

  socket.on("answerCall", (data) => {
    const { to, signal } = data;
    console.log(`Answering call from: ${to}`);
    io.to(to).emit("callAccepted", signal);
  });
});

server.listen(PORT, () => console.log(`Listening at ${PORT}...`));
