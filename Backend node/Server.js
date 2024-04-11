const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const story = require("./routes/StoryRoute");

const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

app.use("/api/story", story);

app.listen(PORT, () => console.log(`Listening at ${PORT}...`));
