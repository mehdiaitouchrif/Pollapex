const request = require("supertest");
const app = require("../server");
const { connectDB, closeDB } = require("./setup");

describe("Question Controllers", () => {
  let token;
  let questionId;

  beforeAll(async () => {
    await connectDB();

    // Signup a new user
    const signupResponse = await request(app).post("/api/auth/signup").send({
      name: "Test User",
      email: "testuser123@example.com",
      password: "password",
    });
    token = signupResponse.body.token;

    // Create a new question
    const createResponse = await request(app)
      .post("/api/questions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        question: "What is your favorite color?",
        type: "text",
      });
    questionId = createResponse.body.data._id;
  });

  afterAll(async () => {
    await closeDB();
  });

  describe("getQuestionById", () => {
    it("should return a single question", async () => {
      const response = await request(app)
        .get(`/api/questions/${questionId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(questionId);
      expect(response.body.data.question).toBe("What is your favorite color?");
    });

    it("should return an error if the question does not exist", async () => {
      const response = await request(app)
        .delete(`/api/questions/60b1c56842c130001528a6b3`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
      expect(response.body.success).toBe(false);
      expect(response.body.errors[0].msg).toBe("Question not found");
    });
  });

  describe("updateQuestion", () => {
    it("should update a question", async () => {
      const response = await request(app)
        .put(`/api/questions/${questionId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          question: "What is your favorite animal?",
          type: "text",
        })
        .expect(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(questionId);
      expect(response.body.data.question).toBe("What is your favorite animal?");
    });

    it("should return an error if the question does not exist", async () => {
      const response = await request(app)
        .put(`/api/questions/60b1c56842c130001528a6b3`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          question: "What is your favorite animal?",
          type: "text",
        })
        .expect(404);
      expect(response.body.success).toBe(false);
      expect(response.body.errors[0].msg).toBe("Question not found");
    });
  });

  describe("deleteQuestion", () => {
    it("should delete a question", async () => {
      const response = await request(app)
        .delete(`/api/questions/${questionId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);
      expect(response.body).toEqual({});
    });

    it("should return an error if the question does not exist", async () => {
      const response = await request(app)
        .delete(`/api/questions/60b1c56842c130001528a6b3`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
      expect(response.body.success).toBe(false);
      expect(response.body.errors[0].msg).toBe("Question not found");
    });
  });
});
