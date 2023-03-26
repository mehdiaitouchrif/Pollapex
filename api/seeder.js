const fs = require("fs");
const User = require("./models/user");
const Question = require("./models/question");
const Survey = require("./models/survey");
const Response = require("./models/response");

// Load env
require("dotenv").config();

// Connect to db
require("./config/database")();

// Read JSON data
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/data/users.json`, "utf-8")
);

const questions = JSON.parse(
  fs.readFileSync(`${__dirname}/data/questions.json`, "utf-8")
);
const surveys = JSON.parse(
  fs.readFileSync(`${__dirname}/data/surveys.json`, "utf-8")
);
const responses = JSON.parse(
  fs.readFileSync(`${__dirname}/data/responses.json`, "utf-8")
);

// Populate database
const importData = async () => {
  try {
    await User.insertMany(users);
    await Question.insertMany(questions);
    await Survey.insertMany(surveys);
    await Response.insertMany(responses);
    console.log("DATA IMPORTED!!");
    process.exit(1);
  } catch (error) {
    console.error(error);
  }
};

// Destroy database
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Question.deleteMany();
    await Survey.deleteMany();
    await Response.deleteMany();

    console.log("DATA DESTROYED!!");
    process.exit(1);
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
