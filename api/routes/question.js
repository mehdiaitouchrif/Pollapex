const express = require("express");
const {
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/question");
const { protect } = require("../middleware/auth");
const router = express.Router();

router
  .route("/:id")
  .get(getQuestionById)
  .put(protect, updateQuestion)
  .delete(protect, deleteQuestion);

module.exports = router;
