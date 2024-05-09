const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JwtSecret } = require("../config");

// Protect routes
exports.protect = async (req, res, next) => {
  let token;
  if (req.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, errors: [{ msg: "Not authorized" }] });
  }

  // Validate token
  try {
    const decoded = jwt.verify(token, JwtSecret);
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, errors: [{ msg: "Not authorized" }] });
  }
};
