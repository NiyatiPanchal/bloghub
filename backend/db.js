const mongoose = require("mongoose");
require("dotenv").config();
const mongoURI = `${process.env.MONGO_URI}`;
// Returns promise
const connectDB = async () => {
  mongoose.connect(mongoURI, () => console.log("Connected to MongoDB"));
};

module.exports = connectDB;
