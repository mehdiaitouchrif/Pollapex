const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const { connectDB, closeDB, clearDB } = require("./setup");

// Use a separate database for this test file
process.env.TEST_DATABASE_URI = "mongodb://localhost:27017/survey-test";

describe("Survey Controllers", () => {
  let token;
  let surveyId;

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
        questions: [{ question: "What is your favorite color?", type: "text" }],
      });
    surveyId = createSurveyResponse.body.data._id;
  });

  afterEach(async () => {
    await clearDB();
  });

  describe("getSurveysByUser", () => {
    it("should return surveys belonging to the user", async () => {
      const response = await request(app)
        .get("/api/surveys")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("getSurveyById", () => {
    it("should return a single survey", async () => {
      const response = await request(app)
        .get(`/api/surveys/${surveyId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(surveyId);
      expect(response.body.data.title).toBe("Test Survey");
    });
    it("should return 404 error if survey not found", async () => {
      const wrongId = "123456789012";
      const response = await request(app)
        .get(`/api/surveys/${wrongId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("createSurvey", () => {
    it("should create a new survey", async () => {
      const surveyData = {
        title: "Test Survey",
        description: "A test survey",
        backgroundImage: "http://example.com/image.jpg",
        theme: "light",
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
        active: true,
        published: true,
      };

      const response = await request(app)
        .post("/api/surveys")
        .set("Authorization", `Bearer ${token}`)
        .send(surveyData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe("Test Survey");
      expect(response.body.data.description).toBe("A test survey");
      expect(response.body.data.backgroundImage).toBe(
        "http://example.com/image.jpg"
      );
      expect(response.body.data.theme).toBe("light");
      expect(response.body.data.questions.length).toBe(2);
      expect(response.body.data.active).toBe(true);
      expect(response.body.data.published).toBe(true);
    });

    it("should return a 401 status code if user is not authenticated", async () => {
      const response = await request(app)
        .post("/api/surveys")
        .send({
          title: "My Survey",
          description: "This is a survey",
          active: true,
          published: true,
          questions: [
            {
              question: "What is your name?",
              type: "text",
            },
          ],
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.errors[0].msg).toContain("Not authorized");
    });
  });

  describe("updateSurvey", () => {
    it("should update an existing survey", async () => {
      const res = await request(app)
        .put(`/api/surveys/${surveyId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Updated Test Survey",
        })
        .expect(200);

      expect(res.body.survey.title).toBe("Updated Test Survey");
    });

    it("should return a 404 error if the survey does not exist", async () => {
      const res = await request(app)
        .put(`/api/surveys/${new mongoose.Types.ObjectId()}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "New Title",
        })
        .expect(404);

      expect(res.body.errors[0].msg).toBe("Survey not found");
    });
  });
});
