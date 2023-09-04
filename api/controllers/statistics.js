const Survey = require("../models/survey");
const Response = require("../models/response");

exports.generateStatistis = async (req, res, next) => {
  try {
    const userId = req.user.id; // Replace this with how you access the user ID

    // Get all surveys created by the user
    const userSurveys = await Survey.find({ owner: userId });

    // Calculate the total number of surveys created by the user
    const totalSurveys = userSurveys.length;

    // Calculate the total number of questions created by the user
    const totalQuestions = userSurveys.reduce(
      (acc, survey) => acc + survey.questions.length,
      0
    );

    // Get all responses submitted by the user for their surveys
    const userResponses = await Response.find({
      survey: { $in: userSurveys.map((survey) => survey._id) },
    });

    // Calculate the total number of responses submitted by the user
    const totalResponses = userResponses.length;

    // Calculate the average number of questions per survey
    const averageQuestionsPerSurvey =
      totalSurveys > 0 ? totalQuestions / totalSurveys : 0;

    // Calculate the average number of responses per survey
    const averageResponsesPerSurvey =
      totalSurveys > 0 ? totalResponses / totalSurveys : 0;

    // Calculate the average response time for the user's surveys
    const averageResponseTime =
      totalResponses > 0 ? calculateAverageResponseTime(userResponses) : "N/A";

    // Prepare the response data
    const statistics = {
      totalSurveys,
      totalQuestions,
      totalResponses,
      averageQuestionsPerSurvey,
      averageResponsesPerSurvey,
      averageResponseTime,
    };

    res.json({ success: true, data: statistics });
  } catch (error) {
    next(error);
  }
};

function calculateAverageResponseTime(responses) {
  const totalResponseTime = responses.reduce(
    (acc, response) => acc + response.submittedAt.getTime(),
    0
  );
  const averageTime = totalResponseTime / responses.length;
  return formatTime(averageTime); // Format the time as needed
}

function formatTime(milliseconds) {
  // Format the time in hours, minutes, seconds, etc.
  // Example: "2 hours 30 minutes"
  // Implement your formatting logic here
  return "N/A"; // Placeholder for formatting
}
