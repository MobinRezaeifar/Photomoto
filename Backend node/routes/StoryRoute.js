const { Router } = require("express");

const {
  getStorys,
  postStory,
  updateStory,
  deleteStory,
} = require("../controller/ToDoController");

const router = Router();

router.get("/get", getStorys);
router.post("/post", postStory);
router.put("/update/:id", updateStory);
router.delete("/delete/:id", deleteStory);

module.exports = router;
