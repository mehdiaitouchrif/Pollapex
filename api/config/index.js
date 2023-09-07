require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3001,
  productionEnv: process.env.NODE_ENV === "production",
  dbUrl: process.env.MONGO_URI,
  JwtSecret: process.env.JWT_SECRET,
  JwtExpires: process.env.JWT_EXPIRE,
  JwtCookieExpires: process.env.JWT_COOKIE_EXPIRE,
};
