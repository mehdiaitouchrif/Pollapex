const Survey = require("../models/survey");
const Question = require("../models/question");
const User = require("../models/user");
const Response = require("../models/response");

// @desc    Get surveys
// @route   GET /api/surveys
exports.getSurveysByUser = async (req, res, next) => {
  try {
    let limit = null;
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }

    let query = Survey.find({ owner: req.user._id })
      .populate("owner", "-password")
      .populate("collaborators", "-password")
      .populate("questions");

    if (limit) {
      query = query.limit(limit);
    }

    query = query.sort({ createdAt: -1 });
    const surveys = await query.exec();
    res.status(200).json({ success: true, data: surveys });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single survey
// @route   GET /api/surveys/:id
exports.getSurveyById = async (req, res, next) => {
  try {
    const survey = await Survey.findOne({ _id: req.params.id })
      .populate("owner", "-password")
      .populate("collaborators", "-password")
      .populate("questions");
    if (!survey) {
      const error = new Error("Survey not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ success: true, data: survey });
  } catch (error) {
    next(error);
  }
};

// @desc    Create survey
// @route   POST /api/surveys
exports.createSurvey = async (req, res, next) => {
  try {
    const {
      title,
      description,
      backgroundImage,
      theme,
      questions,
      active,
      published,
    } = req.body;
    const survey = new Survey({
      title,
      description,
      owner: req.user._id,
      backgroundImage,
      theme,
      active,
      published,
      questions: await Question.insertMany(questions),
    });
    await survey.save();
    res.status(201).json({ success: true, data: survey });
  } catch (error) {
    next(error);
  }
};

// @desc    Update survey
// @route   PUT /api/surveys/:id
exports.updateSurvey = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      collaborators,
      backgroundImage,
      theme,
      customTheme,
      questions,
      active,
      published,
    } = req.body;
    const update = {};

    if (title) update.title = title;
    if (description) update.description = description;
    if (collaborators)
      update.collaborators = await User.find({
        email: { $in: [...collaborators] },
      }).select("_id");
    if (backgroundImage) update.backgroundImage = backgroundImage;
    if (theme) update.theme = theme;
    if (customTheme) update.customTheme = customTheme;
    if (questions) update.questions = await Question.insertMany(questions);
    if (active) update.active = active;
    if (published) update.published = published;

    // Verify user is owner or collaborator
    const survey = await Survey.findOne({ _id: id })
      .populate("owner")
      .populate("collaborators");
    if (!survey) {
      const error = new Error("Survey not found");
      error.statusCode = 404;
      throw error;
    }
    if (
      survey.owner._id.toString() !== req.user.id &&
      !survey.collaborators.some(
        (collaborator) => collaborator._id.toString() === req.user.id
      )
    ) {
      const error = new Error("Unauthorized");
      error.statusCode = 403;
      throw error;
    }

    const updatedSurvey = await Survey.findOneAndUpdate({ _id: id }, update, {
      new: true,
    });

    res.status(200).json({ survey: updatedSurvey });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete survey
// @route   DELETE /api/surveys/:id
exports.deleteSurvey = async (req, res, next) => {
  try {
    const survey = await Survey.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!survey) {
      const error = new Error("Survey not found");
      error.statusCode = 404;
      throw error;
    }

    // delete responses & questions
    await Response.deleteMany({ survey: survey._id });
    await Question.deleteMany({ _id: { $in: survey.questions } });

    await survey.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

exports.getSurveyAnalytics = async (req, res, next) => {
  try {
    const surveyId = req.params.id;

    const survey = await Survey.findById(surveyId).populate("questions");
    if (!survey) {
      const error = new Error("Survey not found");
      error.statusCode = 404;
      throw error;
    }

    const responses = await Response.find({ survey: surveyId }).populate(
      "answers.question"
    );

    const questionAnalytics = {};

    for (const question of survey.questions) {
      questionAnalytics[question._id] = {
        question: question.question,
        type: question.type,
        data: {},
        totalCount: 0,
      };
    }

    for (const response of responses) {
      for (const answer of response.answers) {
        const questionId = answer.question._id.toString();
        const value = answer.answer;

        if (!questionAnalytics[questionId].data[value]) {
          questionAnalytics[questionId].data[value] = {
            count: 0,
            percentage: 0,
          };
        }
        questionAnalytics[questionId].data[value].count++;
        questionAnalytics[questionId].totalCount++;
      }
    }

    // Calculate percentage for each answer
    for (const questionId in questionAnalytics) {
      for (const value in questionAnalytics[questionId].data) {
        const count = questionAnalytics[questionId].data[value].count;
        const totalCount = questionAnalytics[questionId].totalCount;

        questionAnalytics[questionId].data[value].percentage =
          (count / totalCount) * 100;
      }
    }

    return res.json({ success: true, data: questionAnalytics });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
