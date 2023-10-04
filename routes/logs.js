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

module.exports = router;
