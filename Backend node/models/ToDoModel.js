const mongoose = require("mongoose");

const toDoSchema = new mongoose.Schema({
  toDo: {
    type: String,
    required: true,
  },
},{timestamps:true});

module.exports = mongoose.model("Todo", toDoSchema);