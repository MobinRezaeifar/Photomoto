const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema({
  owner: {
    type: String,
    require: true,
  },
  media: {
    type: String,
    require: true,
  },
  time: {
    type: String,
    require: true,
  },
  filter: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Story", StorySchema);
