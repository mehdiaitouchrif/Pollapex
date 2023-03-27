const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JwtSecret } = require("../config");
const { connectDB, closeDB, clearDB } = require("./setup/index");

describe("User model", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  afterEach(async () => {
    await clearDB();
  });

  it("should encrypt password before saving", async () => {
    const userData = {
      email: "test@test.com",
      password: "password123",
      name: "Test User",
    };
    const user = new User(userData);
    await user.save();

    expect(user.password).not.toBe(userData.password);
  });

  it("should match passwords correctly", async () => {
    const userData = {
      email: "test@test.com",
      password: "password123",
      name: "Test User",
    };
    const user = new User(userData);
    await user.save();

    const match = await user.matchPasswords(userData.password);
    expect(match).toBe(true);

    const noMatch = await user.matchPasswords("wrongpassword");
    expect(noMatch).toBe(false);
  });

  it("should sign a JWT token", async () => {
    const user = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });

    const token = user.getSignedJwtToken();
    const decoded = jwt.verify(token, JwtSecret);

    expect(decoded.id).toBe(user.id);
  });

  it("should fail to save if email is not provided", async () => {
    const user = new User({
      name: "John Doe",
      password: "password123",
    });
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(Error);
  });
});
