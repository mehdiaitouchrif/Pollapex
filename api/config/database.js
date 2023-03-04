const mongoose = require("mongoose");
const { dbUrl } = require("./index");

const connectDb = async () => {
  try {
    const response = await mongoose.connect(dbUrl);
    console.log(`MongoDB connected ${response.connection.host}`);
  } catch (error) {
    console.log("Mongo connection error: " + error);
    process.exit(1);
  }
};

module.exports = connectDb;
