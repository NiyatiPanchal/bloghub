const mongoose = require("mongoose");

require("dotenv").config();
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@bloghub.rqplb4n.mongodb.net/?retryWrites=true&w=majority`;
// Returns promise
const connectDB = async () => {
  mongoose.connect(mongoURI, () => console.log("Connected to MongoDB"));
};

module.exports = connectDB;
