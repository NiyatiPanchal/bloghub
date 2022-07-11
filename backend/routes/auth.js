const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
require("dotenv").config();

// ROUTE 1 : Create a User using : POST "/api/auth/createuser" No Login require
router.post(
  "/createuser",
  [
    // Express validator
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 charachters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;

    //   If there are error return bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    //   Check whether the user with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      let username = await User.findOne({ username: req.body.username });

      if (user) {
        return res.status(400).json({
          success,
          error: "Sorry , a user with this email already exists",
        });
      }
      if (username) {
        return res.status(400).json({
          success,
          error: "Sorry , a user with this username already exists",
        });
      }

      const salt = await bcrypt.genSaltSync(10);
      const secPassword = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: secPassword,
      });

      const data = { user: { id: user.id } };
      const authToken = jwt.sign(data, process.env.JWT_SECRET);

      success = true;
      res.json({ success, authToken });
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 2 : Authenticate a User using : POST "/api/auth/loginuser" Login require
router.post(
  "/login",
  [
    // Express validator
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // If there are error return bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials",
        });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        success = false;
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials",
        });
      }

      const data = { user: { id: user.id } };
      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3 : Get loggedin user details : POST "/api/auth/getuser" Login require
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userID = req.user.id;
    const user = await User.findById(userID).select("-password");
    res.send(user);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
