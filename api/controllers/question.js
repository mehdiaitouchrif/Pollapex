const Question = require("../models/question");

// Create a question
exports.createQuestion = async (req, res, next) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

// Get a single question by ID
exports.getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      const error = new Error("Question not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

// Update a question by ID
exports.updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!question) {
      const error = new Error("Question not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

// Delete a question by ID
exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      const error = new Error("Question not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};
