const request = require("supertest");
const User = require("../models/user");
const { connectDB, closeDB, clearDB } = require("./setup");
const { sendTokenResponse } = require("../utils/auth");
const app = require("../server");

describe("sendTokenResponse", () => {
  let user;
  let res;

  beforeEach(() => {
    user = {
      _id: "123456789",
      getSignedJwtToken: jest.fn().mockReturnValue("token123"),
    };

    res = {
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should create and send token cookie in response", () => {
    const expectedOptions = {
      expires: expect.any(Date),
      httpOnly: expect.any(Boolean),
    };

    sendTokenResponse(user, 200, res);

    expect(user.getSignedJwtToken).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.cookie).toHaveBeenCalledWith(
      "token",
      "token123",
      expectedOptions
    );
    expect(res.json).toHaveBeenCalledWith({ success: true, token: "token123" });
  });
});

describe("Auth Controllers", () => {
  // Connect to test database
  beforeAll(async () => {
    await connectDB();
  });

  // Clear all collections in the test database
  afterEach(async () => {
    await clearDB();
  });

  // Disconnect from test database
  afterAll(async () => {
    await closeDB();
  });

  describe("POST /api/auth/signup", () => {
    it("should return an error if email is not provided", async () => {
      const user = { name: "Test User", password: "testpassword" };

      // Make a POST request without an email
      const res = await request(app).post("/api/auth/signup").send(user);

      // Check the response status code and content
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].msg).toBe("Please enter a valid email");
    });
  });

  test("should return error if email already exists", async () => {
    const existingUser = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
    };

    // Insert an existing user into the database
    await User.create(existingUser);

    // Make a POST request to sign up with the same email
    const res = await request(app).post("/api/auth/signup").send({
      name: "Jane Doe",
      email: existingUser.email,
      password: "password456",
    });

    // Expect the response to have status 400 and error message
    expect(res.body).toMatchObject({
      success: false,
      errors: expect.arrayContaining([
        expect.objectContaining({
          msg: expect.stringMatching(/duplicate.*key/i),
        }),
      ]),
    });
  });
});
