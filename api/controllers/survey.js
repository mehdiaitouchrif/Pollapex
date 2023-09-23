const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const Survey = require("../models/survey");
const Question = require("../models/question");
const User = require("../models/user");
const Response = require("../models/response");
const sendEmail = require("../utils/sendEmail");

// @desc    Get surveys
// @route   GET /api/surveys
exports.getSurveysByUser = async (req, res, next) => {
  try {
    let limit = null;
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }

    const userId = req.user._id;
    let query = Survey.find({
      $or: [{ owner: userId }, { collaborators: { $in: [userId] } }],
    })
      .populate("owner", "-password")
      .populate("collaborators", "-password")
      .populate("pendingCollabs", "-password")
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
      .populate("pendingCollabs", "-password")
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
    const survey = await Survey.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!survey) {
      const error = new Error("Survey not found");
      error.statusCode = 404;
      throw error;
    }

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

// @desc    Send collaboration invite
// @route   POST /surveys/:surveyId/invitations
exports.sendCollaborationInvite = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { id: surveyId } = req.params;

    // check survey
    const survey = await Survey.findById(surveyId);

    if (!survey) {
      const error = new Error("No survey found");
      error.statusCode = 404;
      throw error;
    }

    // Check user to be invited
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("No user with this email found");
      error.statusCode = 404;
      throw error;
    }

    // Generate a unique and secure token for this invitation
    const token = jwt.sign({ email, surveyId }, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "365d",
    });

    // Update pending collabs on this survey
    const existingCollabds = [
      ...survey.pendingCollabs.map((id) => id.toString()),
      ...survey.collaborators.map((id) => id.toString()),
    ];
    if (!existingCollabds.includes(user._id.toString())) {
      survey.pendingCollabs.push(user._id);
      survey.save();
    }

    // Add invitation to user
    const existingInvitation = user.invitations.find(
      (invitation) =>
        invitation.survey.toString() === surveyId &&
        invitation.invitationToken !== "expired"
    );

    if (!existingInvitation) {
      // Add invitation to user
      user.invitations.push({
        survey: surveyId,
        invitationToken: token,
      });
      user.save();
    }

    // Compose the invitation link
    const invitationLink = `${process.env.CLIENT_URL}/invitations`;

    // Email template
    const emailTemplate = fs.readFileSync(
      path.join(__dirname, "../emailTemplates", "collaborationInvite.ejs"),
      "utf8"
    );

    const compiledEmailTemplate = ejs.compile(emailTemplate);
    const templateVars = {
      username: user.name,
      fromUser: req.user.name,
      surveyTitle: survey.title,
      invitationLink,
    };

    // send email
    try {
      await sendEmail({
        email: user.email,
        subject: `Collaboration Invite on ${survey.title}`,
        html: compiledEmailTemplate(templateVars),
      });
      res.status(200).json({
        success: true,
        link: invitationLink,
        data: "Invitation email sent with success!",
      });
    } catch (err) {
      console.log(err);
      const error = new Error("Email sending failed");
      error.statusCode = 500;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Accept collaboration invite
// @route   POST /surveys/accept-invite/:token
exports.acceptCollaborationInvite = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Verify and decode the invitation token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Extract data from the decoded token
    const { email, surveyId } = decodedToken;

    // Check if the survey exists
    const survey = await Survey.findById(surveyId);

    if (!survey) {
      const error = new Error("No survey found");
      error.statusCode = 404;
      throw error;
    }

    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("No user with this email found");
      error.statusCode = 404;
      throw error;
    }

    // Remove the user from the pending collaborators
    survey.pendingCollabs = survey.pendingCollabs.filter(
      (userId) => userId.toString() !== user._id.toString()
    );

    // Add the user to the collaborators
    survey.collaborators.push(user._id);
    survey.save();

    // update the invitation from the user's invitations
    user.invitations = user.invitations.map((invitation) =>
      invitation.survey.toString() === surveyId &&
      invitation.invitationToken === token
        ? { ...invitation, accepted: true }
        : invitation
    );

    user.save();

    res.status(200).json({
      success: true,
      data: "Invitation accepted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Decline collaboration invite
// @route   POST /surveys/decline-invite/:token
exports.declineCollaborationInvite = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Verify and decode the invitation token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Extract data from the decoded token
    const { email, surveyId } = decodedToken;

    // Check if the survey exists
    const survey = await Survey.findById(surveyId);

    if (!survey) {
      const error = new Error("No survey found");
      error.statusCode = 404;
      throw error;
    }

    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("No user with this email found");
      error.statusCode = 404;
      throw error;
    }

    // Remove the invitation from the user's invitations
    user.invitations = user.invitations.filter(
      (invitation) =>
        invitation.survey.toString() !== surveyId ||
        invitation.invitationToken !== token
    );

    // Remove the user from the pending collaborators in the survey
    survey.pendingCollabs = survey.pendingCollabs.filter(
      (userId) => userId.toString() !== user._id.toString()
    );

    user.save();
    survey.save();

    res.status(200).json({
      success: true,
      data: "Invitation declined successfully!",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete collaborator or cancel invite
// @route   DELETE /surveys/:id/users/:userId
exports.deleteCollaboratorOrCancelInvite = async (req, res, next) => {
  try {
    const { id: surveyId, userId } = req.params;

    // Check if the survey exists
    const survey = await Survey.findOne({ _id: surveyId, owner: req.user._id });

    if (!survey) {
      const error = new Error("No survey found");
      error.statusCode = 404;
      throw error;
    }

    // Check if the user to be removed exists in the collaborators list or pending collaborators
    if (
      !survey.collaborators.includes(userId) &&
      !survey.pendingCollabs.includes(userId)
    ) {
      const error = new Error("User is not a collaborator on this survey");
      error.statusCode = 400;
      throw error;
    }

    // If the user is a pending collaborator, cancel the invite
    if (survey.pendingCollabs.includes(userId)) {
      // Remove the user from the pending collaborators list
      survey.pendingCollabs = survey.pendingCollabs.filter(
        (id) => id.toString() !== userId
      );

      // Invalidate the invitation token
      const user = await User.findById(userId);
      if (user) {
        // Find and update the invitation with the corresponding survey ID and token
        const updatedInvitations = user.invitations.map((invitation) => {
          if (invitation.survey.toString() === surveyId) {
            return {
              ...invitation,
              invitationToken: "expired",
            };
          }
          return invitation;
        });

        user.invitations = updatedInvitations;
        await user.save();
      }
    }

    // Remove the user from the collaborators list
    survey.collaborators = survey.collaborators.filter(
      (id) => id.toString() !== userId
    );

    await survey.save();

    res.status(200).json({
      success: true,
      data: "Collaborator removed or invite canceled successfully!",
    });
  } catch (error) {
    next(error);
  }
};
