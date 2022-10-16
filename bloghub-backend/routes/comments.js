const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fetchuser = require("../middleware/fetchuser");
const Comment = require("../models/Comment");
const { body, validationResult } = require("express-validator");

router.post(
  "/addcomment",
  fetchuser,
  [
    // Express validator
    body("comment", "comment must be atleast 3 charachters").isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    var success = false;

    try {
      // If there are error return bad request and the error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const comment = await new Comment(req.body);
      if (!comment) {
        return res.status(404).send("Empty Comment");
      }
      comment.save();
      success = true;
      res.status(200).json({ success, message: "Comment saved successfully" });
    } catch (error) {
      res.status(500).json({ success, error });
    }
  }
);

router.get("/fetchcomments/:id", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).send({ success: true, message: "Internal Server Error" });
  }
});

router.delete("/deletecomment/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to be delete and delete it
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    comment = await Comment.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "Comment Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
