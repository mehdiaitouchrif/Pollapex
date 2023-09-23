const express = require("express");
const { body } = require("express-validator");
const {
  createSurvey,
  getSurveysByUser,
  getSurveyById,
  updateSurvey,
  deleteSurvey,
  getSurveyAnalytics,
  sendCollaborationInvite,
  acceptCollaborationInvite,
  declineCollaborationInvite,
  deleteCollaboratorOrCancelInvite,
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

router.post(
  "/:id/invitations",
  protect,
  body("email").isEmail().withMessage("Please enter a valid email"),
  handleInputErrors,
  sendCollaborationInvite
);

router.delete("/:id/users/:userId", protect, deleteCollaboratorOrCancelInvite);

router.post("/invitations/:token", protect, acceptCollaborationInvite);
router.delete("/invitations/:token", protect, declineCollaborationInvite);

router.get("/:id/analytics", protect, getSurveyAnalytics);

module.exports = router;
