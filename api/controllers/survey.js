const Survey = require("../models/survey");
const Question = require("../models/question");

// @desc    Get surveys
// @route   GET /api/surveys
exports.getSurveysByUser = async (req, res, next) => {
  try {
    const surveys = await Survey.find({ owner: req.user._id })
      .populate("owner", "-password")
      .populate("collaborators", "-password")
      .populate("questions");
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
    const { title, description, backgroundImage, theme, questions } = req.body;
    const survey = new Survey({
      title,
      description,
      owner: req.user._id,
      backgroundImage,
      theme,
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
    } = req.body;
    const update = {};

    if (title) update.title = title;
    if (description) update.description = description;
    if (collaborators) update.collaborators = collaborators;
    if (backgroundImage) update.backgroundImage = backgroundImage;
    if (theme) update.theme = theme;
    if (customTheme) update.customTheme = customTheme;
    if (questions) update.questions = await Question.insertMany(questions);

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
    await survey.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
