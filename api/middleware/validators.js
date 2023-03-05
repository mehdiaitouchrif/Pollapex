const { body } = require("express-validator");

const createSurveyValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("collaborators.*")
    .optional()
    .isMongoId()
    .withMessage("Collaborator ID must be a valid MongoDB ID"),
  body("questions.*").optional(),
  body("backgroundImage").optional().isURL().withMessage("Invalid URL format"),
  body("theme")
    .optional()
    .isIn(["light", "dark", "blue", "custom"])
    .withMessage("Invalid theme"),
];

module.exports = { createSurveyValidator };
