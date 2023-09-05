const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const { protect } = require("./middleware/auth");
const { generateStatistis } = require("./controllers/statistics");
const path = require("path");
const { productionEnv } = require("./config");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
if (!productionEnv) {
  app.use(morgan("dev"));
}

// Router
app.use("/api/auth", require("./routes/auth"));
app.use("/api/surveys", require("./routes/survey"));
app.use("/api/questions", require("./routes/question"));
app.use("/api/responses", require("./routes/response"));
app.get("/api/statistics", protect, generateStatistis);

app.get("/api/hello", (req, res) => {
  res.status(200).json("Hello world");
});

app.use(express.static(path.join(__dirname, "public")));

// Error
app.use((err, req, res, next) => {
  res.status(err.statusCode || (err.code === 11000 && 400) || 500);
  res.json({
    success: false,
    errors: [{ msg: err.message || "server error" }],
  });
});

module.exports = app;
