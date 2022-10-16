const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema
const commentSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("comment", commentSchema);
