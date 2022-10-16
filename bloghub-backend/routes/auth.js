const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
require("dotenv").config();
const Token = require("../models/token");
const sendEmail = require("../utils/sendemail");
const crypto = require("crypto");
const sendOTP = require("../utils/utilFun");

// ROUTE 1 : Create a User using : POST "/api/auth/createuser" No Login require
router.post(
  "/createuser",
  [
    // Express validator
    body("username", "Username must be atleast 3 characters").isLength({
      min: 3,
    }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;

    //   Check whether the user with this email exists already
    try {
      let username = await User.findOne({ username: req.body.username });

      if (username) {
        return res.status(400).json({
          success,
          error: [
            {
              value: req.body.username,
              msg: "Sorry , a user with this username already exists",
              param: "username",
              location: "body",
            },
          ],
        });
      }

      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          error: [
            {
              value: req.body.email,
              msg: "Sorry , a user with this email already exists",
              param: "email",
              location: "body",
            },
          ],
        });
      }

      //   If there are error return bad request and the error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success, error: errors.array() });
      }

      if (req.body.password !== req.body.cpassword) {
        return res.status(400).json({
          success,
          error: [
            {
              value: req.body.email,
              msg: "Password and Confirm Password doesn't match",
              param: "email",
              location: "body",
            },
          ],
        });
      }
      const salt = await bcrypt.genSaltSync(10);
      const secPassword = await bcrypt.hash(req.body.password, salt);

      const otp = await sendOTP(req.body.email);

      // Create a new user
      user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: secPassword,
        otp,
      });

      success = true;
      res.json({
        success,
      });
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
          error: [
            {
              msg: "Please try to login with correct credentials",
              param: "email",
              location: "body",
            },
          ],
        });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        success = false;
        return res.status(400).json({
          success,
          error: [
            {
              msg: "Please try to login with correct credentials",
              param: "password",
              location: "body",
            },
          ],
        });
      }

      if (!user.verified) {
        const otp = await sendOTP(user.email);
        success = false;
        return res.status(400).json({
          success,
          error: [
            {
              message:
                "User not verified, OTP is sent to your email please verify",
            },
          ],
        });
      }

      const data = { user: { id: user.id } };
      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
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

// Verify user
router.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).send({
        success: false,
        message: "User not exists with this email id",
      });
    } else if (user.otp == otp) {
      await User.updateOne({ email }, { verified: true, otp: null });
      const data = { user: { id: user.id } };
      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      res.status(200).send({
        success: true,
        authToken,
        message: "User varified successfully...!",
      });
    } else {
      res.status(400).send({
        success: false,
        message: "OTP dosent match Please enter valid otp",
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Verify user
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const otp = await sendOTP(email);
    await User.updateOne({ email }, { otp });
    res.status(200).send({
      success: true,
      message: "OTP successfully sent Please check email",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

// Reset Password
router.put("/resetpassword", async (req, res) => {
  try {
    const { email, password, cpassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).send({
        success: false,
        userexist: false,
        match: true,
        message: "User does not exist, Please provide right information",
      });
    } else if (!user.verified) {
      res.status(400).send({
        success: false,
        userexist: true,
        match: true,
        message: "User is not verified",
      });
    } else if (password !== cpassword) {
      res.status(400).send({
        success: false,
        userexist: true,
        match: false,
        message: "New Password and Confirm Password doesn't match",
      });
    } else {
      const salt = await bcrypt.genSaltSync(10);
      const secPassword = await bcrypt.hash(password, salt);
      await User.updateOne({ email }, { password: secPassword });
      res.status(200).send({
        success: true,
        userexist: true,
        match: true,
        message: "Password Reset Successfully",
      });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

// Reset Password
router.post("/forgetpassword", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).send({
        success: false,

        message: "User does not exist, Please provide right information",
      });
    }
    const otp = await sendOTP(email);
    await User.updateOne({ email }, { otp });
    res.status(200).send({
      success: true,
      message: "OTP Sent Successfully Check your mail",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
