const express = require("express");
const {
  createSurvey,
  getSurveysByUser,
  getSurveyById,
  updateSurvey,
  deleteSurvey,
} = require("../controllers/survey");
const { protect } = require("../middleware/auth");
const { createSurveyValidator } = require("../middleware/validators");
const handleInputErrors = require("../middleware/error");
const router = express.Router();

router.use("/:id/responses", require("./response"));

router
  .route("/")
  .post(protect, createSurveyValidator, handleInputErrors, createSurvey)
  .get(protect, getSurveysByUser);
router
  .route("/:id")
  .get(getSurveyById)
  .put(protect, updateSurvey)
  .delete(protect, deleteSurvey);

module.exports = router;
