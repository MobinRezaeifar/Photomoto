const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected..."))
    .catch((err) => console.error(err));

const File = mongoose.model("File", new mongoose.Schema({
    name: String,
    path: String
}));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        const file = new File({
            name: req.file.originalname,
            path: req.file.path
        });
        await file.save();
        res.send("File uploaded successfully!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error uploading file!");
    }
});

app.get('/api/files/:name', async (req, res) => {
    try {
        const file = await File.findOne({ name: req.params.name });
        if (!file) {
            return res.status(404).send("File not found!");
        }
        const filePath = path.join(__dirname, file.path);
        res.sendFile(filePath);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching file!");
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
