const { Router } = require("express");

const {
  getToDos,
  postToDo,
  updateToDo,
  deleteToDo,
} = require("../controller/ToDoController");

const router = Router();

router.get("/get", getToDos);
router.post("/post", postToDo);
router.put("/update/:id", updateToDo);
router.delete("/delete/:id", deleteToDo);

module.exports = router;