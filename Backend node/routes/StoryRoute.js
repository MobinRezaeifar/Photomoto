const { Router } = require("express");

const {
  getStorys,
  postStory,
  updateStory,
  deleteStory,
  getStoryById,
} = require("../controller/StoryController");

const router = Router();

router.get("/get", getStorys);
router.post("/post", postStory);
router.get("/get/:id", getStoryById);
router.put("/update/:id", updateStory);
router.delete("/delete/:id", deleteStory);

module.exports = router;
