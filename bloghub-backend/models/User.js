const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  otp: {
    type: String,
    default: null,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  subscribers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

const User = mongoose.model("user", userSchema);
module.exports = User;
