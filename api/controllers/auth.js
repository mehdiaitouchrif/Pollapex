const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { sendTokenResponse } = require("../utils/auth");
const createDefaultData = require("../utils/defaultData");
const sendEmail = require("../utils/sendEmail");

// @desc    Sign up
// @route   POST /api/auth/signup
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password });
    try {
      await createDefaultData(user);
    } catch (error) {
      next(error);
    }

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

  if (user && !user.password) {
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

// @desc    OAuth
// @route   POST /api/auth/oauth
exports.oauthHandler = async (req, res, next) => {
  try {
    const { name, email, picture, oauth } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Add user in db & generate token
      const newUser = await User.create({
        name,
        email,
        picture,
        oauth,
        isEmailConfirmed: true,
      });

      try {
        await createDefaultData(newUser);
      } catch (error) {
        next(error);
      }

      return sendTokenResponse(newUser, 200, res);
    } else {
      // Only generate token
      return sendTokenResponse(user, 200, res);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// @desc   Current user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};

//@desc  Find user
//@route GET /api/auth/:email
exports.findUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT api/auth/updatepassword
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    const { newPassword } = req.body;

    user.password = newPassword;
    if (user.oauth) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
    await user.save();
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT api/auth/updatedetails
exports.updateDetails = async (req, res, next) => {
  try {
    const updateFields = {
      name: req.body.name,
      email: req.body.email,
    };
    const user = await User.findByIdAndUpdate(req.user._id, updateFields, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword | Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "-password"
    );

    if (user) {
      // Get reset token
      const resetToken = user.getResetPasswordToken();
      await user.save({ validateBeforeSave: false });

      // Create reset url
      const resetLink = `${process.env.CLIENT_URL}/resetpassword/${resetToken}`;

      // Email template
      const emailTemplate = fs.readFileSync(
        path.join(__dirname, "../emailTemplates", "passwordReset.ejs"),
        "utf8"
      );

      const compiledEmailTemplate = ejs.compile(emailTemplate);
      const templateVars = {
        username: user.name,
        resetLink,
        clientPage: `${process.env.CLIENT_URL}/forgotpassword`,
      };

      try {
        await sendEmail({
          email: user.email,
          subject: "Password Reset",
          html: compiledEmailTemplate(templateVars),
        });
        res.status(200).json({
          success: true,
          data: "Email sent successfully",
        });
      } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        const error = new Error("Email sending failed");
        error.statusCode = 500;
        throw error;
      }
    } else {
      const error = new Error("Sorry, This email doesn't exist");
      error.statusCode = 400;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset passowrd
// @route   PUT /api/auth/resetpassword/:resettoken | Public
exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resettoken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    console.log(user);

    if (user) {
      // Set new password
      user.password = req.body.password;
      user.resetPasswordExpire = undefined;
      user.resetPasswordToken = undefined;

      if (user.oauth) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }

      await user.save();

      sendTokenResponse(user, 200, res);
    } else {
      const error = new Error("Invalid or expired reset link");
      error.statusCode = 404;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
