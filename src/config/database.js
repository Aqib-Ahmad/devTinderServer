const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_SECRE);
};

module.exports = connectDb;
