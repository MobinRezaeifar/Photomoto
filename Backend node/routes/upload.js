const express = require("express");
const multer = require("multer");
const File = require("../models/File");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

const router = express.Router();

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = new File({
      name: req.file.originalname,
      path: req.file.path,
    });
    await file.save();
    res.sendFile(file.path);
    res.send("File uploaded successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading file!");
  }
});

module.exports = router;
