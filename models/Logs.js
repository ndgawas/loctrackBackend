const mongoose = require("mongoose");
const { Schema } = mongoose;

const LogsSchema = new Schema(
  {
    user: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("logs", LogsSchema);
