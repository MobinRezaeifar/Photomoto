process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;
require("dotenv").config();

const fetch = require("node-fetch");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const story = require("./routes/StoryRoute");
const uploadRouter = require("./routes/upload");
const downloadRouter = require("./routes/download");

const app = express();

const PORT = process.env.PORT || 5001;
const MONGO_URL = process.env.MONGO_URL;
const API_KEY = process.env.daily_API_KEY;

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: "Bearer " + API_KEY,
};

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

app.use("/api", uploadRouter);
app.use("/api", downloadRouter);
app.use("/api/story", story);

const getRoom = (room) => {
  return fetch(`https://api.daily.co/v1/rooms/${room}`, {
    method: "GET",
    headers,
  })
    .then((res) => res.json())
    .then((json) => {
      return json;
    })
    .catch((err) => console.error("error:" + err));
};

const createRoom = (room) => {
  return fetch("https://api.daily.co/v1/rooms", {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: room,
      properties: {
        enable_screenshare: true,
        enable_chat: true,
        start_video_off: true,
        start_audio_off: false,
        lang: "en",
      },
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      return json;
    })
    .catch((err) => console.log("error:" + err));
};

app.get("/video-call/:id", async function (req, res) {
  const roomId = req.params.id;

  const room = await getRoom(roomId);
  if (room.error) {
    const newRoom = await createRoom(roomId);
    res.status(200).send(newRoom);
  } else {
    res.status(200).send(room);
  }
});

app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));

module.exports = app;
