const express = require("express");
const { body } = require("express-validator");
const {
  signup,
  signin,
  getMe,
  findUser,
  resetPassword,
  forgotPassword,
  oauthHandler,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");
const handleInputErrors = require("../middleware/error");

const router = express.Router();

router.post(
  "/signin",
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars long"),
  handleInputErrors,
  signin
);
router.post(
  "/signup",
  body("name").isString().withMessage("Enter your full name"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars long"),
  handleInputErrors,
  signup
);
router.get("/me", protect, getMe);
router.get("/:email", findUser);

router.post("/oauth", oauthHandler);

router.post(
  "/forgotpassword",
  body("email").isEmail().withMessage("Please enter your account email"),
  handleInputErrors,
  forgotPassword
);
router.put(
  "/resetpassword/:resettoken",
  body("password").isString().withMessage("Enter your new password"),
  handleInputErrors,
  resetPassword
);

module.exports = router;
