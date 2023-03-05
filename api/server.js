const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Router
app.use("/api/auth", require("./routes/auth"));

// Error
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  res.json({
    success: false,
    errors: [{ msg: err.message || "server error" }],
  });
});

module.exports = app;
