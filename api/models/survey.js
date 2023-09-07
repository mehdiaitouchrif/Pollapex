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

// // Cascade delete responses/questions when survey is deleted
// SurveySchema.pre("deleteOne", async function (next) {
//   await this.model("Response").deleteMany({ survey: this._id });
//   // await this.model("Question").deleteMany({ _id: { $in: this.questions } });
//   next();
// });

const Survey = mongoose.model("Survey", SurveySchema);

module.exports = Survey;
