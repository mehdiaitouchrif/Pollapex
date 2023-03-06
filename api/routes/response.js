const express = require("express");
const {
  submitResponse,
  getResponses,
  editResponse,
  getResponse,
} = require("../controllers/response");
const router = express.Router({ mergeParams: true });
const { protect } = require("../middleware/auth");

router.route("/").post(submitResponse).get(protect, getResponses);
router.route("/:id").get(getResponse).put(editResponse);

module.exports = router;
