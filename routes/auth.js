const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = "MayureshGawas";
//Route 1
router.post(
  "/register",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const success = false;
    // checking for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    // finding if duplicate emails are there or not
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          error: "Sorry a user with this email already exist",
        });
      }
      // crete a User
      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ success: true, authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ success, error: "Internal Server Error!" });
    }
  }
);

//Route 1
router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password", "Password can't be Empty").exists(),
  ],
  async (req, res) => {
    const success = false;
    // checking for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials",
        });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      console.log(JWT_SECRET);
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ success: true, authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ success, error: "Internal Server Error!" });
    }
  }
);

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    let userid = req.user.id;
    const user = await User.findById(userid).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error! getuser");
  }
});

module.exports = router;
