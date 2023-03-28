const express = require("express");
const {
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  createQuestion,
} = require("../controllers/question");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.post("/", protect, createQuestion);

router
  .route("/:id")
  .get(getQuestionById)
  .put(protect, updateQuestion)
  .delete(protect, deleteQuestion);

module.exports = router;
