const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const Cords = require("../models/Cords");
const User = require("../models/User");
const Logs = require("../models/Logs");
const router = express.Router();

router.get("/fetch-logs", fetchuser, async (req, res) => {
  try {
    const logs = await Logs.find({ user: req.user.id }).sort({ createdAt: -1 });
    if (!logs) {
      return res.status(404).send({ msg: "No Logs" });
    }
    return res.status(200).send({ logs });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});

router.delete("/delete-log/:id", fetchuser, async (req, res) => {
  try {
    const { id } = req.params;
    const logs = await Logs.findByIdAndDelete(id);
    //   if (!logs) {
    //     return res.status(404).send({ msg: "No Logs" });
    //   }
    return res.status(200).send({ logs });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});

router.post("/createlog", async (req, res) => {
  try {
    console.log("In update cords");
    const { mac } = req.body;
    console.log(mac);
    let user = await User.findOne({ mac: mac });
    console.log(user);
    if (!user) {
      return res.status(404).send("Wrong Mac Address!");
    }
    let cords = await Cords.findOne({ user: user._id });
    console.log(cords);
    const log = await Logs.create({
      user: user._id,
      lat: cords.lat,
      lng: cords.lng,
    });
    return res.status(200).send({ log });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});

module.exports = router;
