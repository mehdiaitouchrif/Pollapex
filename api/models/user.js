const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JwtSecret, JwtExpires } = require("../config");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    picture: { type: String, required: false, default: "default_avatar.png" },
    name: { type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    confirmEmailToken: String,
    isEmailConfirmed: {
      type: Boolean,
      default: false,
    },
    oauth: {
      github: {
        id: String,
        username: String,
      },
      google: {
        id: String,
        email: String,
      },
    },
  },
  { timestamps: true }
);

// Encrypt password
UserSchema.pre("save", async function (next) {
  if (this.oauth) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Cascade deletion
UserSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const userId = doc._id;

    // Delete responses associated with surveys owned by the user
    await mongoose.model("Response").deleteMany({
      survey: {
        $in: await mongoose
          .model("Survey")
          .find({ owner: userId })
          .select("_id"),
      },
    });

    // Delete questions associated with surveys owned by the user
    const ownedSurveyIds = await mongoose
      .model("Survey")
      .find({ owner: userId })
      .select("questions")
      .lean();

    const questionIds = ownedSurveyIds.map((survey) => survey.questions).flat();

    await mongoose.model("Question").deleteMany({ _id: { $in: questionIds } });

    // Delete surveys owned by the user
    await mongoose.model("Survey").deleteMany({ owner: userId });
  }
});

// Sign JWT token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, JwtSecret, {
    expiresIn: JwtExpires,
  });
};

// Compare passwords
UserSchema.methods.matchPasswords = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set exipre
  this.resetPasswordExpire = Date.now() + 1000 * 60 * 15;

  return resetToken;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
