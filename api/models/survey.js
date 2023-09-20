const mongoose = require("mongoose");

const SurveySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    pendingCollabs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    backgroundImage: { type: String },
    theme: {
      type: String,
      enum: ["light", "dark", "blue", "custom"],
      default: "light",
    },
    customTheme: { type: String },
    published: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Cascade deletion
SurveySchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const surveyId = doc._id;

    // Delete responses associated with the survey
    await mongoose.model("Response").deleteMany({ survey: surveyId });

    // Delete questions associated with the survey
    const questionIds = doc.questions;

    await mongoose.model("Question").deleteMany({ _id: { $in: questionIds } });
  }
});

const Survey = mongoose.model("Survey", SurveySchema);

module.exports = Survey;
