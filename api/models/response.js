const mongoose = require("mongoose");

const ResponseSchema = new mongoose.Schema({
  survey_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Survey",
    required: true,
  },
  respondent_name: { type: String, required: true },
  respondent_email: { type: String, required: true },
  answers: [{ type: AnswerSchema }],
});

const AnswerSchema = new mongoose.Schema({
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  answer: { type: mongoose.Schema.Types.Mixed, required: true },
});

const Response = mongoose.model("Response", ResponseSchema);

module.exports = Response;
