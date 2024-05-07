const express = require("express");
const path = require("path");
const File = require("../models/File");

const router = express.Router();

router.get("/files/:name", async (req, res) => {
  try {
    const file = await File.findOne({ name: req.params.name });
    if (!file) {
      return res.status(404).send("File not found!");
    }
    const filePath = path.join(__dirname, "..", file.path);
    res.sendFile(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching file!");
  }
});

module.exports = router;
