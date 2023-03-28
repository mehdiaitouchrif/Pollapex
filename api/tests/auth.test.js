const request = require("supertest");
const { connectDB, closeDB, clearDB } = require("./setup/index");

const app = require("../server");

// Use a separate database for this test file
process.env.TEST_DATABASE_URI = "mongodb://localhost:27017/question-test";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await closeDB();
});

beforeEach(async () => {
  await clearDB();
});

describe("POST /api/auth/signup", () => {
  it("should create a new user and return a token", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.headers).toHaveProperty("set-cookie");
  });

  it("should return a 400 status if the email is invalid", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "John Doe",
      email: "johnexample.com",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });

  it("should return a 400 status if any required field is missing", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "John Doe",
      email: "john@example.com",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });

  it("should return a 400 status if the password is too short", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "John Doe",
      email: "john@example.com",
      password: "pass",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });

  it("should return a 400 status if the email already exists", async () => {
    await request(app).post("/api/auth/signup").send({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/signup").send({
      name: "John Doe",
      email: "jane@example.com",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });
});

describe("POST /api/auth/signin", () => {
  beforeEach(async () => {
    await request(app).post("/api/auth/signup").send({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
    });
  });

  it("should sign in the user and return a token", async () => {
    const res = await request(app)
      .post("/api/auth/signin")
      .send({ email: "jane@example.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  // Test case for invalid password
  it("should return a 401 status and error message for invalid password", async () => {
    const res = await request(app)
      .post("/api/auth/signin")
      .send({ email: "jane@example.com", password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Invalid email or password");
  });

  // Test case for invalid email
  it("should return a 401 status and error message for invalid email", async () => {
    const res = await request(app)
      .post("/api/auth/signin")
      .send({ email: "invalid@example.com", password: "password123" });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Invalid email or password");
  });

  // Test case for missing email
  it("should return a 400 status and error message for missing email", async () => {
    const res = await request(app)
      .post("/api/auth/signin")
      .send({ password: "password123" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Please enter a valid email");
  });

  // Test case for missing password
  it("should return a 400 status and error message for missing password", async () => {
    const res = await request(app)
      .post("/api/auth/signin")
      .send({ email: "jane@example.com" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Invalid value");
  });
});

describe("GET /api/auth/me", () => {
  let token;

  beforeEach(async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });

    token = res.body.token;
  });

  it("should return the current user", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("name", "John Doe");
    expect(res.body.data).toHaveProperty("email", "john@example.com");
  });

  // Test case for missing token
  it("should return a 401 status and error message for missing token", async () => {
    const res = await request(app).get("/api/auth/me");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Not authorized");
  });

  // Test case for invalid token
  it("should return a 401 status and error message for invalid token", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer invalidtoken");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Not authorized");
  });
});
