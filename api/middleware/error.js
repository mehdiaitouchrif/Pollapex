const { validationResult } = require("express-validator");

const handleInputErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
  } else {
    next();
  }
};

module.exports = handleInputErrors;
