const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const Cords = require("../models/Cords");
const User = require("../models/User");
const Logs = require("../models/Logs");
const router = express.Router();

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

router.post("/updatecords", async (req, res) => {
  try {
    console.log("In update cords");
    const { lat, lng, mac } = req.body;
    console.log(lat, lng, mac);
    let user = await User.findOne({ mac: mac });
    if (!user) {
      return res.status(404).send("Wrong Mac Address!");
    }
    const log = await Logs.create({ user: user._id, lat, lng });
    let cords = await Cords.findOne({ user: user });
    if (cords) {
      // update
      const doc = await Cords.findOneAndUpdate(
        { user: user._id },
        { lat, lng },
        {
          new: true,
        }
      );
      return res.status(200).send({ doc });
    } else {
      cords = await Cords.create({ lat, lng, user: user._id });
      return res.json(cords);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});

router.post("/updatecordsapp", async (req, res) => {
  try {
    console.log("In update cords");
    const { lat, lng, mac } = req.body;
    console.log(lat, lng, mac);
    let user = await User.findOne({ mac: mac });
    if (!user) {
      return res.status(404).send("Wrong Mac Address!");
    }
    let cords = await Cords.findOne({ user: user });
    if (cords) {
      // update
      const doc = await Cords.findOneAndUpdate(
        { user: user._id },
        { lat, lng },
        {
          new: true,
        }
      );
      return res.status(200).send({ doc });
    } else {
      cords = await Cords.create({ lat, lng, user: user._id });
      return res.json(cords);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});

module.exports = router;
