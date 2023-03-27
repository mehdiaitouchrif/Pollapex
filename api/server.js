const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));

// Router
app.use("/api/auth", require("./routes/auth"));
app.use("/api/surveys", require("./routes/survey"));
app.use("/api/questions", require("./routes/question"));
app.use("/api/responses", require("./routes/response"));

app.get("/api/hello", (req, res) => {
  res.status(200).json("Hello world");
});

// Error
app.use((err, req, res, next) => {
  res.status(err.statusCode || (err.code === 11000 && 400) || 500);
  res.json({
    success: false,
    errors: [{ msg: err.message || "server error" }],
  });
});

module.exports = app;
