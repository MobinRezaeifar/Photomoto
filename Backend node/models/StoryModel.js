const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("story", StorySchema);
