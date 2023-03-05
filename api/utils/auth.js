const { JwtCookieExpires, productionEnv } = require("../config");

// Get token & create cookie
exports.sendTokenResponse = (user, code, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + JwtCookieExpires * 24 * 60 * 60 * 1000),
    httpOnly: productionEnv,
  };

  res
    .status(code)
    .cookie("token", token, options)
    .json({ success: true, token });
};
