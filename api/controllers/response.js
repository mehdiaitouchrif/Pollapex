const Response = require("../models/response");
const Survey = require("../models/survey");

// @desc    Submit response
// @route   POST /api/surveys/:id/responses
exports.submitResponse = async (req, res, next) => {
  const { id: surveyId } = req.params;

  try {
    const survey = await Survey.findById(surveyId).populate({
      path: "questions",
      select: "_id question",
    });
    if (!survey) {
      throw new Error("Survey not found");
    }

    const answers = req.body;

    // Check if required questions have been answered
    const requiredQuestions = survey.questions.filter(
      (question) => !question.optional
    );
    const answeredQuestions = answers.map((answer) => answer.question);
    const unansweredQuestions = requiredQuestions.filter(
      (question) => !answeredQuestions.includes(question._id.toString())
    );
    if (unansweredQuestions.length > 0) {
      unansweredQuestions.map(({ question }) => {
        throw new Error(`"${question}" is required`);
      });
    }

    // Create the response
    const response = await Response.create({
      survey,
      answers,
    });

    return res.status(201).json({ success: true, data: response });
  } catch (error) {
    next(error);
  }
};

// @desc  Edit response
// @route PUT /api/responses/:id
exports.editResponse = async (req, res, next) => {
  try {
    const response = await Response.findOneAndUpdate(
      { _id: req.params.id },
      {
        answers: req.body,
      },
      { new: true }
    );

    if (!response) {
      const error = new Error("Response not found");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    next(error);
  }
};

// @desc    Get survey responses
// @route   /api/surveys/:id/responses
exports.getResponses = async (req, res, next) => {
  const { id: surveyId } = req.params;

  try {
    const survey = await Survey.findById(surveyId);
    if (!survey) {
      const error = new Error("Survey not found");
      error.statusCode = 404;
      throw error;
    }

    const responses = await Response.find({ survey: surveyId }).populate({
      path: "answers.question",
      select: "question",
    });
    res.status(200).json({ success: true, data: responses });
  } catch (error) {
    next(error);
  }
};

// @desc  Get response by id
// @route GET /api/responses/:id
exports.getResponse = async (req, res, next) => {
  try {
    const response = await Response.findById(req.params.id);
    if (!response) {
      const error = new Error("Response not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    next(error);
  }
};
