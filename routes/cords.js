const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const Cords = require("../models/Cords");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");

router.get("/fetchcords", fetchuser, async (req, res) => {
  try {
    const cords = await Cords.findOne({ user: req.user.id });
    if (!cords) {
      return res.status(404).send({ msg: "Co-ordinates not Found" });
    }
    return res.status(200).send({ cords });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});

router.post("/updatecords", fetchuser, async (req, res) => {
  try {
    let cords = await Cords.findOne({ user: req.user.id });
    const { lat, lng } = req.body;
    if (cords) {
      // update
      const doc = await Cords.findOneAndUpdate(
        { user: req.user.id },
        { lat, lng },
        {
          new: true,
        }
      );
      return res.status(200).send({ doc });
    } else {
      const cord = new Cords({ lat, lng, user: req.user.id });
      const savedCord = await cord.save();
      return res.json(savedCord);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});
module.exports = router;
