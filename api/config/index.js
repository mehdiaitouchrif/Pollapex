module.exports = {
  port: process.env.PORT || 3001,
  dbUrl: process.env.MONGO_URI || "mongodb://localhost:27017/pollapex",
};
