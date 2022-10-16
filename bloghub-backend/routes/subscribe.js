const express = require("express");
const User = require("../models/User");
const mongoose = require("mongoose");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
require("dotenv").config();

// ROUTE 1 : Create a User using : POST "/api/auth/createuser" No Login require
router.post("/", fetchuser, async (req, res) => {
  let success = false;

  //   Check whether the user with this email exists already
  try {
    let auther = await User.findOne({ username: req.body.auther });

    if (!auther) {
      return res.status(400).json({
        success,
        error: [
          {
            value: req.body.autherID,
            msg: "Sorry , a user with this autherID does not exists",
            param: "autherID",
            location: "body",
          },
        ],
      });
    }
    const isUserUpdated = await User.updateOne(
      { _id: mongoose.Types.ObjectId(auther._id) },
      {
        $push: {
          subscribers: req.user.id,
        },
      }
    );
    success = true;
    res.json({
      success,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.post("/findsubscribers", fetchuser, async (req, res) => {
  let success = false;

  //   Check whether the user with this email exists already
  try {
    const userID = req.user.id;
    const { subscribers } = await User.findOne({
      _id: userID,
    }).select("subscribers");
    success = true;
    res.json({
      success,
      subscribers,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.post("/removesuscriber", fetchuser, async (req, res) => {
  try {
    const userID = req.user.id;

    let author = await User.findOne({ username: req.body.author });

    if (!author) {
      return res.status(400).json({
        success,
        error: [
          {
            value: req.body.author,
            msg: "Sorry , a user with this autherID does not exists",
            param: "autherID",
            location: "body",
          },
        ],
      });
    }

    const { subscribers } = await User.findOne({
      _id: author._id,
    }).select("subscribers");

    const index = subscribers.indexOf(userID);
    if (index > -1) {
      subscribers.splice(index, 1); // 2nd parameter means remove one item only
    }

    const isUserUpdated = await User.updateOne(
      { _id: mongoose.Types.ObjectId(author._id) },
      {
        $set: {
          subscribers: subscribers,
        },
      }
    );

    return res.json({ success: isUserUpdated, subscribers: subscribers });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
