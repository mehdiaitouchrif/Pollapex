const { JwtCookieExpires, productionEnv } = require("../config");

// Get token & create cookie
exports.sendTokenResponse = (user, statusCode, res) => {
  try {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
      expires: new Date(Date.now() + JwtCookieExpires * 24 * 60 * 60 * 1000),
      httpOnly: productionEnv,
    };

    res
      .status(statusCode)
      .cookie("token", token, options)
      .json({ success: true, token, user });
  } catch (error) {
    console.error("Error generating token", error);
    res.status(500).json({ success: false, error: "Error generating token" });
  }
};
