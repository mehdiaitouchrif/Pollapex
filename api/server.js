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
const corsOptions = {
  // origin: ["https://pollapex.vercel.app", "http://localhost:3000"],
  // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  // credentials: true,
  // optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());
if (!productionEnv) {
  app.use(morgan("dev"));
}

// Router
app.use("/api/auth", require("./routes/auth"));
app.use("/api/surveys", require("./routes/survey"));
app.use("/api/questions", require("./routes/question"));
app.use("/api/responses", require("./routes/response"));
app.get("/api/statistics", protect, generateStatistis);
app.use("/api/subscribers", require("./routes/subscriber"));

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
