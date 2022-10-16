const mongoose = require("mongoose");
require("dotenv").config();

// Returns promise
const connectDB = async () => {
  mongoose.connect(process.env.MONGO_URI, () =>
    console.log("Connected to MongoDB")
  );
};

module.exports = connectDB;
