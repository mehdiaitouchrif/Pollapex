const excel = require("exceljs");
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

    const { answers, meta } = req.body;

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
        const error = new Error(`"${question}" is required`);
        error.statusCode = 400;
        throw error;
      });
    }

    // Create the response
    const response = await Response.create({
      survey,
      answers,
      meta,
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

  if (surveyId) {
    // Get specific survey responses
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
  } else {
    let limit = null;
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }

    loggedInUser = req.user._id.toString();
    const surveys = await Survey.find({ owner: loggedInUser }).select("_id");
    const surveyIds = surveys.map((survey) => survey._id);

    let query = Response.find({ survey: { $in: surveyIds } })
      .sort({ submittedAt: -1 })
      .populate({
        path: "survey",
        select: "title owner",
      });

    if (limit) {
      query = query.limit(limit);
    }

    const responses = await query.exec();
    return res.status(200).json({ success: true, data: responses });
  }
};

// @desc  Get response by id
// @route GET /api/responses/:id
exports.getResponse = async (req, res, next) => {
  try {
    const response = await Response.findById(req.params.id).populate({
      path: "answers.question survey",
      select: "question type title",
    });
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

// @desc  Export responses in excel file
// @route  GET /api/surveys/:id/export
exports.exportResponsesToExcel = async (req, res, next) => {
  try {
    // Get survey ID from request params
    const { id } = req.params;

    // Find the survey with the given ID
    const survey = await Survey.findById(id).populate("questions");

    // Make sure user owns survey
    if (req.user._id.toString() !== survey.owner.toString()) {
      const error = new Error("Unauthorized");
      error.statusCode = 403;
      throw error;
    }

    // Find all responses for the survey
    const responses = await Response.find({ survey: id }).populate({
      path: "answers.question",
      model: "Question",
    });

    // Create a new workbook
    const workbook = new excel.Workbook();

    // Add a new worksheet
    const worksheet = workbook.addWorksheet("Responses");

    // Add column headers
    worksheet.columns = survey.questions.map((question) => ({
      header: question.question,
      key: question._id.toString(),
      width: 30,
    }));

    // Loop through each response and add the data to the worksheet
    responses.forEach((response) => {
      const row = {};
      response.answers.forEach((answer) => {
        row[answer.question._id.toString()] = answer.answer;
      });
      worksheet.addRow(row);
    });

    // Set the response headers to tell the browser to download the file as an Excel file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + `${survey.title}_responses.xlsx`
    );

    // Write the workbook to the response
    await workbook.xlsx.write(res);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
