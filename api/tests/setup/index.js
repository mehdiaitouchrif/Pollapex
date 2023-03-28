const mongoose = require("mongoose");

// Connect to the test database
const connectDB = async () => {
  const url = process.env.TEST_DATABASE_URI;
  await mongoose.connect(url);
};

const clearDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

// Disconnect from the test database
const closeDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

module.exports = { connectDB, closeDB, clearDB };
