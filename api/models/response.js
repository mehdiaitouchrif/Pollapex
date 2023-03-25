const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  answer: { type: mongoose.Schema.Types.Mixed, required: true },
});

const ResponseSchema = new mongoose.Schema({
  survey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Survey",
    required: true,
  },
  answers: [{ type: AnswerSchema }],
  submittedAt: {
    type: Date,
    default: Date.now(),
  },
  meta: {
    location: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
});

const Response = mongoose.model("Response", ResponseSchema);

module.exports = Response;
