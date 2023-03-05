const User = require("../models/user");
const { sendTokenResponse } = require("../utils/auth");

// @desc    Sign up
// @route   POST /api/auth/signup
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Sign in
// @route   POST /api/auth/signin
exports.signin = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // Check user existence
  if (!user) {
    return res.status(401).json({
      success: false,
      errors: [{ msg: "Invalid email or password" }],
    });
  }

  // Check user password
  const isMatch = await user.matchPasswords(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      errors: [{ msg: "Invalid email or password" }],
    });
  }

  sendTokenResponse(user, 200, res);
};

// @desc   Current user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};
