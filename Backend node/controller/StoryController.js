const StoryModel = require("../models/StoryModel");

module.exports.getStorys = async (req, res) => {
  const storys = await StoryModel.find();
  res.send(storys);
};


module.exports.getStoryById = (req, res) => {
  const { id } = req.params;

  StoryModel.findById(id)
    .then((story) => {
      if (!story) {
        return res.status(404).send({ msg: "Story not found" });
      }
      res.send(story);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: err, msg: "Something went wrong!" });
    });
};

module.exports.postStory = (req, res) => {
  const { owner, media, time } = req.body;

  StoryModel.create({  owner, media, time })
    .then((data) => {
      console.log("Post Successfully...");
      res.status(201).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.send({ error: err, msg: "Something went wrong!" });
    });
};

module.exports.updateStory = (req, res) => {
  const { id } = req.params;
  const {  owner, media, time } = req.body;

  StoryModel.findByIdAndUpdate(id, {  owner, media, time })
    .then(() => {
      res.send("Updated Successfully....");
    })
    .catch((err) => {
      console.log(err);
      res.send({ error: err, msg: "Something went wrong!" });
    });
};

module.exports.deleteStory = (req, res) => {
  const { id } = req.params;

  StoryModel.findByIdAndDelete(id)
    .then(() => {
      res.send("Deleted Successfully....");
    })
    .catch((err) => {
      console.log(err);
      res.send({ error: err, msg: "Something went wrong!" });
    });
};
