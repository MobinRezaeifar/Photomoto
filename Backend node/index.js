const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const story = require("./routes/StoryRoute");
const uploadRouter = require("./routes/upload");
const downloadRouter = require("./routes/download");

const app = express();

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

app.listen(PORT, () => console.log(`Listening at ${PORT}...`));
