const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const { connectDB, closeDB, clearDB } = require("./setup");
const Survey = require("../models/survey");
const Response = require("../models/response");
const Question = require("../models/question");

// Use a separate database for this test file
process.env.TEST_DATABASE_URI = "mongodb://localhost:27017/response-test";

describe("Response Controllers", () => {
  let token;
  let survey;
  let responseId;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  beforeEach(async () => {
    // Signup a new user
    const signupResponse = await request(app).post("/api/auth/signup").send({
      name: "Test User",
      email: "testuser123@example.com",
      password: "password",
    });
    token = signupResponse.body.token;

    // Create a new survey
    const createSurveyResponse = await request(app)
      .post("/api/surveys")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Survey",
        description: "A survey for testing purposes",
        questions: [
          {
            question: "What is your favorite color?",
            type: "text",
          },
          {
            question: "What is your favorite animal?",
            type: "text",
          },
        ],
      });
    survey = createSurveyResponse.body.data;

    // Create some responses for the survey
    const createResponseData = await Response.create({
      survey: survey._id,
      answers: [
        { question: survey.questions[0]._id, answer: "Blue" },
        { question: survey.questions[1]._id, answer: "Dog" },
      ],
      meta: { ipAddress: "127.0.0.1" },
    });
    responseId = createResponseData._id;
  });

  afterEach(async () => {
    await clearDB();
  });

  describe("submitResponse", () => {
    it("should create a new response for a survey", async () => {
      const responseCount = await Response.countDocuments();
      const response = {
        answers: [
          {
            question: survey.questions[0]._id,
            answer: "Green",
          },
          {
            question: survey.questions[1]._id,
            answer: "Lion",
          },
        ],
        meta: {
          ipAddress: "127.0.0.1",
          userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
        },
      };
      await request(app)
        .post(`/api/surveys/${survey._id}/responses`)
        .set("Authorization", `Bearer ${token}`)
        .send(response)
        .expect(201);

      const newResponseCount = await Response.countDocuments();
      expect(newResponseCount).toBe(responseCount + 1);
    });

    it("should return an error if required questions are not answered", async () => {
      const response = {
        answers: [],
        meta: {
          ipAddress: "127.0.0.1",
          userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
        },
      };

      const responseCount = await Response.countDocuments();

      const res = await request(app)
        .post(`/api/surveys/${survey._id}/responses`)
        .set("Authorization", `Bearer ${token}`)
        .send(response)
        .expect(400);

      expect(res.body.errors[0].msg).toBe(
        '"What is your favorite color?" is required'
      );
      const newResponseCount = await Response.countDocuments();
      expect(newResponseCount).toBe(responseCount);
    });
  });

  describe("editResponse", () => {
    it("should edit an existing response", async () => {
      const newAnswers = [
        { question: survey.questions[0]._id, answer: "New answer 1" },
        { question: survey.questions[1]._id, answer: "New answer 2" },
      ];

      const responseToUpdate = {
        answers: newAnswers,
      };

      const response = await request(app)
        .put(`/api/responses/${responseId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(responseToUpdate)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.answers).not.toEqual(
        expect.objectContaining(newAnswers)
      );
    });

    it("should return 404 if response does not exist", async () => {
      const response = await request(app)
        .get(`/api/responses/${new mongoose.Types.ObjectId()}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.errors[0].msg).toBe("Response not found");
    });
  });

  describe("getResponse", () => {
    it("should return a single response", async () => {
      const response = await request(app)
        .get(`/api/responses/${responseId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(responseId.toString());
      expect(response.body.data.survey).toBeDefined();
      expect(response.body.data.answers).toBeDefined();
    });

    it("should return 404 if response does not exist", async () => {
      const response = await request(app)
        .get(`/api/responses/${new mongoose.Types.ObjectId()}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.errors[0].msg).toBe("Response not found");
    });
  });

  describe("getResponses", () => {
    it("should return all responses of a survey", async () => {
      const response = await request(app)
        .get(`/api/surveys/${survey._id}/responses`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      // Check that the correct responses were returned
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].survey.toString()).toBe(
        survey._id.toString()
      );
      expect(response.body.data[0].answers.length).toBe(2);
      expect(response.body.data[0].answers[0].question.question).toBe(
        "What is your favorite color?"
      );
      expect(response.body.data[0].answers[0].answer).toBe("Blue");
    });

    it("should return an empty array if no responses exist for the survey", async () => {
      // Create a survey
      const survey = await Survey.create({
        title: "Test Survey",
        description: "Test Survey description",
        owner: new mongoose.Types.ObjectId(),
        questions: await Question.insertMany([
          { question: "What is your favorite color?", type: "text" },
        ]),
      });

      // Make a request to get the responses for the survey
      const response = await request(app)
        .get(`/api/surveys/${survey._id}/responses`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      // Check that an empty array was returned
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(0);
    });
  });
});
