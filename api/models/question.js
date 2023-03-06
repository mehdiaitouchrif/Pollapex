const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  optional: { type: Boolean, default: false },
  type: {
    type: String,
    enum: [
      "text",
      "paragraph",
      "singleChoice",
      "multipleChoice",
      "rating",
      "date",
      "time",
      "email",
      "phone",
    ],
    required: true,
  },
  choices: [{ type: String }],
});

const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;
